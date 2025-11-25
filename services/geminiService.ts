import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { AgentConfig, ChatMessage } from "../types";

// In a real production app, this would be a backend endpoint to protect the key.
// For this demo, we use the env variable directly as per instructions.
const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Constructs the full system instruction including the user's base prompt
 * and the content of their uploaded knowledge base documents.
 */
const buildSystemInstruction = (config: AgentConfig): string => {
  let instruction = `You are a helpful AI assistant for a business named "${config.businessName}".\n`;
  instruction += `Your goal is to assist visitors of the website: ${config.websiteUrl}\n\n`;
  
  if (config.systemPrompt) {
    instruction += `CORE INSTRUCTIONS:\n${config.systemPrompt}\n\n`;
  }

  if (config.documents.length > 0) {
    instruction += `KNOWLEDGE BASE (Use this to answer questions):\n`;
    config.documents.forEach((doc, index) => {
      instruction += `\n--- DOCUMENT ${index + 1}: ${doc.name} ---\n`;
      instruction += doc.content;
      instruction += `\n-----------------------------------\n`;
    });
  }

  instruction += `\nIf the answer is not in the knowledge base or instructions, politely apologize and offer to connect them with human support.`;
  
  return instruction;
};

export class GeminiService {
  private chat: Chat | null = null;
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    this.initChat();
  }

  private initChat() {
    this.chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: buildSystemInstruction(this.config),
        temperature: 0.7,
      },
    });
  }

  public async sendMessage(message: string): Promise<string> {
    if (!this.chat) {
      this.initChat();
    }

    try {
      if (!this.chat) throw new Error("Chat not initialized");
      
      const response: GenerateContentResponse = await this.chat.sendMessage({ 
        message: message 
      });
      
      return response.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      return "I'm having trouble connecting to the server right now. Please try again later.";
    }
  }

  public reset() {
    this.initChat();
  }
}