// lib/agents/reviewerAgent.js
import { callGemini } from "../gemini.js";

export async function reviewCodeAndTests(code, tests) {
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
