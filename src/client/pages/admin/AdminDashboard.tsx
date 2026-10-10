import React, { useEffect, useState } from 'react';
import { statsApi, requestsApi } from '../../api.ts';
import { PortalStats, AssistanceRequest } from '../../types.ts';
import { StatusBadge, UrgencyBadge } from '../../components/common/Badges.tsx';
import { RequestDetailsModal } from '../../components/requests/RequestDetailsModal.tsx';
import { AssignVolunteerModal } from '../../components/admin/AssignVolunteerModal.tsx';
import { useNotification } from '../../context/NotificationContext.tsx';
import {
  Users,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BarChart3,
  Layers,
  Heart,
  Eye,
  UserCheck,
  Star,
  Activity,
  Server,
} from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
  onOpenDocs: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ onNavigate, onOpenDocs }) => {
  const { showToast } = useNotification();
  const [stats, setStats] = useState<PortalStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<AssistanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AssistanceRequest | null>(null);
  const [assigningRequest, setAssigningRequest] = useState<AssistanceRequest | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, reqsData] = await Promise.all([
        statsApi.getOverview(),
        requestsApi.getAll(),
      ]);
      setStats(statsData);
      setRecentRequests(reqsData.slice(0, 6));
    } catch {
      showToast('Error loading admin statistics', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetSeed = async () => {
    if (!confirm('Reset all portal records back to initial B.Tech demo seed data?')) return;
    setIsResetting(true);
    try {
      await statsApi.resetSeed();
      showToast('Data reset successfully to initial demonstration state!', 'success');
      loadData();
    } catch {
      showToast('Reset failed', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const totals = stats?.totals;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider text-purple-200">
              Administrative Control Center
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-mono font-bold">
              {stats?.databaseStatus.usingMongoDB ? 'MongoDB Atlas' : 'Persistent Storage Engine'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Portal Operations & Activity Summary
          </h1>
          <p className="text-sm text-purple-200 max-w-xl">
            Monitor registered seniors, volunteer deployment, assistance request fulfillment, and satisfaction benchmarks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenDocs}
            className="px-4 py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            <Server className="w-4 h-4" />
            <span>Architecture Docs</span>
          </button>
          <button
            onClick={handleResetSeed}
            disabled={isResetting}
            className="px-4 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            title="Reset database to demo seed for viva evaluation"
          >
            <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting...' : 'Reset Demo Seed'}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Cards required by brief) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Senior Citizens */}
        <div
          onClick={() => onNavigate('user-management')}
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-400 transition cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Seniors</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            {totals?.seniorCitizens ?? 3}
          </div>
          <p className="text-[11px] text-blue-600 font-semibold">Manage Profiles &rarr;</p>
        </div>

        {/* Registered Volunteers */}
        <div
          onClick={() => onNavigate('volunteer-management')}
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-400 transition cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Volunteers</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            {totals?.volunteers ?? 3}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">View Roster &rarr;</p>
        </div>

        {/* Pending Requests */}
        <div
          onClick={() => onNavigate('request-management')}
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-amber-400 transition cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending (Open)</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">
            {totals?.pendingRequests ?? 1}
          </div>
          <p className="text-[11px] text-amber-600 font-semibold">Assign Volunteers &rarr;</p>
        </div>

        {/* Accepted / In Progress */}
        <div
          onClick={() => onNavigate('request-management')}
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-400 transition cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Accepted / Active</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 mt-1">
            {(totals?.acceptedRequests ?? 1) + (totals?.inProgressRequests ?? 1)}
          </div>
          <p className="text-[11px] text-indigo-600 font-semibold">Active Errands &rarr;</p>
        </div>

        {/* Completed Requests */}
        <div
          onClick={() => onNavigate('request-management')}
          className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-400 transition cursor-pointer space-y-1 col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">
            {totals?.completedRequests ?? 2}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">View Success History &rarr;</p>
        </div>
      </div>

      {/* Visual Analytics & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Request Status Breakdown Bar */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Assistance Request Lifecycle Distribution
            </h3>
            <span className="text-xs font-bold text-slate-500">
              Total: {totals?.totalRequests || 5}
            </span>
          </div>

          <div className="space-y-3 pt-2 text-xs font-semibold">
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Requested / Pending Acceptance</span>
                <span className="font-bold text-amber-600">{totals?.pendingRequests || 1}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${((totals?.pendingRequests || 1) / (totals?.totalRequests || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Accepted / Volunteer Assigned</span>
                <span className="font-bold text-blue-600">{totals?.acceptedRequests || 1}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${((totals?.acceptedRequests || 1) / (totals?.totalRequests || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>In Progress (Volunteer on-site)</span>
                <span className="font-bold text-indigo-600">{totals?.inProgressRequests || 1}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${((totals?.inProgressRequests || 1) / (totals?.totalRequests || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Completed Successfully</span>
                <span className="font-bold text-emerald-600">{totals?.completedRequests || 2}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${((totals?.completedRequests || 2) / (totals?.totalRequests || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Errands by Category
            </h3>
            <button
              onClick={() => onNavigate('category-management')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Manage &rarr;
            </button>
          </div>

          <div className="space-y-2.5 pt-1 text-xs">
            {stats?.categoryDistribution?.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100"
              >
                <span className="font-semibold text-slate-800">{cat.name}</span>
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold">
                  {cat.count} requests
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Requests Master Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Recent Assistance Requests</h3>
            <p className="text-xs text-slate-500">Live feed across all municipal sectors</p>
          </div>
          <button
            onClick={() => onNavigate('request-management')}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800"
          >
            View Master Table &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-600">
              <tr>
                <th className="p-3">Request ID</th>
                <th className="p-3">Senior Citizen</th>
                <th className="p-3">Category & Title</th>
                <th className="p-3">Schedule</th>
                <th className="p-3">Assigned Volunteer</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentRequests.map((req) => (
                <tr key={req._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold whitespace-nowrap text-slate-900">
                    <div>{req.requestId}</div>
                    <UrgencyBadge urgency={req.urgency} />
                  </td>
                  <td className="p-3 whitespace-nowrap font-bold text-slate-900">
                    {req.seniorName}
                  </td>
                  <td className="p-3 max-w-xs">
                    <span className="font-bold text-slate-900 block truncate">{req.title}</span>
                    <span className="text-blue-600 font-semibold">{req.category}</span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div>{req.scheduledDate}</div>
                    <div className="text-slate-400 text-[11px]">{req.scheduledTime}</div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {req.assignedVolunteerId ? (
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                        {req.assignedVolunteerName}
                      </span>
                    ) : (
                      <button
                        onClick={() => setAssigningRequest(req)}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-[11px] transition"
                      >
                        + Assign Volunteer
                      </button>
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-600"
                        title="View Audit Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!req.assignedVolunteerId && (
                        <button
                          onClick={() => setAssigningRequest(req)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-emerald-600 hover:text-emerald-800"
                          title="Assign Volunteer"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <RequestDetailsModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        userRole="admin"
      />

      <AssignVolunteerModal
        request={assigningRequest}
        isOpen={Boolean(assigningRequest)}
        onClose={() => setAssigningRequest(null)}
        onAssigned={loadData}
      />
    </div>
  );
};
