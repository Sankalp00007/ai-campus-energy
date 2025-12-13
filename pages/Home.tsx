import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Zap, Wifi, Globe, ShieldCheck, BarChart3 } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 font-bold text-2xl text-slate-900">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span>EcoCampus AI</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all">
            Login to Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
          Smart IoT + AI <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
            Energy Monitoring
          </span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Transform your campus into a sustainable, intelligent ecosystem. Real-time tracking, AI-powered predictions, and automated anomaly detection.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/login" className="px-8 py-4 text-lg font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center">
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <a href="#features" className="px-8 py-4 text-lg font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">
            Learn More
          </a>
        </div>
      </section>

      {/* Stats/Grid */}
      <div className="bg-slate-50 py-24" id="features">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<Zap className="w-8 h-8 text-amber-500" />}
                    title="Real-time IoT"
                    desc="Monitor electricity, voltage, and current usage across every building instantly with our advanced sensor network."
                />
                <FeatureCard 
                    icon={<Cpu className="w-8 h-8 text-purple-500" />}
                    title="AI Predictions"
                    desc="Utilize Gemini models to forecast load, predict wastage hotspots, and suggest actionable energy-saving measures."
                />
                <FeatureCard 
                    icon={<Wifi className="w-8 h-8 text-blue-500" />}
                    title="WiFi Monitoring"
                    desc="Heatmaps for signal strength and bandwidth usage to ensure seamless connectivity for students and staff."
                />
            </div>
        </div>
      </div>

       {/* Secondary Features */}
       <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-3xl font-bold mb-6 text-slate-900">Why Energy Monitoring Matters?</h2>
                <ul className="space-y-4">
                    <li className="flex items-start">
                        <Globe className="w-6 h-6 text-emerald-500 mr-3 mt-1" />
                        <div>
                            <h4 className="font-bold text-lg">Reduce Carbon Footprint</h4>
                            <p className="text-slate-600">Active monitoring helps reduce waste, directly contributing to sustainability goals.</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <ShieldCheck className="w-6 h-6 text-emerald-500 mr-3 mt-1" />
                        <div>
                            <h4 className="font-bold text-lg">Prevent Failures</h4>
                            <p className="text-slate-600">Catch voltage spikes and equipment anomalies before they cause permanent damage.</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <BarChart3 className="w-6 h-6 text-emerald-500 mr-3 mt-1" />
                        <div>
                            <h4 className="font-bold text-lg">Cost Optimization</h4>
                            <p className="text-slate-600">Identify rooms left on overnight and cut unnecessary utility costs by up to 30%.</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 transform rotate-3 rounded-2xl opacity-20"></div>
                <img 
                    src="https://picsum.photos/800/600?grayscale" 
                    alt="Dashboard Preview" 
                    className="relative rounded-2xl shadow-2xl border border-slate-200"
                />
            </div>
        </div>
       </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center border-t border-slate-800">
        <p>© 2024 EcoCampus AI. Built for the Future.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="mb-4 bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
);

export default Home;