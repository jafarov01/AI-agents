// Security utilities for input sanitization
import path from 'path';

/**
 * Sanitize user input for logging to prevent log injection
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized input safe for logging
 */
export function sanitizeForLog(input) {
  if (typeof input !== 'string') {
    return String(input);
  }
  // Remove control characters and newlines that could break log integrity
  return input.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '');
}

/**
 * Validate and sanitize file paths to prevent path traversal
 * @param {string} userPath - User-provided path
 * @param {string} basePath - Base directory to restrict access to
 * @returns {string} - Safe resolved path
 * @throws {Error} - If path is outside allowed directory
 */
export function sanitizePath(userPath, basePath = process.cwd()) {
  const normalizedPath = path.normalize(userPath);
  const resolvedPath = path.resolve(basePath, normalizedPath);
  const resolvedBase = path.resolve(basePath);
  
  if (!resolvedPath.startsWith(resolvedBase)) {
    throw new Error('Path traversal attempt detected');
  }
  
  return resolvedPath;
}

/**
 * Validate JSON input before parsing
 * @param {string} jsonString - JSON string to validate
 * @returns {object} - Parsed JSON object
 * @throws {Error} - If JSON is invalid
 */
export function safeJsonParse(jsonString) {
  if (typeof jsonString !== 'string') {
    throw new Error('Input must be a string');
  }
  
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error.message}`);
  }
}