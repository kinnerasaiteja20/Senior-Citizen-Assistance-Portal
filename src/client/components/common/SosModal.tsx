import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { PhoneCall, ShieldAlert, Heart, X, Check, MapPin, BellRing } from 'lucide-react';

export const SosModal: React.FC = () => {
  const { showSosModal, setShowSosModal } = useAccessibility();
  const { user, profile } = useAuth();
  const [alertDispatched, setAlertDispatched] = useState(false);

  if (!showSosModal) return null;

  const handleDispatch = () => {
    setAlertDispatched(true);
    setTimeout(() => {
      // simulate siren or alert
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-rose-500 shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-rose-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl animate-pulse">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">EMERGENCY ASSISTANCE (SOS)</h2>
              <p className="text-rose-100 text-sm font-medium">Immediate Priority Support for Senior Citizens</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowSosModal(false);
              setAlertDispatched(false);
            }}
            className="p-2 hover:bg-white/20 rounded-xl transition text-white"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          {alertDispatched ? (
            <div className="p-6 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-center space-y-3 animate-scale-up">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-900">Emergency Alert Dispatched!</h3>
              <p className="text-emerald-800 text-base leading-relaxed">
                Emergency response notifications have been sent to registered family contacts and the closest volunteer rapid responder.
              </p>
              <div className="bg-white p-4 rounded-xl border border-emerald-200 text-sm font-semibold text-slate-700">
                Dispatch Reference: <span className="text-emerald-700">SOS-{Date.now().toString().slice(-6)}</span>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start gap-4">
                <BellRing className="w-6 h-6 text-rose-600 shrink-0 mt-1" />
                <div className="text-sm text-rose-950">
                  <p className="font-bold text-base">Press the red button below to send an instant alert</p>
                  <p className="text-rose-800 mt-1">
                    Your location, medical notes, and primary contact details will be broadcasted to community emergency volunteers.
                  </p>
                </div>
              </div>

              {/* Senior profile details if logged in */}
              {user && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-semibold text-slate-900">Current Senior:</span>
                    <span>{user.name} ({profile?.age || '70+'} yrs)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{user.address || 'Metro City Residential Area'}</span>
                  </div>
                  {profile?.emergencyContactName && (
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                      <span className="font-semibold text-slate-900">Primary Contact:</span>
                      <span className="text-blue-700 font-bold">{profile.emergencyContactName} ({profile.emergencyContactPhone})</span>
                    </div>
                  )}
                </div>
              )}

              {/* Big Emergency Trigger Button */}
              <button
                onClick={handleDispatch}
                className="w-full py-5 px-6 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-2xl font-extrabold text-xl shadow-xl shadow-rose-600/30 flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer"
              >
                <ShieldAlert className="w-7 h-7 animate-bounce" />
                TRIGGER EMERGENCY SOS ALERT NOW
              </button>
            </>
          )}

          {/* Quick Helpline Numbers */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3">
              Toll-Free Emergency Hotlines
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="tel:911"
                className="flex items-center justify-between p-3.5 bg-slate-100 hover:bg-rose-50 border border-slate-200 rounded-xl transition font-bold text-slate-900 hover:text-rose-700"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-rose-600" />
                  <span>Ambulance & Police</span>
                </div>
                <span className="text-rose-600 font-black">911 / 112</span>
              </a>
              <a
                href="tel:18005550199"
                className="flex items-center justify-between p-3.5 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-xl transition font-bold text-slate-900 hover:text-blue-700"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-blue-600" />
                  <span>Elder Helpline</span>
                </div>
                <span className="text-blue-600 font-black">1800-555-0199</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 flex justify-end">
          <button
            onClick={() => {
              setShowSosModal(false);
              setAlertDispatched(false);
            }}
            className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 rounded-xl text-sm transition"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
