import React, { useEffect, useState } from 'react';
import { volunteersApi } from '../../api.ts';
import { User } from '../../types.ts';
import { useNotification } from '../../context/NotificationContext.tsx';
import {
  ShieldCheck,
  Search,
  Star,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Phone,
  Award,
} from 'lucide-react';

export const VolunteerManagementPage: React.FC = () => {
  const { showToast } = useNotification();
  const [volunteers, setVolunteers] = useState<(User & { profile: any })[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVol, setSelectedVol] = useState<(User & { profile: any }) | null>(null);

  const loadVolunteers = async () => {
    setIsLoading(true);
    try {
      const data = await volunteersApi.getAll();
      setVolunteers(data);
    } catch {
      showToast('Error loading volunteers roster', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVolunteers();
  }, []);

  const handleToggleVerification = async (vol: User & { profile: any }) => {
    const isVerified = !vol.profile?.isVerified;
    try {
      await volunteersApi.updateStatus(vol._id, { isVerified });
      showToast(`Volunteer ${isVerified ? 'verified' : 'unverified'} successfully`, 'success');
      loadVolunteers();
    } catch {
      showToast('Verification update failed', 'error');
    }
  };

  const handleToggleStatus = async (vol: User) => {
    const status = vol.status === 'active' ? 'suspended' : 'active';
    try {
      await volunteersApi.updateStatus(vol._id, { status });
      showToast(`Volunteer account set to ${status}`, 'success');
      loadVolunteers();
    } catch {
      showToast('Status update failed', 'error');
    }
  };

  const filtered = volunteers.filter((v) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q) ||
      v.phone.toLowerCase().includes(q) ||
      (v.profile?.serviceAreas && v.profile.serviceAreas.join(' ').toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Volunteer Management Roster
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Admin verification, service area coverage, performance ratings, and credential auditing
          </p>
        </div>
        <div className="px-4 py-2 bg-emerald-50 text-emerald-900 rounded-xl font-bold text-xs border border-emerald-200">
          Active Volunteers: {volunteers.filter((v) => v.status === 'active').length}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by volunteer name, area, skill..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Loading volunteer roster...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">No volunteers matched.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-600">
                <tr>
                  <th className="p-4">Volunteer</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4">Tasks Done</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Service Areas & Skills</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((vol) => (
                  <tr key={vol._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                          {vol.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">{vol.name}</span>
                          <span className="text-slate-400 text-[11px]">{vol.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleVerification(vol)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                          vol.profile?.isVerified
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                        title="Click to toggle verification badge"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{vol.profile?.isVerified ? 'Verified' : 'Pending Verification'}</span>
                      </button>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {vol.profile?.tasksCompleted || 0}
                      </span>
                      <span className="text-slate-400 text-[11px] ml-1">errands</span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-bold text-amber-500 text-sm">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>{vol.profile?.averageRating || '5.0'}</span>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <span className="text-slate-800 font-semibold block truncate">
                        {vol.profile?.serviceAreas?.join(', ') || 'Metro Area'}
                      </span>
                      <span className="text-slate-400 text-[11px] block truncate">
                        {vol.profile?.skills?.join(', ') || 'General Help'}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          vol.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {vol.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedVol(vol)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-emerald-700"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(vol)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                            vol.status === 'active'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {vol.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Volunteer Modal */}
      {selectedVol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Volunteer Profile Audit</h3>
              <button
                onClick={() => setSelectedVol(null)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-base text-slate-900 block">{selectedVol.name}</span>
                <p>Email: {selectedVol.email}</p>
                <p>Phone: {selectedVol.phone}</p>
                <p>Location: {selectedVol.address}, {selectedVol.city}</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-1 text-emerald-950">
                <span className="font-bold uppercase tracking-wider block text-[11px]">
                  Skills & Availability
                </span>
                <p>Availability: {selectedVol.profile?.availability || 'Flexible'}</p>
                <p>Skills: {selectedVol.profile?.skills?.join(', ') || 'First Aid, Safe Driving'}</p>
                <p>Coverage: {selectedVol.profile?.serviceAreas?.join(', ') || 'Metro Area'}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl space-y-1 text-blue-950">
                <span className="font-bold uppercase tracking-wider block text-[11px]">Bio & Notes</span>
                <p className="italic leading-relaxed">{selectedVol.profile?.bio || 'Passionate volunteer.'}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedVol(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
