import React from 'react';
import { Leaf, Award, TrendingDown, Wifi } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Mon', usage: 4000 },
  { name: 'Tue', usage: 3000 },
  { name: 'Wed', usage: 2000 },
  { name: 'Thu', usage: 2780 },
  { name: 'Fri', usage: 1890 },
  { name: 'Sat', usage: 1390 },
  { name: 'Sun', usage: 1490 },
];

const StudentDashboard = () => {
  return (
    <div className="space-y-8">
       <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-900">Welcome, Student!</h1>
          <p className="text-slate-500">Here is your campus sustainability impact overview.</p>
       </div>

       {/* Impact Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <Leaf className="opacity-80" />
                    <span className="bg-white/20 px-2 py-1 rounded text-xs">This Month</span>
                </div>
                <h3 className="text-4xl font-bold mb-1">12.5%</h3>
                <p className="text-emerald-50 opacity-90">Energy Reduction</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                 <div className="flex items-center justify-between mb-4">
                    <Award className="text-amber-500" />
                    <span className="text-xs text-slate-400">Rank</span>
                </div>
                <h3 className="text-4xl font-bold text-slate-900 mb-1">#4</h3>
                <p className="text-slate-500">Dorm Block B Rank</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                 <div className="flex items-center justify-between mb-4">
                    <Wifi className="text-blue-500" />
                    <span className="text-xs text-slate-400">Status</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Excellent</h3>
                <p className="text-slate-500">Library WiFi Signal</p>
            </div>
       </div>

       {/* Chart */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
               <TrendingDown className="mr-2 text-emerald-500" /> Campus Energy Trend
           </h3>
           <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                        <CartesianGrid vertical={false} stroke="#f1f5f9" />
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                        <Area type="monotone" dataKey="usage" stroke="#10b981" fillOpacity={1} fill="url(#colorUsage)" />
                    </AreaChart>
                </ResponsiveContainer>
           </div>
       </div>

       {/* Tips */}
       <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 mb-2">Did you know?</h3>
            <p className="text-indigo-800">
                Turning off the AC when you leave the lab for more than 15 minutes can save enough energy to power a laptop for 4 hours.
            </p>
       </div>
    </div>
  );
};

export default StudentDashboard;