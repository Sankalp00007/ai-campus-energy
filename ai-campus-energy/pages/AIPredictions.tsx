import React, { useState } from 'react';
import { generateEnergyReport } from '../services/geminiService';
import { api } from '../services/api';
import { Sparkles, Loader2, FileText, AlertOctagon, RefreshCw, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AIPredictions = () => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if API key is present (injected by Vite)
  const isApiKeyConfigured = process.env.API_KEY && process.env.API_KEY.length > 0;

  const handleGenerateReport = async () => {
    setLoading(true);
    setReport(null); // Clear previous report
    try {
        // Gather real DB data state to feed to the AI
        const [buildings, alerts, sensors] = await Promise.all([
            api.getBuildings(),
            api.getAlerts(),
            api.getSensors()
        ]);

        const result = await generateEnergyReport(buildings, alerts, sensors);
        setReport(result);
    } catch (e) {
        console.error(e);
        setReport("Failed to fetch data for analysis.");
    } finally {
        setLoading(false);
    }
  };

  const isError = report?.includes("Failed") || report?.includes("Error");
  const isLeakedKey = report?.includes("leaked") || report?.includes("blocked");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center">
            <Sparkles className="mr-3 text-purple-500" /> AI Insights & Predictions
        </h1>
        <p className="text-slate-600 mt-2">
            Leverage Google Gemini to analyze sensor data, forecast load, and identify wastage.
        </p>
        
        {/* API Key Status Indicator */}
        <div className="mt-4 flex justify-center">
            {isApiKeyConfigured ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Gemini API Connected
                </span>
            ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                    <AlertOctagon className="w-3.5 h-3.5 mr-1.5" /> API Key Missing
                </span>
            )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center min-h-[300px] flex flex-col justify-center">
        {!report && !loading && (
            <div className="py-8">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText size={32} />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-2">Generate New Report</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    Click below to scan all active sensors, alerts, and consumption metrics to generate an actionable plan.
                </p>
                <button 
                    onClick={handleGenerateReport}
                    disabled={!isApiKeyConfigured}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Sparkles size={20} className="mr-2" />
                    Analyze with Gemini AI
                </button>
            </div>
        )}

        {loading && (
            <div className="py-12 flex flex-col items-center">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
                <p className="text-lg font-medium text-slate-700">Analyzing campus data patterns...</p>
                <p className="text-sm text-slate-500 mt-2">Connecting to Gemini 2.5 Flash Model</p>
            </div>
        )}

        {report && !loading && (
            <div className={`text-left animate-in fade-in duration-500 w-full ${isError ? 'bg-red-50 p-6 rounded-xl border border-red-200' : ''}`}>
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <h2 className={`text-xl font-bold ${isError ? 'text-red-700 flex items-center' : 'text-slate-800'}`}>
                        {isError ? <><AlertTriangle className="mr-2" /> Analysis Failed</> : 'Generated Strategy Report'}
                    </h2>
                    <button 
                        onClick={handleGenerateReport}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
                    >
                        <RefreshCw size={14} className="mr-1" /> Regenerate
                    </button>
                </div>
                
                {isLeakedKey ? (
                    <div className="text-red-800 space-y-4">
                        <div className="flex items-center space-x-3 text-red-600">
                             <ShieldAlert className="w-8 h-8" />
                             <p className="font-bold text-lg">API Key Compromised</p>
                        </div>
                        <p className="text-slate-700">
                            Google has blocked the currently configured API Key because it was detected in a public location or repository.
                        </p>
                        <div className="bg-white p-5 rounded-lg border border-red-200 shadow-sm mt-4">
                            <p className="mb-3 font-semibold text-slate-900">How to fix this:</p>
                            <ol className="list-decimal pl-5 space-y-3 text-slate-700 text-sm">
                                <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium hover:text-blue-800">Google AI Studio (API Keys)</a>.</li>
                                <li>Create a <strong>new</strong> API Key.</li>
                                <li>Update your <code>.env</code> file locally with the new key.</li>
                                <li>Restart the development server if necessary.</li>
                            </ol>
                        </div>
                    </div>
                ) : (
                    <div className={`prose max-w-none ${isError ? 'prose-red' : 'prose-slate'}`}>
                        <ReactMarkdown>{report}</ReactMarkdown>
                    </div>
                )}
            </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <h3 className="font-bold text-amber-800 flex items-center mb-2">
                <AlertOctagon className="w-5 h-5 mr-2" /> Anomaly Detection Model
            </h3>
            <p className="text-sm text-amber-700">
                The AI model continuously monitors for deviations in voltage and occupancy/power ratios. Currently, 2 anomalies detected in Science Block A (High usage, zero occupancy).
            </p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
            <h3 className="font-bold text-emerald-800 flex items-center mb-2">
                <Sparkles className="w-5 h-5 mr-2" /> Savings Potential
            </h3>
            <p className="text-sm text-emerald-700">
                Based on current trends, implementing AI-suggested auto-shutdown schedules could save approximately 14% on next month's energy bill.
            </p>
        </div>
      </div>
    </div>
  );
};

export default AIPredictions;