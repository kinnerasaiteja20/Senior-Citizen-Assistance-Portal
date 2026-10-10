import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNotification } from '../../context/NotificationContext.tsx';
import {
  HeartHandshake,
  LogIn,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  Shield,
  Heart,
} from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
}

export const LoginPage: React.FC<Props> = ({ onNavigate }) => {
  const { login, quickDemoLogin } = useAuth();
  const { showToast } = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back! You are now logged in.', 'success');
      // Navigation is handled dynamically or to respective dashboard
      const token = localStorage.getItem('portal_token');
      if (token) {
        // Redirection based on credentials or let App.tsx navigate
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Login failed. Please check credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = async (role: 'senior' | 'volunteer' | 'admin') => {
    setIsLoading(true);
    try {
      await quickDemoLogin(role);
      showToast(`Logged in as Demo ${role.toUpperCase()}`, 'success');
      if (role === 'senior') onNavigate('senior-dashboard');
      else if (role === 'volunteer') onNavigate('volunteer-dashboard');
      else if (role === 'admin') onNavigate('admin-dashboard');
    } catch (err: any) {
      showToast('Demo login error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-blue-600/30">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Access your senior assistance requests and volunteer tasks
          </p>
        </div>

        {/* 1-Click Demo Login Box (For Viva Demonstration) */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick 1-Click Demo Logins (Viva Review):</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleDemo('senior')}
              className="py-2.5 px-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 transition flex flex-col items-center gap-1 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Senior</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('volunteer')}
              className="py-2.5 px-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 transition flex flex-col items-center gap-1 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Volunteer</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="py-2.5 px-2 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-400 rounded-xl text-xs font-bold text-slate-700 hover:text-purple-700 transition flex flex-col items-center gap-1 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Standard Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@portal.org"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLoading ? 'Signing in...' : 'Sign In with Password'}</span>
          </button>
        </form>

        {/* Footer Links */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 space-y-2">
          <p>
            Don't have an account yet?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-blue-600 font-bold hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
