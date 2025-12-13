import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import IoTData from './pages/IoTData';
import AlertsPage from './pages/AlertsPage';
import AIPredictions from './pages/AIPredictions';
import InternetPage from './pages/InternetPage';
import ManagementPage from './pages/ManagementPage';
import StudentDashboard from './pages/StudentDashboard';
import { User, UserRole } from './types';
import { supabase } from './services/supabaseClient';

// Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Fallback Demo Credentials (for testing without Supabase email verification)
const MOCK_USERS = [
  { email: 'admin@demo.com', password: 'password123', role: UserRole.ADMIN, name: 'Admin' },
  { email: 'staff@demo.com', password: 'password123', role: UserRole.STAFF, name: 'Staff' },
  { email: 'student@demo.com', password: 'password123', role: UserRole.STUDENT, name: 'Student' },
];

// Main App Component
const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        mapSessionToUser(session);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        mapSessionToUser(session);
      } else {
        // Only clear user if we aren't in a mock session (mock sessions don't have supabase sessions)
        // However, for simplicity, if supabase says sign out, we sign out. 
        // We will handle mock persistance only in memory for this demo.
        if (!user || !user.id.startsWith('mock-')) {
            setUser(null);
        }
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSessionToUser = (session: any) => {
    const role = (session.user.user_metadata?.role as UserRole) || UserRole.STUDENT;
    setUser({
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
      role: role
    });
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
      try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
      } catch (error) {
          console.warn("Supabase auth failed, checking mock users...", error);
          
          // Fallback: Check if it's a demo user
          const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
          if (mockUser) {
              setUser({
                  id: `mock-${Date.now()}`,
                  email: mockUser.email,
                  name: mockUser.name,
                  role: mockUser.role
              });
              return;
          }
          
          throw error;
      }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Protected Route Wrapper
  const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles: UserRole[] }) => {
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (!roles.includes(user.role)) return <Navigate to="/" replace />;
    return <Layout>{children}</Layout>;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute roles={[UserRole.ADMIN, UserRole.STAFF]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/live" element={
            <ProtectedRoute roles={[UserRole.ADMIN, UserRole.STAFF]}>
              <IoTData />
            </ProtectedRoute>
          } />

          <Route path="/alerts" element={
            <ProtectedRoute roles={[UserRole.ADMIN, UserRole.STAFF]}>
              <AlertsPage />
            </ProtectedRoute>
          } />

          <Route path="/ai-predictions" element={
            <ProtectedRoute roles={[UserRole.ADMIN]}>
              <AIPredictions />
            </ProtectedRoute>
          } />

          <Route path="/internet" element={
            <ProtectedRoute roles={[UserRole.ADMIN, UserRole.STAFF]}>
              <InternetPage />
            </ProtectedRoute>
          } />

          <Route path="/management" element={
            <ProtectedRoute roles={[UserRole.ADMIN]}>
              <ManagementPage />
            </ProtectedRoute>
          } />

          <Route path="/student-dashboard" element={
            <ProtectedRoute roles={[UserRole.STUDENT]}>
              <StudentDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
};

export default App;