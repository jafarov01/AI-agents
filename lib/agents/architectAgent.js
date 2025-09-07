// lib/agents/architectAgent.js
import { callGemini } from "../gemini.js";
import { sanitizeForLog } from "../utils/security.js";

/**
 * Generates a high-level technical architecture plan for a given feature.
 * @param {string} featureDescription - A description of the feature to be built.
 * @returns {Promise<object>} An object containing the architecture plan.
 */
export async function generateArchitecture(featureDescription) {
  if (!featureDescription || typeof featureDescription !== 'string' || featureDescription.trim().length === 0) {
    throw new Error('Feature description must be a non-empty string');
  }
  
  const prompt = `
You are a Staff Software Architect. Based on the following feature description, design a high-level technical architecture.

Your response must be a JSON object wrapped in a markdown code block with the following keys:
- "file_structure": An array of strings representing the proposed new files and directories.
- "system_diagram": A MermaidJS graph diagram (graph TD) illustrating the components and data flow.
- "technical_summary": A brief explanation of the architectural choices.

Feature Description:
${featureDescription}

Example Response Format:
\`\`\`json
{
  "file_structure": [
    "src/controllers/featureController.js",
    "src/services/featureService.js",
    "src/routes/featureRoutes.js",
    "tests/feature.test.js"
  ],
  "system_diagram": "graph TD;\\n    A[User] --> B(API Endpoint);\\n    B --> C{Controller};\\n    C --> D[Service];\\n    D --> E(Database);",
  "technical_summary": "The architecture follows a standard MVC pattern..."
}
\`\`\`
`;
  const rawResponse = await callGemini(prompt, process.env.BIG_MODEL);
  try {
    const jsonMatch = rawResponse.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    throw new Error("Invalid JSON response from Gemini.");
  } catch (e) {
    console.error("Failed to parse architecture response from Gemini:", sanitizeForLog(e.message));
    console.error("Raw response preview:", sanitizeForLog(rawResponse?.substring(0, 200) || 'No response'));
    throw new Error(`Could not generate architecture plan: ${e.message}`);
  }
}