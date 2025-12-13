import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { Sensor, SensorType, SensorStatus } from '../types';
import { Power, Wifi, Thermometer, User, RefreshCw, Activity, Loader2 } from 'lucide-react';

const IoTData = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSensors = async () => {
    try {
      const data = await api.getSensors();
      setSensors(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sensors:", error);
    }
  };

  useEffect(() => {
    // Initial Load
    fetchSensors();

    // Polling every 5 seconds to simulate "Live" monitoring from DB
    intervalRef.current = setInterval(fetchSensors, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const getIcon = (type: SensorType) => {
    switch (type) {
      case SensorType.POWER: return <Power className="w-6 h-6 text-amber-500" />;
      case SensorType.WIFI: return <Wifi className="w-6 h-6 text-blue-500" />;
      case SensorType.TEMP: return <Thermometer className="w-6 h-6 text-red-500" />;
      case SensorType.PIR: return <User className="w-6 h-6 text-purple-500" />;
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Activity className="mr-3 text-emerald-500" /> Live Sensor Feeds
        </h1>
        <span className="flex items-center text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full animate-pulse">
            <RefreshCw className="w-3 h-3 mr-2 animate-spin" /> Live Updates (5s)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sensors.map((sensor) => (
          <div key={sensor.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all relative overflow-hidden group">
            {/* Status Indicator */}
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-10 -mt-10 rounded-full opacity-10 transition-colors ${
                sensor.status === SensorStatus.ONLINE ? 'bg-emerald-500' :
                sensor.status === SensorStatus.WARNING ? 'bg-amber-500' : 'bg-red-500'
            }`}></div>
            
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="p-3 bg-slate-50 rounded-lg group-hover:scale-110 transition-transform">
                    {getIcon(sensor.type)}
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                     sensor.status === SensorStatus.ONLINE ? 'text-emerald-600 bg-emerald-100' :
                     sensor.status === SensorStatus.WARNING ? 'text-amber-600 bg-amber-100' : 'text-red-600 bg-red-100'
                }`}>
                    {sensor.status}
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="text-lg font-bold text-slate-800">{sensor.value} <span className="text-sm font-normal text-slate-500">{sensor.unit}</span></h3>
                <p className="text-sm font-medium text-slate-900 mt-1">{sensor.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{sensor.location}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 flex justify-between items-center">
                <span className="truncate max-w-[100px]" title={sensor.id}>ID: {sensor.id}</span>
                <span>{sensor.lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IoTData;