# EcoCampus AI

A smart IoT and AI-powered energy monitoring dashboard.

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
