/**
 * ZAI Query Executor
 *
 * Executes validated Prisma queries against the database.
 * Handles all read operations safely.
 */

import { prisma } from '../../lib/prisma.js';

/**
 * Execute a validated Prisma query.
 *
 * @param {object} query - The validated query { model, operation, args }
 * @param {object} sanitizedArgs - The sanitized + tenant-injected args from validator
 * @returns {Promise<{ data: any, count: number }>}
 */
export async function executeQuery(query, sanitizedArgs) {
  const { model, operation } = query;

  // Resolve the Prisma model dynamically
  if (!prisma[model]) {
    throw new Error(
      `Model "${model}" not found in Prisma client. Available models: ${Object.keys(prisma)
        .filter(k => !k.startsWith('_') && !k.startsWith('$'))
        .sort()
        .join(', ')}`
    );
  }

  const modelAccessor = prisma[model];

  // Execute the appropriate operation
  let result;
  const startTime = Date.now();

  switch (operation) {
    case 'findMany':
      result = await modelAccessor.findMany(sanitizedArgs);
      break;

    case 'findFirst':
      result = await modelAccessor.findFirst(sanitizedArgs);
      // Wrap in array for consistent response format
      result = result ? [result] : [];
      break;

    case 'findUnique':
      result = await modelAccessor.findUnique(sanitizedArgs);
      result = result ? [result] : [];
      break;

    case 'count':
      result = await modelAccessor.count(sanitizedArgs);
      break;

    case 'aggregate':
      result = await modelAccessor.aggregate(sanitizedArgs);
      break;

    case 'groupBy':
      result = await modelAccessor.groupBy(sanitizedArgs);
      break;

    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }

  const queryTimeMs = Date.now() - startTime;

  // Determine row count
  let rowCount;
  if (operation === 'count' || operation === 'aggregate') {
    rowCount = typeof result === 'number' ? result : (result?._count || 0);
  } else if (Array.isArray(result)) {
    rowCount = result.length;
  } else {
    rowCount = 1;
  }

  return {
    data: result,
    count: rowCount,
    queryTimeMs,
  };
}

/**
 * Build a safe, human-readable summary of the executed query for display.
 */
export function describeQuery(query) {
  const { model, operation, args } = query;

  const operationLabels = {
    findMany: 'Search',
    findFirst: 'Find one',
    findUnique: 'Find by ID',
    count: 'Count',
    aggregate: 'Aggregate',
    groupBy: 'Group',
  };

  const label = operationLabels[operation] || operation;
  const modelLabel = model.charAt(0).toUpperCase() + model.slice(1).replace(/([A-Z])/g, ' $1');

  // Build a readable filter summary
  const filters = [];
  if (args?.where) {
    const whereEntries = Object.entries(args.where).filter(([k]) => !k.startsWith('_'));
    for (const [key, value] of whereEntries.slice(0, 3)) {
      if (typeof value === 'object' && value !== null) {
        const subKey = Object.keys(value)[0];
        filters.push(`${key} ${subKey} ${JSON.stringify(value[subKey])}`);
      } else {
        filters.push(`${key} = ${JSON.stringify(value)}`);
      }
    }
  }

  const filterText = filters.length > 0 ? ` where ${filters.join(', ')}` : '';
  return `${label} ${modelLabel}${filterText}`;
}