import React, { useEffect, useState } from 'react';
import { seniorsApi } from '../../api.ts';
import { User } from '../../types.ts';
import { useNotification } from '../../context/NotificationContext.tsx';
import {
  Users,
  Search,
  Phone,
  MapPin,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Eye,
  X,
  AlertCircle,
} from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const { showToast } = useNotification();
  const [seniors, setSeniors] = useState<(User & { profile: any })[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewSenior, setViewSenior] = useState<(User & { profile: any }) | null>(null);

  const loadSeniors = async () => {
    setIsLoading(true);
    try {
      const data = await seniorsApi.getAll();
      setSeniors(data);
    } catch {
      showToast('Error loading senior citizens', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSeniors();
  }, []);

  const handleToggleStatus = async (senior: User) => {
    const newStatus = senior.status === 'active' ? 'suspended' : 'active';
    try {
      await seniorsApi.updateStatus(senior._id, newStatus);
      showToast(`User status set to ${newStatus}`, 'success');
      loadSeniors();
    } catch (err: any) {
      showToast('Failed to update user status', 'error');
    }
  };

  const filtered = seniors.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Senior Citizen User Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Admin oversight of registered elders, emergency contacts, and active status
          </p>
        </div>
        <div className="px-4 py-2 bg-blue-50 text-blue-800 rounded-xl font-bold text-xs border border-blue-200">
          Total Registered: {seniors.length}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by senior name, phone, address..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Loading seniors directory...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">No senior citizens found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-600">
                <tr>
                  <th className="p-4">Senior Citizen</th>
                  <th className="p-4">Age & Location</th>
                  <th className="p-4">Emergency Contact</th>
                  <th className="p-4">Mobility / Needs</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((senior) => (
                  <tr key={senior._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                          {senior.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">
                            {senior.name}
                          </span>
                          <span className="text-slate-400 text-[11px]">{senior.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-bold text-slate-800">{senior.profile?.age || 70} Years</div>
                      <div className="text-slate-500 text-[11px] truncate max-w-[180px]">
                        {senior.address}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {senior.profile?.emergencyContactName ? (
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {senior.profile.emergencyContactName}
                          </span>
                          <span className="text-blue-700 text-[11px] font-semibold">
                            {senior.profile.emergencyContactPhone}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Primary phone only</span>
                      )}
                    </td>
                    <td className="p-4 max-w-xs">
                      <span className="text-slate-600 block truncate">
                        {senior.profile?.mobilityNeeds || 'Independent'}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          senior.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {senior.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewSenior(senior)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-600 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(senior)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                            senior.status === 'active'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {senior.status === 'active' ? 'Suspend' : 'Activate'}
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

      {/* Senior Details Modal */}
      {viewSenior && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Senior Profile & Emergency Record</h3>
              <button
                onClick={() => setViewSenior(null)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-base text-slate-900 block">{viewSenior.name}</span>
                <p>Email: {viewSenior.email}</p>
                <p>Direct Phone: {viewSenior.phone}</p>
                <p>Address: {viewSenior.address}, {viewSenior.city}</p>
              </div>

              <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl space-y-1 text-rose-950">
                <span className="font-bold uppercase tracking-wider block text-[11px]">
                  Emergency Contact
                </span>
                <p>Name: {viewSenior.profile?.emergencyContactName || 'None'}</p>
                <p>Phone: {viewSenior.profile?.emergencyContactPhone || 'None'}</p>
                <p>Relationship: {viewSenior.profile?.emergencyContactRelation || 'Family'}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl space-y-1 text-blue-950">
                <span className="font-bold uppercase tracking-wider block text-[11px]">
                  Medical & Mobility Notes
                </span>
                <p>Age: {viewSenior.profile?.age || 70} years</p>
                <p>Mobility Assistance: {viewSenior.profile?.mobilityNeeds || 'Independent'}</p>
                <p>
                  Medical Conditions:{' '}
                  {viewSenior.profile?.medicalConditions?.join(', ') || 'None listed'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewSenior(null)}
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
