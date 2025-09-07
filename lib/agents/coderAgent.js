// lib/agents/coderAgent.js
import { callGemini } from "../gemini.js";

export async function implementCode(testContent, existingFiles = "") {
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
