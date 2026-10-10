import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useAccessibility } from '../context/AccessibilityContext.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import {
  User,
  Phone,
  MapPin,
  Heart,
  ShieldCheck,
  Save,
  Lock,
  Type,
  SunMoon,
  Volume2,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, updateUserProfile } = useAuth();
  const { fontSize, setFontSize, highContrast, toggleHighContrast } = useAccessibility();
  const { showToast } = useNotification();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Metro City');

  // Senior specific
  const [emergencyName, setEmergencyName] = useState(profile?.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(profile?.emergencyContactPhone || '');
  const [mobilityNeeds, setMobilityNeeds] = useState(profile?.mobilityNeeds || '');

  // Volunteer specific
  const [skills, setSkills] = useState(profile?.skills?.join(', ') || '');
  const [serviceAreas, setServiceAreas] = useState(profile?.serviceAreas?.join(', ') || '');
  const [bio, setBio] = useState(profile?.bio || '');

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload: any = {
        name,
        phone,
        address,
        city,
      };

      if (user?.role === 'senior') {
        payload.profileData = {
          emergencyContactName: emergencyName,
          emergencyContactPhone: emergencyPhone,
          mobilityNeeds,
        };
      } else if (user?.role === 'volunteer') {
        payload.profileData = {
          skills: skills.split(',').map((s: string) => s.trim()).filter(Boolean),
          serviceAreas: serviceAreas.split(',').map((s: string) => s.trim()).filter(Boolean),
          bio,
        };
      }

      await updateUserProfile(payload);
      showToast('Profile and settings saved successfully!', 'success');
    } catch {
      showToast('Failed to save profile changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Profile & Preferences
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your personal details, contact preferences, and emergency information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Avatar & Role badge */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-3xl shadow-md">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900">{user?.name}</h2>
            <span className="inline-block mt-1 px-3 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider">
              {user?.role}
            </span>
            <p className="text-xs text-slate-400 mt-2">{user?.email}</p>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 text-left">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{user?.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{user?.address}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Editable Details Form */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
              Contact & Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Senior fields */}
            {user?.role === 'senior' && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="font-bold text-sm text-blue-900">
                  Emergency Contacts & Care Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Primary Contact Name
                    </label>
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      placeholder="e.g. Clara Higgins"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Emergency Phone
                    </label>
                    <input
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="+1 (555) 998-1122"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Mobility Assistance Notes
                  </label>
                  <input
                    type="text"
                    value={mobilityNeeds}
                    onChange={(e) => setMobilityNeeds(e.target.value)}
                    placeholder="Walking cane, requires elevator, etc."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            {/* Volunteer fields */}
            {user?.role === 'volunteer' && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="font-bold text-sm text-emerald-900">
                  Volunteer Services Profile
                </h4>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Skills</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="First Aid, Driving, Tech Guidance"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Service Neighborhoods
                  </label>
                  <input
                    type="text"
                    value={serviceAreas}
                    onChange={(e) => setServiceAreas(e.target.value)}
                    placeholder="Downtown, Maple District"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Short Bio</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            {/* Accessibility Preferences */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="font-bold text-sm text-slate-900">
                Elderly Accessibility Customization
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Default Font Size</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setFontSize('normal')}
                      className={`flex-1 py-1 text-[11px] font-bold rounded ${
                        fontSize === 'normal' ? 'bg-blue-600 text-white' : 'bg-white border'
                      }`}
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize('large')}
                      className={`flex-1 py-1 text-[11px] font-bold rounded ${
                        fontSize === 'large' ? 'bg-blue-600 text-white' : 'bg-white border'
                      }`}
                    >
                      A+
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize('xlarge')}
                      className={`flex-1 py-1 text-[11px] font-bold rounded ${
                        fontSize === 'xlarge' ? 'bg-blue-600 text-white' : 'bg-white border'
                      }`}
                    >
                      A++
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">High Contrast Mode</span>
                    <span className="text-[11px] text-slate-400">For vision legibility</span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleHighContrast}
                    className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                      highContrast ? 'bg-amber-400 text-black border-amber-500' : 'bg-white'
                    }`}
                  >
                    {highContrast ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
