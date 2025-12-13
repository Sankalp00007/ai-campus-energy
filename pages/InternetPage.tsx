import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { WifiPoint } from '../types';
import { Wifi, Signal, SignalHigh, SignalLow, SignalZero, Loader2 } from 'lucide-react';

const InternetPage = () => {
  const [points, setPoints] = useState<WifiPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWifi = async () => {
      try {
        const data = await api.getWifiPoints();
        setPoints(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWifi();
  }, []);

  const getSignalIcon = (strength: number) => {
    if (strength > -50) return <SignalHigh className="text-emerald-500" />;
    if (strength > -70) return <Signal className="text-emerald-500" />;
    if (strength > -85) return <SignalLow className="text-amber-500" />;
    return <SignalZero className="text-red-500" />;
  };

  const getHealthColor = (strength: number) => {
     if (strength > -50) return 'bg-emerald-500';
     if (strength > -70) return 'bg-emerald-400';
     if (strength > -80) return 'bg-amber-400';
     if (strength > -90) return 'bg-orange-400';
     return 'bg-red-500';
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                <Wifi className="mr-3 text-blue-500" /> Internet & WiFi Monitoring
            </h1>
            <p className="text-slate-500">Access Point status and signal strength heatmap.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-medium text-slate-600">Network Status: Online</span>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Signal Strength Heatmap</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {points.map(point => (
                <div key={point.id} className="relative group">
                    <div 
                        className={`h-24 rounded-lg flex flex-col items-center justify-center text-white transition-all transform hover:scale-105 shadow-sm ${getHealthColor(point.signalStrength)}`}
                    >
                        <span className="font-bold text-lg">{point.signalStrength}</span>
                        <span className="text-xs opacity-90">dBm</span>
                    </div>
                    <div className="mt-2 text-center">
                        <p className="font-bold text-sm text-slate-700">{point.location}</p>
                        <p className="text-xs text-slate-400">{point.clients} clients</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Detailed List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs">
                <tr>
                    <th className="px-6 py-3">Access Point ID</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3">Signal</th>
                    <th className="px-6 py-3">Clients</th>
                    <th className="px-6 py-3">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {points.map(point => (
                    <tr key={point.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono text-xs">{point.id}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{point.location}</td>
                        <td className="px-6 py-4 flex items-center space-x-2">
                            {getSignalIcon(point.signalStrength)}
                            <span>{point.signalStrength} dBm</span>
                        </td>
                        <td className="px-6 py-4">{point.clients}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                                point.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                                point.status === 'congested' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {point.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default InternetPage;