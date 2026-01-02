
import { GoogleGenAI } from "@google/genai";

// Fix: Strictly use the mandated initialization pattern using process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getCheerMessage(animal: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a friendly cartoon character like Talking Tom. The player just matched a pair of ${animal} cards. Give a short, energetic, 1-sentence cheer. Keep it cute and bubbly!`,
      config: {
        maxOutputTokens: 50,
        temperature: 0.9,
      }
    });
    return response.text?.trim() || "You're a memory master!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Amazing match! Keep going!";
  }
}

export async function getGameStartMessage(): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "You are a friendly cartoon cat. Greet the player for a memory game and wish them luck in one short, enthusiastic sentence.",
        config: {
          maxOutputTokens: 50,
          temperature: 0.8,
        }
      });
      return response.text?.trim() || "Let's play and match them all!";
    } catch (error) {
      return "Ready to test your memory? Let's go!";
    }
}
