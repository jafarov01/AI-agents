// lib/agents/testerAgent.js
import { callGemini } from "../gemini.js";

export async function writeFailingTest(featureDescription) {
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
