import React, { useState, useEffect } from 'react';
import { AssistanceRequest, User } from '../../types.ts';
import { volunteersApi, requestsApi } from '../../api.ts';
import { useNotification } from '../../context/NotificationContext.tsx';
import { UserCheck, X, ShieldCheck, Star } from 'lucide-react';

interface Props {
  request: AssistanceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onAssigned: () => void;
}

export const AssignVolunteerModal: React.FC<Props> = ({ request, isOpen, onClose, onAssigned }) => {
  const { showToast } = useNotification();
  const [volunteers, setVolunteers] = useState<(User & { profile: any })[]>([]);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadVolunteers();
    }
  }, [isOpen]);

  const loadVolunteers = async () => {
    setIsLoading(true);
    try {
      const data = await volunteersApi.getAll();
      setVolunteers(data.filter((v) => v.status === 'active'));
      if (data.length > 0) {
        setSelectedVolunteerId(data[0]._id);
      }
    } catch {
      showToast('Failed to load volunteer list', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !request) return null;

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVolunteerId) {
      showToast('Please select a volunteer to assign.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await requestsApi.assignVolunteer(request._id, selectedVolunteerId);
      showToast('Volunteer assigned successfully!', 'success');
      onAssigned();
      onClose();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Assignment failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="bg-blue-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Assign Volunteer to Request</h2>
              <p className="text-blue-100 text-xs">{request.requestId} &bull; {request.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAssign} className="p-6 space-y-4 text-sm">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 block">Senior Citizen Requester</span>
            <span className="font-bold text-slate-900 block">{request.seniorName}</span>
            <span className="text-xs text-slate-600 block mt-1">Location: {request.location}</span>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-2">
              Select Available Volunteer:
            </label>
            {isLoading ? (
              <p className="text-slate-500 text-xs">Loading volunteer roster...</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {volunteers.map((vol) => (
                  <label
                    key={vol._id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      selectedVolunteerId === vol._id
                        ? 'border-blue-600 bg-blue-50/70'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="volunteer"
                      value={vol._id}
                      checked={selectedVolunteerId === vol._id}
                      onChange={() => setSelectedVolunteerId(vol._id)}
                      className="mt-1 text-blue-600"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm flex items-center gap-1">
                          {vol.name}
                          {vol.profile?.isVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                          )}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {vol.profile?.averageRating || '5.0'}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-0.5">Phone: {vol.phone}</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Skills: {vol.profile?.skills?.slice(0, 2).join(', ') || 'Community Helper'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 rounded-xl text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || volunteers.length === 0}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 font-bold text-white rounded-xl text-xs shadow-md transition"
            >
              {isSubmitting ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
