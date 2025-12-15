import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Allow method check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Securely load API Key from server environment variables
  // Vercel/Node uses process.env.VITE_API_KEY or process.env.API_KEY
  const apiKey = process.env.VITE_API_KEY || process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server Configuration Error: API Key not found on server.' });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt in request body.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.status(200).json({ text: response.text });
  } catch (error) {
    console.error("Server-side Gemini Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}