import React, { useEffect, useState } from 'react';
import { requestsApi, categoriesApi } from '../../api.ts';
import { AssistanceRequest, HelpCategory } from '../../types.ts';
import { UrgencyBadge } from '../../components/common/Badges.tsx';
import { RequestDetailsModal } from '../../components/requests/RequestDetailsModal.tsx';
import { useNotification } from '../../context/NotificationContext.tsx';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  HandHeart,
  Eye,
  Filter,
  User,
} from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
}

export const AvailableTasksPage: React.FC<Props> = ({ onNavigate }) => {
  const { showToast } = useNotification();
  const [tasks, setTasks] = useState<AssistanceRequest[]>([]);
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AssistanceRequest | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reqData, catData] = await Promise.all([
        requestsApi.getAll({ view: 'available' }),
        categoriesApi.getAll(),
      ]);
      setTasks(reqData);
      setCategories(catData);
    } catch {
      showToast('Error loading available tasks', 'error');
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
      showToast('Request accepted! It has been moved to your Assigned Tasks.', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to accept task', 'error');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (selectedUrgency !== 'all' && t.urgency !== selectedUrgency) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.seniorName.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Available Senior Requests
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Review open requests from community seniors and choose tasks you can assist with
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords or location..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          >
            <option value="all">All Help Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          >
            <option value="all">All Urgency Levels</option>
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Task Cards Grid */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-sm text-slate-500 font-semibold">Loading available tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No open requests right now</h3>
          <p className="text-xs text-slate-500">
            All requests have either been accepted or match other search parameters. Check back shortly!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-400">{task.requestId}</span>
                  <UrgencyBadge urgency={task.urgency} />
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-snug">{task.title}</h3>
                  <span className="text-xs font-semibold text-blue-600">{task.category}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {task.description}
                </p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Senior: {task.seniorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{task.scheduledDate} &bull; {task.scheduledTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{task.location}</span>
                  </div>
                </div>

                {task.specialInstructions && (
                  <div className="text-[11px] bg-amber-50 text-amber-900 p-2.5 rounded-xl border border-amber-200">
                    <strong>Note:</strong> {task.specialInstructions}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedRequest(task)}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleAccept(task._id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <HandHeart className="w-4 h-4" />
                  <span>Accept Request</span>
                </button>
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
