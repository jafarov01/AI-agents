// lib/gemini.js
import fetch from "node-fetch";

export async function callGemini(prompt, model = "gemini-2.5-flash") {
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new Error('Prompt must be a non-empty string');
  }
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const body = { contents: [{ parts: [{ text: prompt }] }] };
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify(body),
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Invalid API key');
      }
      if (res.status === 429) {
        throw new Error('API rate limit exceeded');
      }
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }
    
    let json;
    try {
      json = await res.json();
    } catch (parseError) {
      throw new Error(`Failed to parse API response: ${parseError.message}`);
    }
    return json?.candidates?.[0]?.content?.parts?.[0]?.text ?? JSON.stringify(json);
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Network error: Unable to connect to Gemini API');
    }
    throw error;
  }
}
