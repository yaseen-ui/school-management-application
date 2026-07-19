/**
 * ZAI Query Bot API Route
 *
 * POST /api/query-bot
 * Body: { question: string, chatId?: string }
 * Auth: Bearer token
 *
 * Orchestrates: schema-context → query-generator → query-validator → query-executor → response-formatter
 * Persists chat history to ZaiChat + ZaiMessage models.
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Dynamic imports to avoid edge-runtime issues with fs
async function getBackendModules() {
  const [
    { generateQuery },
    { validateQuery },
    { executeQuery },
    { formatResponse, generateSummary },
    { prisma },
  ] = await Promise.all([
    import('@/lib/backend/modules/query-bot/query-generator.js'),
    import('@/lib/backend/modules/query-bot/query-validator.js'),
    import('@/lib/backend/modules/query-bot/query-executor.js'),
    import('@/lib/backend/modules/query-bot/response-formatter.js'),
    import('@/lib/backend/lib/prisma.js'),
  ]);

  return { generateQuery, validateQuery, executeQuery, formatResponse, generateSummary, prisma };
}

/**
 * Extract user from JWT in Authorization header.
 */
function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7).trim();
  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    return jwt.verify(token, secret) as {
      userId: string;
      email: string;
      userType: string;
      tenantId: string;
      roleIds: string[];
      permVersion: number;
    };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    if (!user.tenantId) {
      return NextResponse.json(
        { error: 'Tenant context required. Please log in from a school account.' },
        { status: 403 }
      );
    }

    // 2. Parse request body
    const body = await req.json();
    const { question, chatId: existingChatId } = body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide a question to ask.' },
        { status: 400 }
      );
    }

    // 3. Load backend modules
    let modules;
    try {
      modules = await getBackendModules();
    } catch (err) {
      console.error('[ZAI] Failed to load backend modules:', err);
      return NextResponse.json(
        { error: 'Query bot modules could not be loaded. Check server logs.' },
        { status: 500 }
      );
    }

    const { generateQuery, validateQuery, executeQuery, formatResponse, generateSummary, prisma } = modules;

    // 4. Get user permissions from DB (for RBAC validation)
    let permissions: string[] = [];
    try {
      const { resolveEffectivePermissions } = await import('@/lib/backend/rbac/engine.js');
      const permSet = await resolveEffectivePermissions({
        userId: user.userId,
        tenantId: user.tenantId,
        roleIds: user.roleIds || [],
        permVersion: user.permVersion || 0,
      });
      permissions = Array.from(permSet);
    } catch (err) {
      console.warn('[ZAI] Could not resolve permissions:', err);
    }

    // 5. Create or find chat
    let chatId = existingChatId;
    if (!chatId) {
      const newChat = await prisma.zaiChat.create({
        data: {
          tenantId: user.tenantId,
          userId: user.userId,
          title: question.trim().substring(0, 80) + (question.length > 80 ? '...' : ''),
        },
      });
      chatId = newChat.id;
    }

    // 6. Save user's question as a message
    await prisma.zaiMessage.create({
      data: {
        chatId,
        tenantId: user.tenantId,
        role: 'user',
        content: question.trim(),
      },
    });

    // 7. Fetch conversation history for context (last 10 messages)
    const previousMessages = existingChatId ? await prisma.zaiMessage.findMany({
      where: { chatId, tenantId: user.tenantId },
      orderBy: { createdAt: 'asc' },
      take: 12,
      select: { role: true, content: true },
    }) : [];

    const conversationHistory = previousMessages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    // 8. Generate Prisma query via DeepSeek (with conversation context)
    let query;
    let queryError = null;
    try {
      query = await generateQuery(question.trim(), conversationHistory);
    } catch (err: any) {
      queryError = err.message || 'Failed to generate query';
      console.error('[ZAI] Query generation error:', queryError);

      // Save error as assistant message
      await prisma.zaiMessage.create({
        data: {
          chatId,
          tenantId: user.tenantId,
          role: 'assistant',
          content: `I couldn't generate a query for that question. ${queryError}`,
          error: queryError,
        },
      });

      return NextResponse.json({
        summary: `I couldn't generate a query for: "${question}". ${queryError}. Please try rephrasing your question.`,
        data: null,
        rowCount: 0,
        error: queryError,
      });
    }

    // 8. Validate + sanitize the query
    const context = {
      tenantId: user.tenantId,
      userId: user.userId,
      permissions,
    };
    const validation = validateQuery(query, context);

    if (!validation.valid) {
      await prisma.zaiMessage.create({
        data: {
          chatId,
          tenantId: user.tenantId,
          role: 'assistant',
          content: `Query blocked: ${validation.error}`,
          error: validation.error,
        },
      });

      return NextResponse.json({
        summary: `I couldn't run that query because: ${validation.error}`,
        data: null,
        rowCount: 0,
        error: validation.error,
      });
    }

    // 9. Execute the query
    let execResult;
    try {
      execResult = await executeQuery(query, validation.sanitizedArgs);
    } catch (err: any) {
      const execError = err.message || 'Query execution failed';
      console.error('[ZAI] Query execution error:', execError);

      await prisma.zaiMessage.create({
        data: {
          chatId,
          tenantId: user.tenantId,
          role: 'assistant',
          content: `Query execution failed: ${execError}`,
          error: execError,
          queryUsed: query.args,
        },
      });

      return NextResponse.json({
        summary: `I ran into a problem executing the query: ${execError}. This might be a database issue — please try again or contact support.`,
        data: null,
        rowCount: 0,
        error: execError,
      });
    }

    // 10. Format the response
    const formatted = formatResponse(execResult, query, question.trim());

    // 11. Generate natural language summary
    let summary;
    if (process.env.DEEPSEEK_API_KEY) {
      summary = await generateSummary(formatted, question.trim());
    } else {
      // Fallback summary without LLM
      const { generateFallbackSummary } = await import('@/lib/backend/modules/query-bot/response-formatter.js');
      summary = generateFallbackSummary(formatted, question.trim());
    }

    // 12. Save assistant message to DB
    await prisma.zaiMessage.create({
      data: {
        chatId,
        tenantId: user.tenantId,
        role: 'assistant',
        content: summary,
        queryUsed: query.args,
        resultData: formatted.data,
        resultCount: formatted.rowCount,
      },
    });

    // 13. Update chat title from first question
    if (!existingChatId) {
      await prisma.zaiChat.update({
        where: { id: chatId },
        data: { title: question.trim().substring(0, 80) + (question.length > 80 ? '...' : '') },
      });
    }

    // 14. Return response
    return NextResponse.json({
      chatId,
      summary,
      data: formatted.data,
      columns: formatted.columns || [],
      rowCount: formatted.rowCount,
      queryTimeMs: formatted.queryTimeMs,
      queryUsed: formatted.queryUsed,
      warnings: validation.warnings || [],
    });
  } catch (error: any) {
    console.error('[ZAI] Unhandled error:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred while processing your query.',
        detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/query-bot?chatId=xxx
 * Retrieves chat history.
 */
export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || !user.tenantId) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { prisma } = await import('@/lib/backend/lib/prisma.js');

    const chatId = req.nextUrl.searchParams.get('chatId');

    if (chatId) {
      // Get messages for a specific chat
      const messages = await prisma.zaiMessage.findMany({
        where: { chatId, tenantId: user.tenantId },
        orderBy: { createdAt: 'asc' },
      });
      return NextResponse.json({ messages });
    }

    // Get list of chats for this user
    const chats = await prisma.zaiChat.findMany({
      where: { tenantId: user.tenantId, userId: user.userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { messages: true } },
      },
    });

    return NextResponse.json({ chats });
  } catch (error: any) {
    console.error('[ZAI] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve chat history.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/query-bot?chatId=xxx
 * Deletes a chat and its messages.
 */
export async function DELETE(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || !user.tenantId) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const chatId = req.nextUrl.searchParams.get('chatId');
    if (!chatId) {
      return NextResponse.json({ error: 'chatId is required.' }, { status: 400 });
    }

    const { prisma } = await import('@/lib/backend/lib/prisma.js');

    // Verify ownership
    const chat = await prisma.zaiChat.findFirst({
      where: { id: chatId, tenantId: user.tenantId, userId: user.userId },
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found.' }, { status: 404 });
    }

    // Cascade delete messages + chat
    await prisma.zaiChat.delete({
      where: { id: chatId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[ZAI] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete chat.' },
      { status: 500 }
    );
  }
}