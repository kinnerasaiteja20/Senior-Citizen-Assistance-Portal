import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNotification } from '../../context/NotificationContext.tsx';
import { UserRole } from '../../types.ts';
import {
  HeartHandshake,
  User,
  Heart,
  Phone,
  MapPin,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
}

export const RegisterPage: React.FC<Props> = ({ onNavigate }) => {
  const { register } = useAuth();
  const { showToast } = useNotification();
  const [role, setRole] = useState<UserRole>('senior');
  const [isLoading, setIsLoading] = useState(false);

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Metro City');

  // Senior fields
  const [age, setAge] = useState('72');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('Family');
  const [mobilityNeeds, setMobilityNeeds] = useState('Independent with cane');

  // Volunteer fields
  const [skills, setSkills] = useState('Patient Driving, Grocery Shopping, First Aid');
  const [serviceAreas, setServiceAreas] = useState('Downtown, North Suburb');
  const [availability, setAvailability] = useState('flexible');
  const [bio, setBio] = useState('Passionate about providing respectful care to senior citizens.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !phone || !address) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = {
        name,
        email,
        password,
        role,
        phone,
        address,
        city,
      };

      if (role === 'senior') {
        payload.age = Number(age) || 70;
        payload.emergencyContactName = emergencyContactName || 'Family Member';
        payload.emergencyContactPhone = emergencyContactPhone || phone;
        payload.emergencyContactRelation = emergencyContactRelation;
        payload.mobilityNeeds = mobilityNeeds;
      } else {
        payload.skills = skills.split(',').map((s) => s.trim()).filter(Boolean);
        payload.serviceAreas = serviceAreas.split(',').map((s) => s.trim()).filter(Boolean);
        payload.availability = availability;
        payload.bio = bio;
      }

      await register(payload);
      showToast('Account registered successfully! Welcome to the portal.', 'success');
      if (role === 'senior') onNavigate('senior-dashboard');
      else onNavigate('volunteer-dashboard');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Registration failed. Try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Join the Senior Citizen Assistance Portal community
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setRole('senior')}
            className={`py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
              role === 'senior'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>I am a Senior Citizen</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('volunteer')}
            className={`py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
              role === 'volunteer'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>I want to Volunteer</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'senior' ? 'e.g. Margaret Higgins' : 'e.g. Sarah Jenkins'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Residential Address *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Apartment, Street address, Neighborhood"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Senior Citizen Fields */}
          {role === 'senior' && (
            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-3">
              <h3 className="font-bold text-blue-900 text-xs uppercase tracking-wider">
                Senior Care & Emergency Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    placeholder="e.g. Clara (Daughter)"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Emergency Phone
                  </label>
                  <input
                    type="tel"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    placeholder="+1 (555) 998-1122"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Mobility Notes (e.g. Walker, Wheelchair, Avoids Stairs)
                </label>
                <input
                  type="text"
                  value={mobilityNeeds}
                  onChange={(e) => setMobilityNeeds(e.target.value)}
                  placeholder="Walking cane, elevator required..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          {/* Volunteer Fields */}
          {role === 'volunteer' && (
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-3">
              <h3 className="font-bold text-emerald-950 text-xs uppercase tracking-wider">
                Volunteer Profile & Skills
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Driving, First Aid, Tech Support"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Availability
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="flexible">Flexible / On Call</option>
                    <option value="weekends">Weekends Only</option>
                    <option value="weekdays">Weekdays Only</option>
                    <option value="all_days">All Days</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Service Areas (Neighborhoods)
                </label>
                <input
                  type="text"
                  value={serviceAreas}
                  onChange={(e) => setServiceAreas(e.target.value)}
                  placeholder="Downtown, Maple District, Westside"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-4 text-white font-extrabold rounded-xl text-base shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-4 ${
              role === 'senior'
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
            }`}
          >
            <span>{isLoading ? 'Creating Account...' : `Register as ${role === 'senior' ? 'Senior Citizen' : 'Volunteer'}`}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
          Already registered?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-blue-600 font-bold hover:underline"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
};
