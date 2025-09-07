// lib/agents/reviewerAgent.js
import { callGemini } from "../gemini.js";

// Dependency validation
function validateDependencies() {
  const missing = [];
  if (!process.env.GEMINI_API_KEY) missing.push('GEMINI_API_KEY');
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}\n\nPlease ensure your .env file has:\n- GEMINI_API_KEY: Get from https://makersuite.google.com/app/apikey`);
  }
}

export async function reviewCodeAndTests(code, tests) {
  validateDependencies();
  
  if (!code || typeof code !== 'string') {
    throw new Error('Code must be a non-empty string');
  }
  if (!tests || typeof tests !== 'string') {
    throw new Error('Tests must be a non-empty string');
  }
  const prompt = `
You are a senior code reviewer. Given the code and tests below, produce a short checklist (security, edge cases, missing tests, code style) and a short suggested diff or small fixes if appropriate.

=== CODE ===
${code}

=== TESTS ===
${tests}

Output a JSON with keys: "checklist" (array) and "suggested_fixes" (string)
`;
  const raw = await callGemini(prompt, process.env.SMALL_MODEL);
  // try to extract JSON — if not JSON, return raw
  try {
    const jsonStart = raw.indexOf("{");
    const jsonStr = raw.slice(jsonStart);
    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch (e) {
    return { checklist: [raw], suggested_fixes: "" };
  }
}
