import { GoogleGenAI } from "@google/genai";
import { Building, Alert, Sensor } from '../types';

// Fallback key provided by user
const API_KEY_FALLBACK = "AIzaSyB_fk2wCgnOAvUbVMEU5H0AJLwKYVtKgEk";

const getClient = () => {
  const apiKey = process.env.API_KEY || API_KEY_FALLBACK; 
  return new GoogleGenAI({ apiKey });
};

export const generateEnergyReport = async (
  buildings: Building[],
  alerts: Alert[],
  sensors: Sensor[]
): Promise<string> => {
  const apiKey = process.env.API_KEY || API_KEY_FALLBACK;

  if (!apiKey) {
    return "API Key is missing. Please set the API_KEY environment variable to use AI features.";
  }

  // Debugging: Log partial key to ensure it's loaded correctly
  console.log("Using API Key:", apiKey.substring(0, 8) + "...");

  const ai = getClient();

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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis could be generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    let msg = "Failed to generate AI report.";
    if (error.message) msg += ` Error: ${error.message}`;
    
    // Provide hints for common errors
    if (msg.includes("404")) msg += " (Model 'gemini-2.5-flash' not found. Ensure your API key has access to this model).";
    if (msg.includes("403") || msg.includes("permission")) msg += " (Permission denied. Check API key restrictions).";
    if (msg.includes("429")) msg += " (Quota exceeded).";
    
    return msg;
  }
};