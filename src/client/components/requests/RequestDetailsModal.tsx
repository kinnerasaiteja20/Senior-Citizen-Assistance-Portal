import React, { useState } from 'react';
import { AssistanceRequest } from '../../types.ts';
import { StatusBadge, UrgencyBadge } from '../common/Badges.tsx';
import { useAccessibility } from '../../context/AccessibilityContext.tsx';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Volume2,
  Star,
  MessageSquare,
} from 'lucide-react';

interface Props {
  request: AssistanceRequest | null;
  onClose: () => void;
  onOpenFeedback?: (req: AssistanceRequest) => void;
  onStatusChange?: (id: string, status: string) => void;
  userRole?: string;
  userId?: string;
}

export const RequestDetailsModal: React.FC<Props> = ({
  request,
  onClose,
  onOpenFeedback,
  onStatusChange,
  userRole,
}) => {
  const { speakText } = useAccessibility();
  const [remarks, setRemarks] = useState('');

  if (!request) return null;

  const handleSpeak = () => {
    speakText(
      `Assistance Request: ${request.title}. Category: ${request.category}. Scheduled for ${request.scheduledDate} at ${request.scheduledTime}. Location: ${request.location}. Current status: ${request.status}. Description: ${request.description}. Special notes: ${request.specialInstructions || 'None'}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-5 md:p-6 flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                {request.requestId}
              </span>
              <StatusBadge status={request.status} />
              <UrgencyBadge urgency={request.urgency} />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
              {request.title}
            </h2>
            <p className="text-sm font-semibold text-blue-600 mt-0.5">{request.category}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleSpeak}
              className="p-2 hover:bg-slate-200 rounded-xl transition text-slate-600"
              title="Read details aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-xl transition text-slate-500"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Key details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="text-xs text-slate-500 block">Scheduled Date</span>
                <span className="font-bold text-slate-900">{request.scheduledDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="text-xs text-slate-500 block">Scheduled Time</span>
                <span className="font-bold text-slate-900">{request.scheduledTime}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:col-span-2">
              <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-500 block">Meeting / Service Location</span>
                <span className="font-bold text-slate-900">{request.location}</span>
              </div>
            </div>
          </div>

          {/* Senior & Volunteer Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-2">
                Senior Citizen Details
              </span>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <User className="w-4 h-4 text-blue-600" />
                  {request.seniorName}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <a href={`tel:${request.seniorPhone}`} className="text-blue-700 font-semibold underline">
                    {request.seniorPhone}
                  </a>
                </div>
                <div className="text-slate-600 mt-1">
                  <strong>Address:</strong> {request.seniorAddress}
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block mb-2">
                Assigned Volunteer
              </span>
              {request.assignedVolunteerId ? (
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    {request.assignedVolunteerName}
                  </div>
                  {request.assignedVolunteerPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <a href={`tel:${request.assignedVolunteerPhone}`} className="text-emerald-700 font-semibold underline">
                        {request.assignedVolunteerPhone}
                      </a>
                    </div>
                  )}
                  <div className="text-emerald-700 font-semibold mt-1">
                    Status: Assigned & Verified
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 py-3">
                  No volunteer assigned yet. Request is open for available community helpers.
                </div>
              )}
            </div>
          </div>

          {/* Description & Special Instructions */}
          <div className="space-y-3">
            <div>
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" /> Errand Description
              </h4>
              <p className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 leading-relaxed text-sm">
                {request.description}
              </p>
            </div>

            {request.specialInstructions && (
              <div>
                <h4 className="font-bold text-amber-900 mb-1">
                  Special Notes / Accessibility Instructions
                </h4>
                <p className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl text-amber-950 text-xs leading-relaxed">
                  {request.specialInstructions}
                </p>
              </div>
            )}

            {request.volunteerNotes && (
              <div>
                <h4 className="font-bold text-emerald-900 mb-1 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" /> Volunteer Log & Updates
                </h4>
                <p className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs">
                  {request.volunteerNotes}
                </p>
              </div>
            )}
          </div>

          {/* Status Timeline History */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Request Audit History & Progression</h4>
            <div className="space-y-2 border-l-2 border-blue-200 pl-4 ml-2">
              {request.statusHistory && request.statusHistory.length > 0 ? (
                request.statusHistory.map((item, idx) => (
                  <div key={idx} className="relative text-xs space-y-0.5 pb-2">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white" />
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <span>{item.status}</span>
                      <span className="text-[11px] font-normal text-slate-500">
                        by {item.changedBy}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                    {item.comment && (
                      <p className="text-slate-600 text-xs italic">{item.comment}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No history available</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            {userRole === 'senior' && request.status === 'Completed' && !request.hasFeedback && onOpenFeedback && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFeedback(request);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm shadow-sm transition"
              >
                <Star className="w-4 h-4" /> Rate & Review Volunteer
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {userRole === 'senior' && request.status === 'Requested' && onStatusChange && (
              <button
                onClick={() => {
                  onStatusChange(request._id, 'Cancelled');
                  onClose();
                }}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition border border-rose-200"
              >
                Cancel Request
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-sm transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
