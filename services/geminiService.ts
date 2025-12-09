import { GoogleGenAI } from "@google/genai";
import { MenuItem } from '../types';

let genAI: GoogleGenAI | null = null;

// Initialize using the environment variable
if (process.env.API_KEY) {
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const getBaristaResponse = async (
  userMessage: string,
  menu: MenuItem[]
): Promise<string> => {
  if (!genAI) {
    return "I'm sorry, my brain (API Key) is missing. Please contact the administrator.";
  }

  const menuString = menu.map(item => `${item.name} (${item.category}): $${item.price} - ${item.description}`).join('\n');

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: `You are a friendly, knowledgeable, and slightly witty barista at Lumina Cafe.
        Here is our current menu:
        ${menuString}

        Your goal is to recommend drinks or food based on the user's mood, preferences, or questions.
        - Keep responses concise (under 3 sentences unless asked for details).
        - If they are unsure, ask what flavors they like (sweet, bitter, fruity).
        - Always sound welcoming.
        - Do not invent items not on the menu.
        `,
      }
    });

    return response.text || "I'm having trouble thinking right now. Can I get you a water?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I seem to be having a bit of a headache (Connection Error). Please ask again!";
  }
};