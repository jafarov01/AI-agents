// lib/gemini.js
import fetch from "node-fetch";

export async function callGemini(prompt, model = "gemini-2.5-flash") {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const body = { contents: [{ parts: [{ text: prompt }] }] };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return json?.candidates?.[0]?.content?.parts?.[0]?.text ?? JSON.stringify(json);
}
