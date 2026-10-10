import React, { useEffect, useState } from 'react';
import { requestsApi, categoriesApi } from '../../api.ts';
import { AssistanceRequest, HelpCategory } from '../../types.ts';
import { StatusBadge, UrgencyBadge } from '../../components/common/Badges.tsx';
import { RequestDetailsModal } from '../../components/requests/RequestDetailsModal.tsx';
import { AssignVolunteerModal } from '../../components/admin/AssignVolunteerModal.tsx';
import { useNotification } from '../../context/NotificationContext.tsx';
import {
  Search,
  Filter,
  UserCheck,
  Eye,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const RequestManagementPage: React.FC = () => {
  const { showToast } = useNotification();
  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const [detailsRequest, setDetailsRequest] = useState<AssistanceRequest | null>(null);
  const [assignRequest, setAssignRequest] = useState<AssistanceRequest | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reqs, cats] = await Promise.all([
        requestsApi.getAll(),
        categoriesApi.getAll(),
      ]);
      setRequests(reqs);
      setCategories(cats);
    } catch {
      showToast('Error loading requests', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusOverride = async (id: string, newStatus: string) => {
    try {
      await requestsApi.updateStatus(id, newStatus, undefined, 'Admin status override');
      showToast(`Status updated to ${newStatus}`, 'success');
      loadData();
    } catch {
      showToast('Status override failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this assistance request?')) return;
    try {
      await requestsApi.delete(id);
      showToast('Request deleted', 'success');
      loadData();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  const filtered = requests.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.requestId.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.seniorName.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        (r.assignedVolunteerName && r.assignedVolunteerName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assistance Request Master Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Admin oversight, volunteer dispatching, and status state-machine management
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Live
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search request ID, senior, volunteer..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
          >
            <option value="all">All Statuses (Requested, Accepted, Done...)</option>
            <option value="Requested">Requested (Awaiting Volunteer)</option>
            <option value="Accepted">Accepted (Volunteer Matched)</option>
            <option value="In Progress">In Progress (Active)</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
          >
            <option value="all">All Help Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Master Requests Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Loading master requests...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">No requests matching filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-600">
                <tr>
                  <th className="p-4">ID & Urgency</th>
                  <th className="p-4">Senior Requester</th>
                  <th className="p-4">Category & Errand</th>
                  <th className="p-4">Schedule & Location</th>
                  <th className="p-4">Assigned Volunteer</th>
                  <th className="p-4">Status & Transition</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 whitespace-nowrap font-mono font-bold text-slate-900">
                      <div>{req.requestId}</div>
                      <UrgencyBadge urgency={req.urgency} />
                    </td>
                    <td className="p-4 whitespace-nowrap font-bold text-slate-900">
                      <div>{req.seniorName}</div>
                      <div className="text-slate-400 text-[11px] font-normal">{req.seniorPhone}</div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <span className="font-bold text-slate-900 block truncate">{req.title}</span>
                      <span className="text-blue-600 font-semibold">{req.category}</span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">
                        {req.scheduledDate} ({req.scheduledTime})
                      </div>
                      <div className="text-slate-400 text-[11px] truncate max-w-[160px]">
                        {req.location}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {req.assignedVolunteerId ? (
                        <div>
                          <span className="font-bold text-emerald-800 block flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                            {req.assignedVolunteerName}
                          </span>
                          <button
                            onClick={() => setAssignRequest(req)}
                            className="text-[10px] text-blue-600 hover:underline font-bold"
                          >
                            Reassign Volunteer
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAssignRequest(req)}
                          className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold text-[11px] transition"
                        >
                          + Assign Volunteer
                        </button>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <StatusBadge status={req.status} />
                        <div>
                          <select
                            value={req.status}
                            onChange={(e) => handleStatusOverride(req._id, e.target.value)}
                            className="text-[10px] font-semibold bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5"
                          >
                            <option value="Requested">Requested</option>
                            <option value="Accepted">Accepted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailsRequest(req)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-600"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setAssignRequest(req)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-emerald-700"
                          title="Assign"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
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

      <RequestDetailsModal
        request={detailsRequest}
        onClose={() => setDetailsRequest(null)}
        userRole="admin"
      />

      <AssignVolunteerModal
        request={assignRequest}
        isOpen={Boolean(assignRequest)}
        onClose={() => setAssignRequest(null)}
        onAssigned={loadData}
      />
    </div>
  );
};
