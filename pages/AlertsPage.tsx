import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Alert } from '../types';
import { AlertTriangle, CheckCircle, Bell, Loader2 } from 'lucide-react';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'unresolved'>('unresolved');
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const data = await api.getAlerts();
      setAlerts(data);
    } catch (error) {
      console.error("Failed to fetch alerts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      // Optimistic update
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
      await api.resolveAlert(id);
    } catch (error) {
      console.error("Failed to resolve alert", error);
      fetchAlerts(); // Revert on failure
    }
  };

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => !a.resolved);

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
          <Bell className="mr-3 text-amber-500" /> System Alerts
        </h1>
        <div className="flex space-x-2 mt-4 sm:mt-0">
            <button 
                onClick={() => setFilter('unresolved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'unresolved' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
                Unresolved
            </button>
            <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
                All History
            </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900">All Good!</h3>
                <p className="text-slate-500">No active alerts at the moment.</p>
            </div>
        ) : (
            filteredAlerts.map(alert => (
                <div key={alert.id} className={`p-5 rounded-xl border-l-4 shadow-sm bg-white ${
                    alert.resolved ? 'border-slate-300 opacity-70' : 
                    alert.severity === 'critical' ? 'border-red-500' :
                    alert.severity === 'high' ? 'border-orange-500' : 'border-amber-400'
                }`}>
                    <div className="flex justify-between items-start">
                        <div className="flex items-start">
                            <div className={`p-2 rounded-full mr-4 ${
                                alert.resolved ? 'bg-slate-100' :
                                alert.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                                    {alert.title}
                                    {alert.resolved && <span className="ml-3 px-2 py-0.5 rounded text-xs bg-slate-200 text-slate-600">RESOLVED</span>}
                                </h3>
                                <p className="text-slate-600 mt-1">{alert.message}</p>
                                <p className="text-xs text-slate-400 mt-2">{alert.timestamp.toLocaleString()}</p>
                            </div>
                        </div>
                        {!alert.resolved && (
                            <button 
                                onClick={() => handleResolve(alert.id)}
                                className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center"
                            >
                                <CheckCircle size={16} className="mr-2" />
                                Mark Resolved
                            </button>
                        )}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default AlertsPage;