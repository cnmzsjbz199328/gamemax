
import { GoogleGenAI } from "@google/genai";

const SKELETON_FILES = {
  catalog: 'skeletons/catalog.md',
  s1_runner: 'skeletons/s1_runner.md',
  s2_puzzle: 'skeletons/s2_puzzle.md',
  s3_shooter: 'skeletons/s3_shooter.md',
  s4_clicker: 'skeletons/s4_clicker.md',
  s5_physics: 'skeletons/s5_physics.md',
  s6_general: 'skeletons/s6_general.md',
};

async function fetchFileContent(path: string): Promise<string> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return await response.text();
}

/**
 * 获取 AI 实例的辅助函数
 */
function getAIInstance() {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not available in the environment.");
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Phase 1: Select the best skeleton ID based on user prompt
 */
export async function selectSkeletonId(userPrompt: string): Promise<string> {
  const catalogText = await fetchFileContent(SKELETON_FILES.catalog);
  
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
      Analyze the user's game request: "${userPrompt}".
      Read the game engine skeleton catalog provided below.
      Return ONLY the ID of the most suitable skeleton (e.g., "s1_runner").
      DO NOT provide any explanation, preamble, or formatting. JUST the ID.

      CATALOG:
      ${catalogText}
    `,
  });

  const skeletonId = response.text?.trim().toLowerCase() || 's6_general';
  
  // Validate ID
  if (skeletonId in SKELETON_FILES) {
    return skeletonId;
  }
  return 's6_general'; // Fallback
}

/**
 * Phase 2: Generate full HTML code based on selected skeleton
 */
export async function generateGameCode(skeletonId: string, userPrompt: string): Promise<string> {
  const skeletonContent = await fetchFileContent((SKELETON_FILES as any)[skeletonId]);
  
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `
      ${skeletonContent}

      USER REQUIREMENT: "${userPrompt}"

      TASK:
      Complete the HTML5 game implementation based on the provided [Base Code] and [Constraints] in the skeleton.
      Implement the game logic, graphics, and features requested by the user.
      Keep the code in a SINGLE HTML file.
      Ensure high visual quality using Canvas API.
      
      CRITICAL OUTPUT RULES:
      1. Return ONLY the raw HTML code.
      2. DO NOT use markdown code blocks (like \`\`\`html).
      3. DO NOT include any conversational text, explanations, or "Here is the code".
      4. The output must start exactly with "<!DOCTYPE html>" and end with "</html>".
    `,
    config: {
      temperature: 0.7,
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });

  return response.text || '';
}
