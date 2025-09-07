// lib/agents/coderAgent.js
import { callGemini } from "../gemini.js";

// Dependency validation
function validateDependencies() {
  const missing = [];
  if (!process.env.GEMINI_API_KEY) missing.push('GEMINI_API_KEY');
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}\n\nPlease ensure your .env file has:\n- GEMINI_API_KEY: Get from https://makersuite.google.com/app/apikey`);
  }
}

export async function implementCode(testContent, existingFiles = "") {
  validateDependencies();
  
  if (!testContent || typeof testContent !== 'string') {
    throw new Error('Test content must be a non-empty string');
  }
  if (typeof existingFiles !== 'string') {
    throw new Error('Existing files must be a string');
  }
  const prompt = `
You are a concise JavaScript developer. Given the failing test content below, produce the minimal code (single file) to make the test pass. Return only the filename and code in this format:

---FILENAME---
relative/path/file.js
---CODE---
<code>

Failing test:
${testContent}

Existing files (if any):
${existingFiles}
`;
  let response;
  try {
    response = await callGemini(prompt, process.env.BIG_MODEL);
  } catch (error) {
    throw new Error(`Failed to generate code: ${error.message}`);
  }
  const match = response.match(/---FILENAME---\s*([\s\S]*?)\s*---CODE---\s*([\s\S]*)/);
  if (!match) throw new Error("Unexpected coder response format");
  return { filename: match[1].trim(), code: match[2].trim() };
}
