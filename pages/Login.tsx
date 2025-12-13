import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { Mail, Leaf, Lock, Loader2, AlertCircle, Shield, BookOpen, Briefcase } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const DEMO_USERS = [
  { label: 'Admin', email: 'admin@demo.com', password: 'password123', role: UserRole.ADMIN, icon: Shield, color: 'text-purple-600 bg-purple-50' },
  { label: 'Staff', email: 'staff@demo.com', password: 'password123', role: UserRole.STAFF, icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
  { label: 'Student', email: 'student@demo.com', password: 'password123', role: UserRole.STUDENT, icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
];

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      if (user.role === UserRole.STUDENT) {
        navigate('/student-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role,
              name: email.split('@')[0]
            }
          }
        });
        if (error) throw error;
        setInfo('Account created! Please check your email for confirmation, or try signing in if confirmation is disabled.');
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (u: typeof DEMO_USERS[0]) => {
    setEmail(u.email);
    setPassword(u.password);
    setRole(u.role);
    setLoading(true);
    setError(null);
    setInfo('Attempting to access demo account...');
    
    try {
        // 1. Try to login
        const { error: loginError } = await supabase.auth.signInWithPassword({
            email: u.email,
            password: u.password
        });

        if (!loginError) {
            // Success - Auth state listener in App.tsx will handle redirect
            return;
        }

        // 2. If login failed (likely user doesn't exist), try to Register
        if (loginError.message.includes('Invalid login credentials')) {
            setInfo('Demo account not found. Creating it now...');
            
            const { error: signUpError } = await supabase.auth.signUp({
                email: u.email,
                password: u.password,
                options: {
                    data: { role: u.role, name: u.label }
                }
            });

            if (signUpError) throw signUpError;

            // 3. Try login again after signup (works if email confirm is off)
            const { error: retryLoginError } = await supabase.auth.signInWithPassword({
                email: u.email,
                password: u.password
            });

            if (retryLoginError) {
                 if (retryLoginError.message.includes('Email not confirmed')) {
                     setInfo('Account created. Please verify the email sent to ' + u.email);
                     setLoading(false);
                 } else {
                     throw retryLoginError;
                 }
            }
        } else {
            throw loginError;
        }

    } catch (err: any) {
        console.error("Demo Login Failed:", err);
        setError("Could not access demo account. Please sign up manually.");
        setLoading(false);
        setInfo(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4">
            <Leaf className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          {isLogin ? 'Sign in to EcoCampus' : 'Create an Account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Access the IoT Energy Monitoring System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center text-sm">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                <span>{error}</span>
            </div>
          )}
          
          {info && (
            <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md flex items-center text-sm">
                <Loader2 size={16} className="mr-2 flex-shrink-0 animate-spin" />
                <span>{info}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleAuth}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 py-2 border"
                  placeholder="you@campus.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 py-2 border"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700">Role</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md border"
                >
                  <option value={UserRole.ADMIN}>Admin</option>
                  <option value={UserRole.STAFF}>Staff</option>
                  <option value={UserRole.STUDENT}>Student</option>
                </select>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (isLogin ? 'Sign in' : 'Create Account')}
              </button>
            </div>
          </form>

          {/* Demo Users Section */}
          <div className="mt-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="px-2 bg-white text-slate-400 font-semibold">
                  Quick Login (Auto-Creates Account)
                </span>
              </div>
            </div>
            
            <p className="text-xs text-center text-slate-500 mb-3">Click to automatically sign up & login.</p>
            
            <div className="grid grid-cols-3 gap-3">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.label}
                  type="button"
                  disabled={loading}
                  onClick={() => handleDemoLogin(u)}
                  className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-slate-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className={`p-2 rounded-full mb-2 ${u.color} group-hover:scale-110 transition-transform`}>
                    <u.icon size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{u.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); setInfo(null); }}
              className="w-full flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              {isLogin ? 'Create a new account' : 'Back to Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;