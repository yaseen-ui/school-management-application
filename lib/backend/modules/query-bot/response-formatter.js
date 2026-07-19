/**
 * ZAI Response Formatter
 *
 * Formats raw Prisma query results into a user-friendly response.
 * Optionally calls DeepSeek to generate a natural language summary of the data.
 */

import { generateQuery } from './query-generator.js';

const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';

/**
 * Format query results into a client-friendly response.
 *
 * @param {object} result - { data, count, queryTimeMs } from query-executor
 * @param {object} queryUsed - The original query { model, operation, args }
 * @param {string} question - The user's original question
 * @returns {object} Formatted response
 */
export function formatResponse(result, queryUsed, question) {
  const { data, count, queryTimeMs } = result;

  // Generate a human-readable column list from the first row
  let columns = [];
  if (Array.isArray(data) && data.length > 0) {
    columns = Object.keys(flattenRow(data[0])).map(humanizeColumnName);
  }

  // Determine if this is a tabular result or a scalar
  const isTabular = Array.isArray(data) && data.length > 0 && typeof data[0] === 'object';

  return {
    type: isTabular ? 'table' : 'scalar',
    columns,
    data: isTabular ? data.map(row => flattenRow(row)) : data,
    rowCount: count,
    queryTimeMs,
    queryUsed: queryUsed ? {
      model: queryUsed.model,
      operation: queryUsed.operation,
      filterSummary: summarizeWhere(queryUsed.args?.where || {}),
    } : null,
    question,
  };
}

/**
 * Generate a natural language summary of the results using DeepSeek.
 * This is a second LLM call to make the data more conversational.
 *
 * @param {object} formattedResult - Output from formatResponse()
 * @param {string} question - Original user question
 * @returns {Promise<string>} Natural language summary
 */
export async function generateSummary(formattedResult, question) {
  if (!DEEPSEEK_API_KEY) {
    return generateFallbackSummary(formattedResult, question);
  }

  try {
    const dataSample = Array.isArray(formattedResult.data)
      ? formattedResult.data.slice(0, 10)
      : formattedResult.data;

    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are a helpful school management assistant. Summarize query results in 2-4 concise sentences.
Format numbers and percentages clearly. Mention the total row count. Be warm but professional.
If the data is empty, say so nicely and suggest the user refine their query.`,
          },
          {
            role: 'user',
            content: `Question: "${question}"
            
Results: ${JSON.stringify(dataSample, null, 2)}
Total rows: ${formattedResult.rowCount}
Columns: ${formattedResult.columns?.join(', ') || 'N/A'}

Please summarize these results.`,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      return generateFallbackSummary(formattedResult, question);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || generateFallbackSummary(formattedResult, question);
  } catch {
    return generateFallbackSummary(formattedResult, question);
  }
}

/**
 * Fallback summary when LLM is unavailable.
 */
function generateFallbackSummary(formattedResult, question) {
  const { rowCount, data, type } = formattedResult;

  if (rowCount === 0) {
    return `I looked for results matching "${question}" but didn't find any matching data. You might want to try broadening your search or checking the criteria.`;
  }

  if (type === 'scalar') {
    return `The result for "${question}" is: ${JSON.stringify(data)}.`;
  }

  const firstFewNames = Array.isArray(data) && data.length > 0
    ? data.slice(0, 3).map(row => {
        const nameField = row.firstName || row.fullName || row.studentName || row.courseName || row.gradeName || row.sectionName || row.roleName || row.name;
        return nameField || `Row ${data.indexOf(row) + 1}`;
      }).join(', ')
    : '';

  let summary = `Found ${rowCount} result${rowCount !== 1 ? 's' : ''}`;
  if (firstFewNames) {
    summary += ` including: ${firstFewNames}${rowCount > 3 ? ' and others' : ''}`;
  }
  summary += `.`;

  return summary;
}

/**
 * Flatten a Prisma result row — extract nested object properties into dot-notation keys.
 * e.g., { student: { firstName: "John" } } → { "student.firstName": "John" }
 */
function flattenRow(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj || {})) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      // Check if it looks like a relation object (has id field + other fields)
      Object.assign(result, flattenRow(value, newKey));
    } else if (Array.isArray(value)) {
      // Skip arrays (relations) for display — too verbose
      result[newKey] = `[${value.length} items]`;
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

/**
 * Summarize the where clause into a short readable string.
 */
function summarizeWhere(where) {
  const parts = [];
  for (const [key, value] of Object.entries(where || {})) {
    if (key.startsWith('_') || key === 'tenantId') continue;
    if (typeof value === 'object' && value !== null) {
      const subKey = Object.keys(value)[0];
      const subVal = value[subKey];
      if (subKey === 'in') {
        parts.push(`${key} in (${Array.isArray(subVal) ? subVal.length + ' values' : subVal})`);
      } else {
        parts.push(`${key} ${subKey} ${JSON.stringify(subVal)}`);
      }
    } else {
      parts.push(`${key}=${value}`);
    }
  }
  return parts.join(', ') || 'all records';
}

/**
 * Convert Prisma flattened dot-notation keys to human-readable names.
 * e.g., "student.firstName" → "First Name"
 */
function humanizeColumnName(key) {
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];

  let name = lastPart
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();

  if (name.endsWith(' Id')) {
    name = name.replace(' Id', ' ID');
  }

  return name;
}

export { flattenRow, generateFallbackSummary, humanizeColumnName };
