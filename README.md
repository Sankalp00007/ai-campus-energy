# EcoCampus AI

A smart IoT and AI-powered energy monitoring dashboard.

EcoCampus AI is an AI-powered IoT-based monitoring platform designed to minimize energy wastage and enhance internet reliability across engineering campuses. It integrates smart energy meters, ESP32 modules, and Raspberry Pi nodes to collect real-time energy and network performance data, analyzes it using Google Gemini AI, and provides actionable insights through dashboards and alerts for smarter resource management.

🚀 Key Features

✔️ Real-time monitoring of power consumption and network performance
✔️ Data collection from classrooms, labs, hostels, and corridors
✔️ Secure data transmission to Node.js backend
✔️ Structured storage in Supabase (real-time + historical data)
✔️ AI-powered analysis using Google Gemini AI
✔️ Predicts energy wastage and detects network issues
✔️ Provides optimization recommendations
✔️ Real-time alerts & notifications for administrators

🏗 System Architecture

IoT Layer: Smart Energy Meters + ESP32 + Raspberry Pi
Backend: Node.js
Database: Supabase
AI Engine: Google Gemini
Alerting: Notifications / Dashboard Alerts

Data Flow:
IoT Sensors ➝ Secure Transmission ➝ Node.js Backend ➝ Supabase ➝ AI Analysis ➝ Insights & Alerts

🛠 Tech Stack

Hardware: ESP32, Raspberry Pi, Smart Energy Meters

Backend: Node.js, Express

Database: Supabase

AI: Google Gemini API

## Setup & Security

This project uses environment variables to manage sensitive API keys.

1.  **Clone the repository.**
2.  **Copy the example environment file:**
    ```bash
    cp .env.example .env
    ```
3.  **Add your keys to `.env`:**
    *   Open `.env` and paste your Google Gemini API Key (`VITE_API_KEY`).
    *   *Note: The `.env` file is ignored by git to keep your secrets safe.*
4.  **Install and Run:**
    ```bash
    npm install
    npm run dev
    ```

## Features

*   Real-time Energy Monitoring
*   AI-Powered Anomaly Detection (Gemini 2.5 Flash)
*   WiFi Signal Heatmaps
*   Student Impact Dashboard

📡 Data Captured

Energy Parameters

Power (W)

Energy Consumption (kWh)

Voltage

Current

Network Parameters

Wi-Fi Signal Strength (RSSI)

Download / Upload Speed

Latency

Packet Loss

Connected Devices Count

🤖 AI Capabilities

Predicts potential energy wastage

Detects abnormal consumption patterns

Diagnoses network bottlenecks

Recommends optimization strategies

📢 Alerts & Notifications

Energy Overuse Alerts

Abnormal Network Drop Alerts

Maintenance Warnings

Optimization Suggestions

🎯 Impact

Reduces unnecessary energy usage

Improves internet reliability

Enables data-driven campus management

Supports sustainability and smart campus development

📌 Future Enhancements

Mobile App Integration

Predictive Maintenance System

Cost Analytics Dashboard

Auto-control of devices using AI
