import React, { useEffect, useState } from 'react';
import { requestsApi } from '../../api.ts';
import { AssistanceRequest } from '../../types.ts';
import { StatusBadge, UrgencyBadge } from '../../components/common/Badges.tsx';
import { RequestDetailsModal } from '../../components/requests/RequestDetailsModal.tsx';
import { useNotification } from '../../context/NotificationContext.tsx';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Eye,
  Play,
  Check,
  CheckCircle2,
  FileEdit,
} from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
}

export const MyAssignedTasksPage: React.FC<Props> = ({ onNavigate }) => {
  const { showToast } = useNotification();
  const [tasks, setTasks] = useState<AssistanceRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AssistanceRequest | null>(null);

  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [volunteerNote, setVolunteerNote] = useState<string>('');

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = await requestsApi.getAll({ view: 'assigned' });
      setTasks(data);
    } catch {
      showToast('Error loading assigned tasks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusUpdate = async (id: string, status: string, notes?: string) => {
    try {
      await requestsApi.updateStatus(id, status, notes);
      showToast(`Task status updated to ${status}!`, 'success');
      setCompletingTaskId(null);
      setVolunteerNote('');
      loadTasks();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to update status', 'error');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return ['Accepted', 'In Progress'].includes(t.status);
    if (filter === 'completed') return t.status === 'Completed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Assigned Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your active commitments and update errand completion status
          </p>
        </div>
        <button
          onClick={() => onNavigate('available-tasks')}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
        >
          + Find More Tasks
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 text-xs font-bold p-1 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-xl transition ${
            filter === 'active' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Active Tasks ({tasks.filter((t) => ['Accepted', 'In Progress'].includes(t.status)).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-xl transition ${
            filter === 'completed' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Completed ({tasks.filter((t) => t.status === 'Completed').length})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl transition ${
            filter === 'all' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({tasks.length})
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-sm text-slate-500 font-semibold">Loading assigned tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No tasks in this category</h3>
          <p className="text-xs text-slate-500">
            {filter === 'active'
              ? 'You have fulfilled all active commitments! Explore available tasks to assist more seniors.'
              : 'No completed tasks recorded yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {task.requestId}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={task.status} />
                    <UrgencyBadge urgency={task.urgency} />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 leading-snug">{task.title}</h3>
                  <span className="text-xs font-semibold text-emerald-700">{task.category}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>

                {/* Senior info card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Senior Requester</span>
                      <span className="font-bold text-sm text-slate-900">{task.seniorName}</span>
                    </div>
                    {task.seniorPhone && (
                      <a
                        href={`tel:${task.seniorPhone}`}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-1.5 hover:bg-blue-700 transition"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Senior
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 pt-1 border-t border-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{task.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{task.scheduledDate} at {task.scheduledTime}</span>
                  </div>
                </div>

                {task.volunteerNotes && (
                  <div className="p-3 bg-emerald-50 text-emerald-950 text-xs rounded-xl border border-emerald-200">
                    <strong>Your notes:</strong> {task.volunteerNotes}
                  </div>
                )}
              </div>

              {/* Status Action Controls */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                {completingTaskId === task._id ? (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <label className="font-bold text-slate-800 block">
                      Add completion remarks / notes for the senior:
                    </label>
                    <input
                      type="text"
                      value={volunteerNote}
                      onChange={(e) => setVolunteerNote(e.target.value)}
                      placeholder="e.g. Groceries safely placed in kitchen. Senior confirmed receipt."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setCompletingTaskId(null)}
                        className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(task._id, 'Completed', volunteerNote)}
                        className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs"
                      >
                        Confirm Completion
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedRequest(task)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Full Audit Log
                    </button>

                    <div className="flex items-center gap-2">
                      {task.status === 'Accepted' && (
                        <button
                          onClick={() => handleStatusUpdate(task._id, 'In Progress')}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <Play className="w-3.5 h-3.5" /> Start Task
                        </button>
                      )}
                      {task.status === 'In Progress' && (
                        <button
                          onClick={() => setCompletingTaskId(task._id)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <RequestDetailsModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        userRole="volunteer"
      />
    </div>
  );
};
