import React from 'react';
import { HeartHandshake, PhoneCall, ShieldCheck, Heart, Mail, MapPin } from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
  onOpenDocs: () => void;
}

export const Footer: React.FC<Props> = ({ onNavigate, onOpenDocs }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Senior Care Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering senior citizens through dependable, compassionate community support. Connecting vetted volunteers with elders needing daily assistance.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Background-Verified Volunteers</span>
            </div>
          </div>

          {/* Col 2: Emergency Helplines */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              Emergency Hotlines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Senior Helpline: <strong className="text-white">1800-555-0199</strong> (24/7)</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Medical Emergency: <strong className="text-white">911 / 112</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>care@seniorassistance.org</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Municipal Senior Care Center, Metro City</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Navigation */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-blue-400 transition"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="hover:text-blue-400 transition"
                >
                  Member Sign In
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register')}
                  className="hover:text-blue-400 transition"
                >
                  Register as Volunteer or Senior
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('feedback')}
                  className="hover:text-blue-400 transition"
                >
                  Community Testimonials
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDocs}
                  className="text-blue-400 hover:text-blue-300 font-bold transition flex items-center gap-1"
                >
                  &bull; B.Tech System Architecture & Docs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Project Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              Academic Demonstration
            </h4>
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2 text-xs">
              <p className="text-slate-300">
                <strong>Project Title:</strong> Senior Citizen Assistance & Volunteer Matching Portal
              </p>
              <p className="text-slate-400">
                <strong>Tech Stack:</strong> React 19, Node.js, Express, MongoDB (Mongoose ODM), JWT, Axios, Tailwind CSS
              </p>
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-bold">Status: Online</span>
                <span className="text-[11px] text-slate-400 font-mono">v1.2.0-Prod</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="flex items-center gap-1">
            Developed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Senior Care & Community Solidarity &bull; &copy; 2026 All Rights Reserved
          </p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenDocs} className="hover:text-slate-400 underline">
              Project Architecture & Viva Guide
            </button>
            <span>&bull;</span>
            <span>Accessibility Compliant (WCAG 2.1 AAA)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
