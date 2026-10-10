import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useAccessibility } from '../context/AccessibilityContext.tsx';
import { statsApi, categoriesApi } from '../api.ts';
import { HelpCategory, PortalStats } from '../types.ts';
import { CategoryIcon } from '../components/common/CategoryIcon.tsx';
import {
  HeartHandshake,
  ShieldCheck,
  PhoneCall,
  Clock,
  Heart,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Award,
  Star,
  MapPin,
  CalendarCheck,
} from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
  onOpenDocs: () => void;
}

export const LandingPage: React.FC<Props> = ({ onNavigate, onOpenDocs }) => {
  const { user, quickDemoLogin } = useAuth();
  const { setShowSosModal } = useAccessibility();
  const [stats, setStats] = useState<PortalStats | null>(null);
  const [categories, setCategories] = useState<HelpCategory[]>([]);

  useEffect(() => {
    statsApi.getOverview().then(setStats).catch(console.error);
    categoriesApi.getAll().then(setCategories).catch(console.error);
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50 pt-10 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Trusted Senior Citizen Assistance Community</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Dignified, Compassionate Support For Our{' '}
                <span className="text-blue-600 underline decoration-blue-300 decoration-wavy">
                  Senior Citizens
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Connect directly with verified, caring neighborhood volunteers for grocery deliveries,
                prescription collections, clinic appointments, technology guidance, and friendly companionship.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {user ? (
                  <button
                    onClick={() =>
                      onNavigate(
                        user.role === 'senior'
                          ? 'senior-dashboard'
                          : user.role === 'volunteer'
                          ? 'volunteer-dashboard'
                          : 'admin-dashboard'
                      )
                    }
                    className="px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-600/25 transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>Go to My Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onNavigate('create-request')}
                      className="px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-600/25 transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>Request Assistance</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onNavigate('register')}
                      className="px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 rounded-2xl font-bold text-base transition flex items-center gap-2 cursor-pointer"
                    >
                      <HeartHandshake className="w-5 h-5 text-blue-600" />
                      <span>Join as Volunteer</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => setShowSosModal(true)}
                  className="px-5 py-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-2xl font-extrabold text-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span>SOS Emergency Help</span>
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Verified Volunteers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Rapid Response Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Zero Fee Community Service</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Card Highlight */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-5 bg-blue-100">
                  <img
                    src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80"
                    alt="Volunteer assisting a senior citizen"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-800 flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Live Community Support</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">Neighborhood Care Network</h3>
                      <p className="text-xs text-slate-500">Metro City Central & Suburbs</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{stats?.totals.averageSatisfactionRating || '4.9'} / 5.0</span>
                    </div>
                  </div>

                  {/* Demo switch helper */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <p className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" /> 1-Click B.Tech Demonstration:
                    </p>
                    <div className="flex gap-1.5 mt-2">
                      <button
                        onClick={async () => {
                          await quickDemoLogin('senior');
                          onNavigate('senior-dashboard');
                        }}
                        className="flex-1 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold rounded-lg text-[11px] transition text-center"
                      >
                        Senior View
                      </button>
                      <button
                        onClick={async () => {
                          await quickDemoLogin('volunteer');
                          onNavigate('volunteer-dashboard');
                        }}
                        className="flex-1 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-lg text-[11px] transition text-center"
                      >
                        Volunteer View
                      </button>
                      <button
                        onClick={async () => {
                          await quickDemoLogin('admin');
                          onNavigate('admin-dashboard');
                        }}
                        className="flex-1 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold rounded-lg text-[11px] transition text-center"
                      >
                        Admin View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-600">
              {stats?.totals.seniorCitizens || 3}+
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-700">Registered Seniors</p>
            <p className="text-[11px] text-slate-400">Receiving regular care</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600">
              {stats?.totals.volunteers || 3}+
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-700">Active Volunteers</p>
            <p className="text-[11px] text-slate-400">Background checked</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600">
              {stats?.totals.completedRequests || 2}+
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-700">Tasks Completed</p>
            <p className="text-[11px] text-slate-400">Errands safely fulfilled</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-500">
              {stats?.totals.averageSatisfactionRating || 5.0}★
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-700">Community Rating</p>
            <p className="text-[11px] text-slate-400">From verified elders</p>
          </div>
        </div>
      </section>

      {/* Services / Assistance Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
            Our Assistance Services
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How Community Volunteers Help Seniors
          </h2>
          <p className="text-sm text-slate-600">
            Select any category below to request daily support or volunteer your time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <CategoryIcon iconName={cat.iconName} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">{cat.estimatedDuration}</span>
                <button
                  onClick={() => onNavigate('create-request')}
                  className="font-bold text-blue-600 hover:text-blue-800 transition"
                >
                  Request &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works (Step by Step for Elderly Accessibility) */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
              Simple & Accessible
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How the Assistance Portal Works
            </h2>
            <p className="text-sm text-slate-600">
              Designed specifically with large buttons, high contrast, and voice assistance for seniors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 relative">
              <span className="w-10 h-10 bg-blue-600 text-white font-extrabold text-lg rounded-2xl flex items-center justify-center shadow-md">
                1
              </span>
              <h3 className="text-lg font-bold text-slate-900">1. Submit a Help Request</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose the assistance category (groceries, medicine, hospital visit), date, time, and address.
                Optionally add mobility needs or special notes.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 relative">
              <span className="w-10 h-10 bg-emerald-600 text-white font-extrabold text-lg rounded-2xl flex items-center justify-center shadow-md">
                2
              </span>
              <h3 className="text-lg font-bold text-slate-900">2. Matched with Volunteer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A nearby verified volunteer accepts your request. You immediately receive their full name,
                direct phone number, photo, and arrival time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 relative">
              <span className="w-10 h-10 bg-purple-600 text-white font-extrabold text-lg rounded-2xl flex items-center justify-center shadow-md">
                3
              </span>
              <h3 className="text-lg font-bold text-slate-900">3. Safe Delivery & Feedback</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your volunteer fulfills the errand with dignity and warmth. Afterwards, share your rating and kind
                words to keep our community safe and supportive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
            Heartfelt Stories
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            What Our Seniors & Volunteers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-slate-700 italic text-sm leading-relaxed">
              &ldquo;Since my knee surgery, getting heavy groceries was overwhelming. Priya not only brought my fresh
              groceries but also helped place them gently on my kitchen counter. It gives me peace of mind knowing
              kind people are nearby.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                MH
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 block">Margaret Higgins (78 yrs)</span>
                <span className="text-xs text-slate-500">Metro City Resident</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-slate-700 italic text-sm leading-relaxed">
              &ldquo;Volunteering on weekends to escort elders to hospital visits has been the most meaningful part of my
              week. The portal makes coordination seamless and safe for both sides.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                SJ
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 block">Sarah Jenkins</span>
                <span className="text-xs text-slate-500">Community Volunteer (24 Tasks Done)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Project Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-md text-xs font-bold tracking-wider uppercase text-blue-200">
              B.Tech Engineering Capstone
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight">
              Ready for Engineering Viva & Project Demonstration
            </h3>
            <p className="text-sm text-blue-100 max-w-xl">
              Includes complete MongoDB/Mongoose architecture, Express REST APIs, JWT authentication,
              WCAG accessibility compliance, and pre-seeded demonstration data.
            </p>
          </div>
          <button
            onClick={onOpenDocs}
            className="px-6 py-3.5 bg-white hover:bg-blue-50 text-blue-900 rounded-2xl font-bold text-sm shadow-md transition whitespace-nowrap cursor-pointer"
          >
            Open Project Architecture Guide &rarr;
          </button>
        </div>
      </section>
    </div>
  );
};
