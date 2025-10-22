import { JSONPath } from 'jsonpath-plus';

export function evaluate(body: string, jsonPath: string): string | null {
  try {
    const data = JSON.parse(body);
    const result = JSONPath({ path: jsonPath, json: data });
    return result && result.length > 0 ? String(result[0]) : null;
  } catch (error) {
    console.error('JSONPath evaluation error:', error);
    return null;
  }
}
