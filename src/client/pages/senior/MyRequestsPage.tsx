import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { requestsApi } from '../../api.ts';
import { AssistanceRequest } from '../../types.ts';
import { StatusBadge, UrgencyBadge } from '../../components/common/Badges.tsx';
import { RequestDetailsModal } from '../../components/requests/RequestDetailsModal.tsx';
import { FeedbackModal } from '../../components/requests/FeedbackModal.tsx';
import { useNotification } from '../../context/NotificationContext.tsx';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Eye,
  Star,
  PlusCircle,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
}

export const MyRequestsPage: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [detailsRequest, setDetailsRequest] = useState<AssistanceRequest | null>(null);
  const [feedbackRequest, setFeedbackRequest] = useState<AssistanceRequest | null>(null);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await requestsApi.getAll();
      setRequests(data);
    } catch (err) {
      showToast('Failed to load requests history', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await requestsApi.updateStatus(id, newStatus);
      showToast(`Request status updated to ${newStatus}`, 'success');
      loadRequests();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to update status', 'error');
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (selectedFilter === 'active') {
      if (!['Requested', 'Accepted', 'In Progress'].includes(r.status)) return false;
    } else if (selectedFilter === 'completed') {
      if (r.status !== 'Completed') return false;
    } else if (selectedFilter === 'cancelled') {
      if (r.status !== 'Cancelled' && r.status !== 'Rejected') return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.requestId.toLowerCase().includes(q) ||
        (r.assignedVolunteerName && r.assignedVolunteerName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Heading & New Request button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Assistance Requests
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track volunteer assignments, errand statuses, and submit feedback
          </p>
        </div>
        <button
          onClick={() => onNavigate('create-request')}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-5 h-5" />
          <span>+ Request New Help</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex overflow-x-auto gap-2 text-xs font-bold p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              selectedFilter === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Requests ({requests.length})
          </button>
          <button
            onClick={() => setSelectedFilter('active')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              selectedFilter === 'active' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active ({requests.filter((r) => ['Requested', 'Accepted', 'In Progress'].includes(r.status)).length})
          </button>
          <button
            onClick={() => setSelectedFilter('completed')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              selectedFilter === 'completed' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({requests.filter((r) => r.status === 'Completed').length})
          </button>
          <button
            onClick={() => setSelectedFilter('cancelled')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              selectedFilter === 'cancelled' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancelled ({requests.filter((r) => ['Cancelled', 'Rejected'].includes(r.status)).length})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or volunteer..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Requests Table / Card List */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-sm font-semibold text-slate-500">Loading your assistance records...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No requests match this filter</h3>
          <p className="text-xs text-slate-500">
            {selectedFilter !== 'all'
              ? 'Try switching to the "All Requests" tab above.'
              : 'You have not submitted any assistance requests yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-600">
                <tr>
                  <th className="p-4">Request ID</th>
                  <th className="p-4">Category & Title</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Assigned Volunteer</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <div>{req.requestId}</div>
                      <UrgencyBadge urgency={req.urgency} />
                    </td>
                    <td className="p-4 max-w-xs">
                      <span className="font-bold text-sm text-slate-900 block truncate">
                        {req.title}
                      </span>
                      <span className="text-blue-600 font-semibold">{req.category}</span>
                      <p className="text-slate-400 text-[11px] truncate mt-0.5">{req.location}</p>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        {req.scheduledDate}
                      </div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {req.scheduledTime}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {req.assignedVolunteerId ? (
                        <div>
                          <span className="font-bold text-slate-900 block flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                            {req.assignedVolunteerName}
                          </span>
                          <span className="text-slate-500 text-[11px]">
                            {req.assignedVolunteerPhone}
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-200">
                          Waiting for Volunteer
                        </span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setDetailsRequest(req)}
                          className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-blue-600 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {req.status === 'Completed' && (
                          <button
                            onClick={() => setFeedbackRequest(req)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                              req.hasFeedback
                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                            }`}
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{req.hasFeedback ? 'Reviewed' : 'Rate Help'}</span>
                          </button>
                        )}

                        {req.status === 'Requested' && (
                          <button
                            onClick={() => handleStatusChange(req._id, 'Cancelled')}
                            className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold"
                          >
                            Cancel
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
      )}

      {/* Modals */}
      <RequestDetailsModal
        request={detailsRequest}
        onClose={() => setDetailsRequest(null)}
        onOpenFeedback={(req) => setFeedbackRequest(req)}
        userRole="senior"
        onStatusChange={handleStatusChange}
      />

      <FeedbackModal
        request={feedbackRequest}
        isOpen={Boolean(feedbackRequest)}
        onClose={() => setFeedbackRequest(null)}
        onSuccess={loadRequests}
      />
    </div>
  );
};
