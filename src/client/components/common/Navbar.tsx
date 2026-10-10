import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useAccessibility } from '../../context/AccessibilityContext.tsx';
import {
  HeartHandshake,
  ShieldAlert,
  User,
  LogOut,
  Menu,
  X,
  Type,
  SunMoon,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  ChevronDown,
} from 'lucide-react';

interface Props {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenDocs: () => void;
}

export const Navbar: React.FC<Props> = ({ currentView, onNavigate, onOpenDocs }) => {
  const { user, logout, quickDemoLogin } = useAuth();
  const {
    fontSize,
    cycleFontSize,
    highContrast,
    toggleHighContrast,
    setShowSosModal,
    isSpeaking,
    stopSpeaking,
  } = useAccessibility();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleDemoSwitch = async (role: 'senior' | 'volunteer' | 'admin') => {
    setDemoMenuOpen(false);
    await quickDemoLogin(role);
    if (role === 'senior') onNavigate('senior-dashboard');
    else if (role === 'volunteer') onNavigate('volunteer-dashboard');
    else if (role === 'admin') onNavigate('admin-dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      {/* Top Utility Accessibility Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs font-medium flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-slate-400">Senior Care Helpline:</span>
          <a href="tel:18005550199" className="text-blue-400 hover:text-blue-300 font-bold">
            1800-555-0199 (24/7 Free)
          </a>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">B.Tech Engineering Capstone Project</span>
        </div>

        {/* Accessibility Toolbar */}
        <div className="flex items-center gap-2">
          {/* Read aloud indicator / stop */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1 px-2 py-0.5 bg-rose-600 text-white rounded-md text-xs font-semibold animate-pulse"
              title="Stop speech"
            >
              <VolumeX className="w-3.5 h-3.5" /> Stop Voice
            </button>
          )}

          {/* Font Size Toggle */}
          <button
            onClick={cycleFontSize}
            className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded-md transition text-slate-200 border border-slate-700 cursor-pointer"
            title="Adjust text size (Normal / Large / Extra Large)"
          >
            <Type className="w-3.5 h-3.5 text-blue-400" />
            <span className="capitalize">{fontSize === 'normal' ? 'Font: A' : fontSize === 'large' ? 'Font: A+' : 'Font: A++'}</span>
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition border cursor-pointer ${
              highContrast
                ? 'bg-amber-400 text-black border-amber-500 font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Toggle high contrast for elderly legibility"
          >
            <SunMoon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Contrast</span>
          </button>

          {/* B.Tech Docs Button */}
          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1 px-2 py-0.5 bg-blue-700 hover:bg-blue-600 text-white rounded-md transition font-semibold cursor-pointer"
            title="Open B.Tech Architecture & Project Guide"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Project Guide</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav(user ? (user.role === 'senior' ? 'senior-dashboard' : user.role === 'volunteer' ? 'volunteer-dashboard' : 'admin-dashboard') : 'home')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight block leading-tight">
                Senior Citizen <span className="text-blue-600">Assistance</span>
              </span>
              <span className="text-xs text-slate-500 font-semibold tracking-wide uppercase">
                Community Care Portal
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 font-semibold text-sm text-slate-600">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-xl transition ${
                currentView === 'home' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>

            {/* Senior Specific Links */}
            {user?.role === 'senior' && (
              <>
                <button
                  onClick={() => handleNav('senior-dashboard')}
                  className={`px-3 py-2 rounded-xl transition ${
                    currentView === 'senior-dashboard' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav('create-request')}
                  className={`px-3 py-2 rounded-xl transition ${
                    currentView === 'create-request' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  + Request Help
                </button>
                <button
                  onClick={() => handleNav('my-requests')}
                  className={`px-3 py-2 rounded-xl transition ${
                    currentView === 'my-requests' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  My Requests
                </button>
              </>
            )}

            {/* Volunteer Specific Links */}
            {user?.role === 'volunteer' && (
              <>
                <button
                  onClick={() => handleNav('volunteer-dashboard')}
                  className={`px-3 py-2 rounded-xl transition ${
                    currentView === 'volunteer-dashboard' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav('available-tasks')}
                  className={`px-3 py-2 rounded-xl transition ${
                    currentView === 'available-tasks' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Available Tasks
                </button>
                <button
                  onClick={() => handleNav('my-assigned-tasks')}
                  className={`px-3 py-2 rounded-xl transition ${
                    currentView === 'my-assigned-tasks' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Assigned Tasks
                </button>
              </>
            )}

            {/* Admin Specific Links */}
            {user?.role === 'admin' && (
              <>
                <button
                  onClick={() => handleNav('admin-dashboard')}
                  className={`px-3 py-2 rounded-xl transition ${
                    currentView === 'admin-dashboard' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => handleNav('request-management')}
                  className={`px-3 py-2 rounded-xl transition ${
                    currentView === 'request-management' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  All Requests
                </button>
                <button
                  onClick={() => handleNav('user-management')}
                  className={`px-3 py-2 rounded-xl transition ${
                    currentView === 'user-management' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Seniors
                </button>
                <button
                  onClick={() => handleNav('volunteer-management')}
                  className={`px-3 py-2 rounded-xl transition ${
                    currentView === 'volunteer-management' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Volunteers
                </button>
                <button
                  onClick={() => handleNav('category-management')}
                  className={`px-3 py-2 rounded-xl transition ${
                    currentView === 'category-management' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Categories
                </button>
              </>
            )}

            <button
              onClick={() => handleNav('feedback')}
              className={`px-3 py-2 rounded-xl transition ${
                currentView === 'feedback' ? 'text-blue-600 bg-blue-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Testimonials
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* SOS Emergency Hotline Button */}
            <button
              onClick={() => setShowSosModal(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-extrabold text-sm shadow-md shadow-rose-600/30 transition animate-pulse cursor-pointer"
              title="Immediate Emergency Assistance"
            >
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span className="tracking-wide">SOS HELP</span>
            </button>

            {/* Quick Demo Switcher Dropdown (Crucial for B.Tech demo!) */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
                title="Quick Role Demo Switcher"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Demo Persona</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-scale-up">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Switch Role for Demo
                    </p>
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('senior')}
                    className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-xs font-semibold flex items-center justify-between text-slate-700 hover:text-blue-700"
                  >
                    <div>
                      <span className="block font-bold">Margaret Higgins</span>
                      <span className="text-[11px] text-slate-500">Senior Citizen (78 yrs)</span>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] rounded-md font-bold">Senior</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('volunteer')}
                    className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 text-xs font-semibold flex items-center justify-between text-slate-700 hover:text-emerald-700"
                  >
                    <div>
                      <span className="block font-bold">Sarah Jenkins</span>
                      <span className="text-[11px] text-slate-500">Community Volunteer</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded-md font-bold">Volunteer</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full text-left px-4 py-2.5 hover:bg-purple-50 text-xs font-semibold flex items-center justify-between text-slate-700 hover:text-purple-700"
                  >
                    <div>
                      <span className="block font-bold">Dr. Arthur Sterling</span>
                      <span className="text-[11px] text-slate-500">Portal Administrator</span>
                    </div>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] rounded-md font-bold">Admin</span>
                  </button>
                </div>
              )}
            </div>

            {/* User Profile or Login/Register */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="hidden sm:block text-left text-xs">
                    <span className="block font-bold text-slate-800 truncate max-w-[100px]">{user.name}</span>
                    <span className="block capitalize text-blue-600 font-semibold">{user.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-scale-up">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="font-bold text-sm text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-md uppercase">
                        Role: {user.role}
                      </span>
                    </div>
                    <button
                      onClick={() => handleNav('profile')}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      Profile & Settings
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        handleNav('home');
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-4 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 animate-slide-down">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
          >
            Home
          </button>
          {user?.role === 'senior' && (
            <>
              <button
                onClick={() => handleNav('senior-dashboard')}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
              >
                Senior Dashboard
              </button>
              <button
                onClick={() => handleNav('create-request')}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
              >
                + Request Assistance
              </button>
              <button
                onClick={() => handleNav('my-requests')}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
              >
                My Requests
              </button>
            </>
          )}
          {user?.role === 'volunteer' && (
            <>
              <button
                onClick={() => handleNav('volunteer-dashboard')}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
              >
                Volunteer Dashboard
              </button>
              <button
                onClick={() => handleNav('available-tasks')}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
              >
                Available Tasks
              </button>
              <button
                onClick={() => handleNav('my-assigned-tasks')}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
              >
                My Assigned Tasks
              </button>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <button
                onClick={() => handleNav('admin-dashboard')}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
              >
                Admin Overview
              </button>
              <button
                onClick={() => handleNav('request-management')}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
              >
                Request Management
              </button>
              <button
                onClick={() => handleNav('user-management')}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
              >
                Senior Citizens
              </button>
              <button
                onClick={() => handleNav('volunteer-management')}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
              >
                Volunteers
              </button>
              <button
                onClick={() => handleNav('category-management')}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
              >
                Help Categories
              </button>
            </>
          )}
          <button
            onClick={() => handleNav('feedback')}
            className="w-full text-left px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
          >
            Community Testimonials
          </button>
          <div className="pt-3 border-t border-slate-200">
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Demo Personas
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDemoSwitch('senior')}
                className="py-2 bg-blue-50 text-blue-700 font-bold rounded-lg text-xs"
              >
                Senior
              </button>
              <button
                onClick={() => handleDemoSwitch('volunteer')}
                className="py-2 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-xs"
              >
                Volunteer
              </button>
              <button
                onClick={() => handleDemoSwitch('admin')}
                className="py-2 bg-purple-50 text-purple-700 font-bold rounded-lg text-xs"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
