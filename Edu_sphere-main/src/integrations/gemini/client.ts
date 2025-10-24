const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiRequest {
  contents: GeminiMessage[];
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

export class GeminiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(messages: GeminiMessage[]): Promise<string> {
    try {
      const request: GeminiRequest = {
        contents: messages,
      };

      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No response from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  async generateChatResponse(userMessage: string, context?: string): Promise<string> {
    const systemPrompt = `You are an AI assistant for EduLearn, an educational platform. Help users with their learning journey, course recommendations, and platform navigation. Be helpful, friendly, and educational.

Context: ${context || 'General educational assistance'}

User question: ${userMessage}

Provide a helpful response:`;

    const messages: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
    ];

    return await this.generateContent(messages);
  }
}

export const geminiClient = new GeminiClient(GEMINI_API_KEY);
