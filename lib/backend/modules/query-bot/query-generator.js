/**
 * ZAI Query Generator
 *
 * Calls DeepSeek API (OpenAI-compatible) to convert a natural language question
 * into a Prisma Client query parameters object.
 *
 * DeepSeek endpoint: https://api.deepseek.com/v1/chat/completions
 */

import { getSystemPrompt } from './schema-context.js';

const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

/**
 * Call DeepSeek to generate a Prisma query from a natural language question.
 *
 * @param {string} question - The user's natural language question
 * @param {Array<{ role: string, content: string }>} [conversationHistory] - Previous messages for context
 * @returns {Promise<{ model: string, operation: string, args: object }>}
 */
export async function generateQuery(question, conversationHistory = []) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY is not configured. Set it in your .env file.');
  }

  const systemPrompt = getSystemPrompt();

  // Only include text content from history (skip resultData-heavy messages)
  const cleanHistory = conversationHistory.map(m => ({
    role: m.role,
    content: m.content,
  }));

  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...cleanHistory,
        { role: 'user', content: question },
      ],
      temperature: 0.1,       // Low temperature for deterministic, accurate queries
      max_tokens: 2048,
      response_format: { type: 'json_object' },  // Force JSON output
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('DeepSeek returned an empty response');
  }

  // Parse the JSON output
  let parsed;
  try {
    parsed = typeof content === 'string' ? JSON.parse(content) : content;
  } catch (err) {
    // Sometimes the LLM wraps JSON in markdown code blocks — try to extract
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (err2) {
        throw new Error(`Failed to parse DeepSeek response as JSON: ${content.substring(0, 500)}`);
      }
    } else {
      throw new Error(`Failed to parse DeepSeek response as JSON: ${content.substring(0, 500)}`);
    }
  }

  // Validate the basic structure
  if (!parsed.model || !parsed.operation || !parsed.args) {
    throw new Error(
      `DeepSeek response missing required fields. Expected { model, operation, args }, got: ${JSON.stringify(parsed).substring(0, 200)}`
    );
  }

  return {
    model: parsed.model,
    operation: parsed.operation,
    args: parsed.args,
    rawResponse: data,
  };
}

/**
 * Test connectivity to DeepSeek API.
 * @returns {Promise<boolean>}
 */
export async function testDeepSeekConnection() {
  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}