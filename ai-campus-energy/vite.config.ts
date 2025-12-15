import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Get API key from environment variables
  // CRITICAL SECURITY: We use OR logic to check multiple naming conventions, 
  // but we NEVER fallback to a hardcoded string.
  const apiKey = env.VITE_API_KEY || env.API_KEY || "";

  // SECURITY: Only expose the API Key to the client in DEVELOPMENT mode.
  // In production, this will be an empty string, forcing the app to use the secure /api proxy.
  const exposedApiKey = mode === 'development' ? apiKey : "";

  return {
    plugins: [react()],
    define: {
      // Expose the API key as process.env.API_KEY safely
      'process.env.API_KEY': JSON.stringify(exposedApiKey)
    },
    preview: {
      allowedHosts: true
    }
  }
})