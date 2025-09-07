// lib/agents/testerAgent.js
import { callGemini } from "../gemini.js";

// Dependency validation
function validateDependencies() {
  const missing = [];
  if (!process.env.GEMINI_API_KEY) missing.push('GEMINI_API_KEY');
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}\n\nPlease ensure your .env file has:\n- GEMINI_API_KEY: Get from https://makersuite.google.com/app/apikey`);
  }
}

export async function writeFailingTest(featureDescription) {
  validateDependencies();
  
  if (!featureDescription || typeof featureDescription !== 'string') {
    throw new Error('Feature description must be a non-empty string');
  }
  const prompt = `
You are a professional test writer. Given a feature description, produce a single failing Jest unit test file (filename and JS code only) that demonstrates the desired behavior and includes descriptive test names.
Feature: ${featureDescription}

Output format:
---FILENAME---
<relative path and filename>
---CODE---
<JS code for the test file>
`;
  const response = await callGemini(prompt, process.env.BIG_MODEL);
  // parse simple delimiter format
  const fnameMatch = response.match(/---FILENAME---\s*([\s\S]*?)\s*---CODE---\s*([\s\S]*)/);
  if (!fnameMatch) throw new Error("Unexpected tester response:\n" + response);
  const filename = fnameMatch[1].trim();
  const code = fnameMatch[2].trim();
  return { filename, code };
}
