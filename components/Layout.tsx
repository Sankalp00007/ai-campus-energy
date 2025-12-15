import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  AlertTriangle, 
  BrainCircuit, 
  Wifi, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Leaf,
  Building2
} from 'lucide-react';
import { useAuth } from '../App';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { path: '/student-dashboard', label: 'My Impact', icon: Leaf, roles: [UserRole.STUDENT] },
    { path: '/live', label: 'Live IoT Data', icon: Activity, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { path: '/alerts', label: 'Alerts', icon: AlertTriangle, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { path: '/ai-predictions', label: 'AI Insights', icon: BrainCircuit, roles: [UserRole.ADMIN] },
    { path: '/internet', label: 'Net Monitor', icon: Wifi, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { path: '/management', label: 'Management', icon: Building2, roles: [UserRole.ADMIN] },
  ];

  const filteredItems = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-slate-950">
          <div className="flex items-center space-x-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span>EcoCampus</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="px-4 py-6">
          <div className="mb-6 px-2">
            <p className="text-xs uppercase text-slate-500 font-semibold mb-2">Menu</p>
            <nav className="space-y-1">
              {filteredItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon size={20} className="mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="px-2 mt-auto border-t border-slate-800 pt-6">
             <p className="text-xs uppercase text-slate-500 font-semibold mb-2">Account</p>
             <div className="flex items-center px-4 py-3 mb-2 rounded-lg bg-slate-800/50">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                  {user?.name.charAt(0)}
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                  <p className="text-xs text-slate-400 truncate capitalize">{user?.role.toLowerCase()}</p>
                </div>
             </div>
             <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors"
              >
                <LogOut size={18} className="mr-3" />
                Sign Out
              </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header (Mobile Only primarily) */}
        <header className="lg:hidden bg-white shadow-sm h-16 flex items-center px-4 justify-between z-10">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-gray-900">
            <Menu size={24} />
          </button>
          <span className="font-bold text-gray-800">EcoCampus AI</span>
          <div className="w-8"></div> {/* Spacer */}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;