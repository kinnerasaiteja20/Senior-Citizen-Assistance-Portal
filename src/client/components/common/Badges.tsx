import React from 'react';
import { RequestStatus, UrgencyLevel } from '../../types.ts';

export const StatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => {
  const styles: Record<RequestStatus, string> = {
    Requested: 'bg-amber-100 text-amber-800 border-amber-300',
    Accepted: 'bg-blue-100 text-blue-800 border-blue-300',
    'In Progress': 'bg-indigo-100 text-indigo-800 border-indigo-300',
    Completed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Cancelled: 'bg-slate-200 text-slate-700 border-slate-300',
    Rejected: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border tracking-wide ${
        styles[status] || 'bg-slate-100 text-slate-700 border-slate-300'
      }`}
    >
      {status}
    </span>
  );
};

export const UrgencyBadge: React.FC<{ urgency: UrgencyLevel }> = ({ urgency }) => {
  if (urgency === 'Emergency') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-black bg-rose-600 text-white animate-pulse">
        EMERGENCY
      </span>
    );
  }
  if (urgency === 'Urgent') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500 text-white">
        URGENT
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">
      Normal
    </span>
  );
};
