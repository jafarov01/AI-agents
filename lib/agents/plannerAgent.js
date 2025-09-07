// lib/agents/plannerAgent.js
import { callGemini } from "../gemini.js";

/**
 * Shared utility to parse JSON from Gemini responses
 * @param {string} response - Raw response from Gemini
 * @returns {object|array} - Parsed JSON
 */
function parseGeminiJson(response) {
  const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                   response.match(/```\s*([\s\S]*?)\s*```/) ||
                   response.match(/{[\s\S]*}/) ||
                   response.match(/\[[\s\S]*\]/);
  
  if (jsonMatch) {
    const jsonStr = jsonMatch[1] || jsonMatch[0];
    return JSON.parse(jsonStr);
  }
  
  return JSON.parse(response);
}

export async function generateProductPlan(productIdea, stackHints = "") {
  if (!productIdea || typeof productIdea !== 'string') {
    throw new Error('Product idea must be a non-empty string');
  }

  const prompt = `
You are a product manager. Given a product idea, generate a structured plan with phases and tickets.

Product Idea: ${productIdea}
Stack Hints: ${stackHints}

Return JSON format:
{
  "stack": "recommended tech stack",
  "phases": [
    {
      "name": "Phase 1",
      "tickets": [
        {"title": "Ticket 1", "description": "..."},
        {"title": "Ticket 2", "description": "..."}
      ]
    }
  ]
}
`;

  const response = await callGemini(prompt, process.env.BIG_MODEL || 'gemini-1.5-pro-latest');
  
  // Try to extract JSON from response
  try {
    return parseGeminiJson(response);
  } catch (e) {
    console.error("Failed to parse planner response:", response?.substring(0, 200) || 'No response');
    // Return a basic structure if parsing fails
    return {
      stack: stackHints || "JavaScript/Node.js",
      phases: [{
        name: "Development Phase",
        tickets: [{
          title: productIdea,
          description: "Implement the core functionality"
        }]
      }]
    };
  }
}

export async function breakdownFeature(featureName, existingPlan = null) {
  if (!featureName || typeof featureName !== 'string' || featureName.trim().length === 0) {
    throw new Error('Feature name must be a non-empty string');
  }
  
  const prompt = `
Break down this feature into smaller development tickets:

Feature: ${featureName}
Existing Plan Context: ${existingPlan ? JSON.stringify(existingPlan) : 'None'}

Return JSON array of tickets:
[
  {"title": "Ticket 1", "description": "...", "priority": "high|medium|low"},
  {"title": "Ticket 2", "description": "...", "priority": "high|medium|low"}
]
`;

  const response = await callGemini(prompt, process.env.SMALL_MODEL || 'gemini-1.5-flash-latest');
  
  try {
    return parseGeminiJson(response);
  } catch (e) {
    console.error("Failed to parse breakdown response:", response?.substring(0, 200) || 'No response');
    return [{
      title: featureName,
      description: "Implement this feature",
      priority: "medium"
    }];
  }
}
