import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';
import { Zap, AlertTriangle, Wifi, Users, TrendingUp, Loader2 } from 'lucide-react';
import { getChartData } from '../services/mockService';
import { api } from '../services/api';
import { Building } from '../types';

const AdminDashboard = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [alertCount, setAlertCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [buildingsData, alertsData, chartMock] = await Promise.all([
        api.getBuildings(),
        api.getAlerts(),
        Promise.resolve(getChartData()) // Keep mock for history graph as DB only has snapshots
      ]);

      setBuildings(buildingsData);
      setAlertCount(alertsData.filter(a => !a.resolved && (a.severity === 'critical' || a.severity === 'high')).length);
      setChartData(chartMock);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalConsumption = buildings.reduce((acc, b) => acc + b.totalConsumption, 0).toFixed(1);
  const avgOccupancy = buildings.length > 0 
    ? Math.floor(buildings.reduce((acc, b) => acc + b.occupancy, 0) / buildings.length) 
    : 0;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600 w-8 h-8" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Real-time overview of campus energy and health.</p>
        </div>
        <div className="text-sm text-slate-400">Synced with Database</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Usage" 
          value={`${totalConsumption} kWh`} 
          icon={Zap} 
          color="text-amber-500" 
          bg="bg-amber-50"
          trend="Live Measurement" 
        />
        <KPICard 
          title="Active Alerts" 
          value={alertCount.toString()} 
          icon={AlertTriangle} 
          color="text-red-500" 
          bg="bg-red-50"
          trend="High/Critical Priority" 
        />
        <KPICard 
          title="Avg Occupancy" 
          value={`${avgOccupancy}%`} 
          icon={Users} 
          color="text-blue-500" 
          bg="bg-blue-50"
          trend="Campus Average" 
        />
        <KPICard 
          title="Network Health" 
          value="98.2%" 
          icon={Wifi} 
          color="text-emerald-500" 
          bg="bg-emerald-50"
          trend="Stable connection" 
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Energy Consumption Trends (Historical)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="usage" stroke="#f59e0b" strokeWidth={3} name="Actual (kWh)" />
                <Line type="monotone" dataKey="predicted" stroke="#94a3b8" strokeDasharray="5 5" name="Predicted (AI)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Live Usage by Building vs Occupancy</h3>
          <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildings}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} interval={0} />
                <YAxis yAxisId="left" orientation="left" stroke="#64748b" />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                <Legend />
                <Bar yAxisId="left" dataKey="totalConsumption" fill="#10b981" radius={[4, 4, 0, 0]} name="Power (kWh)" />
                <Bar yAxisId="right" dataKey="occupancy" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Occupancy (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Building Efficiency Status</h3>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs">
                    <tr>
                        <th className="px-6 py-3">Building Name</th>
                        <th className="px-6 py-3">Current Usage</th>
                        <th className="px-6 py-3">Occupancy</th>
                        <th className="px-6 py-3">Efficiency Score</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {buildings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{b.name}</td>
                            <td className="px-6 py-4">{b.totalConsumption} kWh</td>
                            <td className="px-6 py-4">{b.occupancy}%</td>
                            <td className="px-6 py-4">
                                <div className="w-full bg-slate-200 rounded-full h-2.5 max-w-[100px]">
                                    <div 
                                        className={`h-2.5 rounded-full ${b.status === 'Good' ? 'bg-emerald-500' : b.status === 'Warning' ? 'bg-amber-500' : 'bg-red-500'}`} 
                                        style={{ width: `${b.status === 'Good' ? '85%' : b.status === 'Warning' ? '60%' : '30%'}` }}
                                    ></div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    b.status === 'Good' ? 'bg-emerald-100 text-emerald-800' : 
                                    b.status === 'Warning' ? 'bg-amber-100 text-amber-800' : 
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {b.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon: Icon, color, bg, trend }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h4 className="text-2xl font-bold text-slate-900 mb-2">{value}</h4>
            <div className="flex items-center text-xs font-medium text-slate-400">
                <TrendingUp size={14} className="mr-1" />
                {trend}
            </div>
        </div>
        <div className={`p-3 rounded-lg ${bg}`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
    </div>
);

export default AdminDashboard;