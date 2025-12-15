import { GoogleGenAI } from "@google/genai";
import { Building, Alert, Sensor } from '../types';

export const generateEnergyReport = async (
  buildings: Building[],
  alerts: Alert[],
  sensors: Sensor[]
): Promise<string> => {
  const prompt = `
    You are an expert Facility Manager and Energy Analyst for a large university campus.
    Analyze the following snapshot of campus data and provide a concise, actionable report.
    
    Current Data:
    Buildings Status: ${JSON.stringify(buildings.map(b => ({ name: b.name, kwh: b.totalConsumption, occupancy: b.occupancy, status: b.status })))}
    Active Alerts: ${JSON.stringify(alerts.filter(a => !a.resolved).map(a => ({ title: a.title, msg: a.message, severity: a.severity })))}
    Key Sensors: ${JSON.stringify(sensors.slice(0, 5).map(s => ({ name: s.name, val: s.value, status: s.status })))}

    Please provide:
    1. A summary of the current energy health.
    2. Identification of "Wastage Hotspots" (where energy is high but occupancy might be low).
    3. 3 specific recommendations to reduce carbon footprint today.
    4. A prediction on potential failures based on the alerts.

    Format the response in Markdown. Use bolding and lists for readability. Keep it professional but urgent where necessary.
  `;

  try {
    // 1. DEVELOPMENT MODE: Use Client-side API Key if available
    // This allows for fast local testing without needing the backend server running
    const clientApiKey = process.env.API_KEY;
    
    if (clientApiKey && clientApiKey.length > 0) {
      console.log("Environment: Development (Using Client-side Key)");
      const ai = new GoogleGenAI({ apiKey: clientApiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || "No analysis could be generated.";
    }

    // 2. PRODUCTION MODE: Use Secure Server-side Proxy
    // If clientApiKey is empty (hidden by vite.config.ts), we call the backend
    console.log("Environment: Production (Using Secure Proxy)");
    
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
       // Try to parse the error message from the backend
       const errData = await response.json().catch(() => ({}));
       throw new Error(errData.error || `Server responded with ${response.status}`);
    }

    const data = await response.json();
    return data.text || "No analysis returned from server.";

  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    
    let msg = "Failed to generate AI report.";
    const errorMsg = (error.message || "") + " " + (JSON.stringify(error) || "");

    // Specific check for leaked key error (works for both client and proxy if forwarded)
    if (errorMsg.includes("leaked") || errorMsg.includes("revoked") || errorMsg.includes("compromised")) {
      return "CRITICAL ERROR: Your API key was reported as leaked and has been blocked by Google. You must generate a new API key at aistudio.google.com and update your configuration.";
    }
    
    if (error.message) msg += ` Error: ${error.message}`;
    
    // Provide hints for common errors
    if (msg.includes("404") && !msg.includes("model")) msg += " (Proxy endpoint not found. If running locally, ensure 'npm run dev' has access to the API key, or use 'vercel dev' to test the backend function).";
    if (msg.includes("model") && msg.includes("404")) msg += " (Model 'gemini-2.5-flash' not found).";
    if (msg.includes("403") || msg.includes("permission")) msg += " (Permission denied. Check API key restrictions).";
    if (msg.includes("429")) msg += " (Quota exceeded).";
    
    return msg;
  }
};