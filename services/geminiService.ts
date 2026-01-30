import { GoogleGenAI } from "@google/genai";
import { GeminiModel } from '../types';

let ai: GoogleGenAI | null = null;

// Initialize the API client securely
try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  } else {
    console.warn("API_KEY is missing. Gemini features will be disabled.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini Client", error);
}

export const generateAIDJResponse = async (
  chatHistory: string[],
  currentSong: string
): Promise<string> => {
  if (!ai) return "API Key not configured. I can't speak right now!";

  try {
    const prompt = `
      You are "GrooveBot", a cool, energetic AI DJ in a music listening room with friends.
      
      Current Song Playing: "${currentSong}"
      
      Recent Chat Context:
      ${chatHistory.join('\n')}
      
      Instructions:
      1. Respond to the chat or comment on the current song.
      2. Keep it short (under 1 sentence).
      3. Be casual, maybe use an emoji.
      4. If asked for a suggestion, suggest a song title and artist.
      5. Speak Turkish if the users are speaking Turkish, otherwise English. (The users are likely speaking Turkish).
    `;

    const response = await ai.models.generateContent({
      model: GeminiModel.FLASH,
      contents: prompt,
    });

    return response.text?.trim() || "Müzik ruhun gıdasıdır! 🎵";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Bağlantıda bir sorun oldu, ama müzik devam ediyor! 🎧";
  }
};
