import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies for API requests
app.use(express.json());

// Serve static files from the Vite build output (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// Secure API Proxy for Gemini
app.post('/api/analyze', async (req, res) => {
  // Retrieve key from server-side environment variables
  const apiKey = process.env.API_KEY || process.env.VITE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server Configuration Error: API Key not found.' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Handle SPA routing: serve index.html for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});