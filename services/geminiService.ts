import { GoogleGenAI } from "@google/genai";
import { Building, Alert, Sensor } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY || ''; 
  return new GoogleGenAI({ apiKey });
};

export const generateEnergyReport = async (
  buildings: Building[],
  alerts: Alert[],
  sensors: Sensor[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is missing. Please set the API_KEY environment variable to use AI features.";
  }

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
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate AI report. Please check your API key and try again.";
  }
};