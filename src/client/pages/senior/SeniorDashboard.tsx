import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useAccessibility } from '../../context/AccessibilityContext.tsx';
import { requestsApi } from '../../api.ts';
import { AssistanceRequest } from '../../types.ts';
import { StatusBadge, UrgencyBadge } from '../../components/common/Badges.tsx';
import { RequestDetailsModal } from '../../components/requests/RequestDetailsModal.tsx';
import { FeedbackModal } from '../../components/requests/FeedbackModal.tsx';
import {
  Heart,
  PlusCircle,
  Clock,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Calendar,
  MapPin,
  Volume2,
  ShieldAlert,
  ArrowRight,
  Eye,
  Star,
  Sparkles,
} from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
}

export const SeniorDashboard: React.FC<Props> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const { speakText, setShowSosModal } = useAccessibility();
  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AssistanceRequest | null>(null);
  const [feedbackRequest, setFeedbackRequest] = useState<AssistanceRequest | null>(null);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await requestsApi.getAll();
      setRequests(data);
    } catch (err) {
      console.error('Failed to load senior requests', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const activeRequests = requests.filter((r) =>
    ['Requested', 'Accepted', 'In Progress'].includes(r.status)
  );
  const completedRequests = requests.filter((r) => r.status === 'Completed');

  const handleSpeakOverview = () => {
    speakText(
      `Hello ${user?.name || 'Margaret'}. You have ${activeRequests.length} active assistance requests in progress, and ${completedRequests.length} completed requests. Press the blue button to request new help, or the red button for emergency assistance.`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Accessibility Greeting Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider text-blue-100">
              Senior Citizen Portal
            </span>
            <button
              onClick={handleSpeakOverview}
              className="p-1.5 bg-white/15 hover:bg-white/25 rounded-xl transition text-white"
              title="Read dashboard summary aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome, {user?.name || 'Dear Senior'}!
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl">
            We are here to support your daily needs with dignity and care.
            {profile?.emergencyContactName && (
              <span className="block mt-1 text-xs text-blue-200">
                Primary Contact: {profile.emergencyContactName} ({profile.emergencyContactPhone})
              </span>
            )}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onNavigate('create-request')}
            className="flex-1 md:flex-none px-6 py-4 bg-white text-blue-900 hover:bg-blue-50 font-extrabold text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-blue-700" />
            <span>+ Request New Help</span>
          </button>
          <button
            onClick={() => setShowSosModal(true)}
            className="px-5 py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-rose-600/40 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>SOS Emergency</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Errands
            </span>
            <div className="text-3xl font-extrabold text-blue-600 mt-1">
              {activeRequests.length}
            </div>
            <p className="text-xs text-slate-400 mt-1">In progress or awaiting match</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Completed Care
            </span>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1">
              {completedRequests.length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Successfully fulfilled errands</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Requests
            </span>
            <div className="text-3xl font-extrabold text-slate-800 mt-1">
              {requests.length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Lifetime support requests</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
            <Heart className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Active Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Active Assistance Requests
            </h2>
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
              {activeRequests.length} Live
            </span>
          </div>
          <button
            onClick={() => onNavigate('my-requests')}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View All My Requests &rarr;
          </button>
        </div>

        {activeRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No active errands right now</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Do you need groceries delivered, prescriptions collected, or an escort to a clinic appointment?
            </p>
            <button
              onClick={() => onNavigate('create-request')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition inline-flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Request Assistance Today</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeRequests.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          {req.requestId}
                        </span>
                        <StatusBadge status={req.status} />
                        <UrgencyBadge urgency={req.urgency} />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900">{req.title}</h3>
                      <p className="text-xs font-semibold text-blue-600">{req.category}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {req.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{req.scheduledDate} ({req.scheduledTime})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="truncate">{req.location}</span>
                    </div>
                  </div>

                  {/* Assigned Volunteer Details */}
                  {req.assignedVolunteerId ? (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                          {req.assignedVolunteerName?.charAt(0) || 'V'}
                        </div>
                        <div>
                          <span className="font-bold text-sm text-emerald-950 block">
                            {req.assignedVolunteerName}
                          </span>
                          <span className="text-xs text-emerald-700 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 inline" /> Assigned Volunteer
                          </span>
                        </div>
                      </div>
                      {req.assignedVolunteerPhone && (
                        <a
                          href={`tel:${req.assignedVolunteerPhone}`}
                          className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-700 transition flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Looking for a volunteer nearby. We will notify you when accepted.</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Full Details & Timeline
                  </button>
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl transition"
                  >
                    Track Progress
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Errands & Feedback CTA */}
      {completedRequests.some((r) => !r.hasFeedback) && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 text-white rounded-2xl">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-950">You have completed errands to review!</h3>
              <p className="text-xs text-amber-800">
                Help recognize your volunteers and keep our community caring by sharing feedback.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('my-requests')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition whitespace-nowrap cursor-pointer"
          >
            Review Volunteers &rarr;
          </button>
        </div>
      )}

      {/* Modals */}
      <RequestDetailsModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onOpenFeedback={(req) => setFeedbackRequest(req)}
        userRole="senior"
        onStatusChange={async (id, status) => {
          await requestsApi.updateStatus(id, status);
          loadRequests();
        }}
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
