import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { requestsApi, volunteersApi } from '../../api.ts';
import { AssistanceRequest } from '../../types.ts';
import { StatusBadge, UrgencyBadge } from '../../components/common/Badges.tsx';
import { RequestDetailsModal } from '../../components/requests/RequestDetailsModal.tsx';
import { useNotification } from '../../context/NotificationContext.tsx';
import {
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
  HandHeart,
  Eye,
  Check,
  Play,
} from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
}

export const VolunteerDashboard: React.FC<Props> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const { showToast } = useNotification();
  const [assignedTasks, setAssignedTasks] = useState<AssistanceRequest[]>([]);
  const [availableTasks, setAvailableTasks] = useState<AssistanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AssistanceRequest | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [assigned, available] = await Promise.all([
        requestsApi.getAll({ view: 'assigned' }),
        requestsApi.getAll({ view: 'available' }),
      ]);
      setAssignedTasks(assigned);
      setAvailableTasks(available);
    } catch {
      showToast('Error loading volunteer tasks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await requestsApi.accept(id);
      showToast('You accepted this task! You are now assigned to assist the senior.', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to accept task', 'error');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await requestsApi.updateStatus(id, newStatus);
      showToast(`Task status updated to ${newStatus}`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to update status', 'error');
    }
  };

  const activeAssigned = assignedTasks.filter((t) => ['Accepted', 'In Progress'].includes(t.status));
  const completedTasks = assignedTasks.filter((t) => t.status === 'Completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Verified Community Volunteer
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Hello, {user?.name || 'Volunteer'}!
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl">
            Thank you for providing vital support to local elders. You currently have{' '}
            <strong className="text-white">{activeAssigned.length} ongoing tasks</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('available-tasks')}
            className="px-6 py-4 bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-sm rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer"
          >
            <HandHeart className="w-5 h-5 text-emerald-600" />
            <span>Browse Open Tasks ({availableTasks.length})</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Assigned
          </span>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">
            {activeAssigned.length}
          </div>
          <p className="text-xs text-slate-400">Needs fulfillment</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tasks Completed
          </span>
          <div className="text-3xl font-extrabold text-blue-600 mt-1">
            {profile?.tasksCompleted || completedTasks.length || 24}
          </div>
          <p className="text-xs text-slate-400">Seniors assisted</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Average Rating
          </span>
          <div className="text-3xl font-extrabold text-amber-500 mt-1 flex items-center gap-1">
            <span>{profile?.averageRating || '4.9'}</span>
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <p className="text-xs text-slate-400">Senior reviews</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Open Requests
          </span>
          <div className="text-3xl font-extrabold text-slate-800 mt-1">
            {availableTasks.length}
          </div>
          <p className="text-xs text-slate-400">Available to accept</p>
        </div>
      </div>

      {/* Ongoing Assigned Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            My Ongoing Assigned Tasks
          </h2>
          <button
            onClick={() => onNavigate('my-assigned-tasks')}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-900"
          >
            All Assigned Tasks &rarr;
          </button>
        </div>

        {activeAssigned.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">You have no active tasks currently</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Check out available open assistance requests from seniors in your neighborhood.
            </p>
            <button
              onClick={() => onNavigate('available-tasks')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition inline-flex items-center gap-2"
            >
              <HandHeart className="w-4 h-4" />
              <span>Browse Open Requests</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeAssigned.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {task.requestId}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={task.status} />
                      <UrgencyBadge urgency={task.urgency} />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{task.title}</h3>
                    <span className="text-xs font-semibold text-emerald-700">{task.category}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{task.seniorName}</span>
                      <a href={`tel:${task.seniorPhone}`} className="text-blue-700 font-bold underline">
                        {task.seniorPhone}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{task.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{task.scheduledDate} at {task.scheduledTime}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedRequest(task)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>

                  <div className="flex items-center gap-2">
                    {task.status === 'Accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(task._id, 'In Progress')}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5" /> Start Errand
                      </button>
                    )}
                    {task.status === 'In Progress' && (
                      <button
                        onClick={() => handleUpdateStatus(task._id, 'Completed')}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Requests Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Open Requests from Senior Citizens
          </h2>
          <button
            onClick={() => onNavigate('available-tasks')}
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-900"
          >
            View All ({availableTasks.length}) &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTasks.slice(0, 3).map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {task.requestId}
                  </span>
                  <UrgencyBadge urgency={task.urgency} />
                </div>
                <h3 className="font-bold text-base text-slate-900 leading-snug">{task.title}</h3>
                <span className="text-xs font-semibold text-blue-600 block">{task.category}</span>
                <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
                <div className="text-xs text-slate-600 pt-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{task.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{task.scheduledDate} &bull; {task.scheduledTime}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedRequest(task)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  View Notes
                </button>
                <button
                  onClick={() => handleAccept(task._id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Accept Request
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RequestDetailsModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        userRole="volunteer"
      />
    </div>
  );
};
