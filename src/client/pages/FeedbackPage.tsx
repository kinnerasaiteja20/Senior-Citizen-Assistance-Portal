import React, { useEffect, useState } from 'react';
import { feedbackApi } from '../api.ts';
import { Feedback } from '../types.ts';
import { Star, Heart, CheckCircle2, MessageSquare, ShieldCheck, User } from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
}

export const FeedbackPage: React.FC<Props> = ({ onNavigate }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    feedbackApi.getAll().then((data) => {
      setFeedbacks(data);
      setIsLoading(false);
    });
  }, []);

  const avgScore =
    feedbacks.length > 0
      ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
      : '5.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider text-amber-100">
            Community Trust & Ratings
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Senior Citizen Feedback & Testimonials
          </h1>
          <p className="text-sm text-amber-100 max-w-xl">
            Real reviews submitted by senior citizens for verified community volunteers who assisted with daily errands.
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center">
          <span className="text-3xl font-extrabold text-white block">{avgScore} / 5.0</span>
          <div className="flex items-center justify-center gap-1 text-amber-300 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-300" />
            ))}
          </div>
          <span className="text-[11px] text-amber-100 mt-1 block">
            Based on {feedbacks.length} Verified Elder Reviews
          </span>
        </div>
      </div>

      {/* Grid of Reviews */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-500 text-sm">
          Loading community reviews...
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No testimonials published yet</h3>
          <p className="text-xs text-slate-500">
            Reviews will appear here once seniors rate completed assistance errands.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbacks.map((fb) => (
            <div
              key={fb._id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-slate-700 italic text-sm leading-relaxed">&ldquo;{fb.comments}&rdquo;</p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    Punctuality: <strong className="text-emerald-700">⭐⭐⭐⭐⭐</strong>
                  </div>
                  <div>
                    Courteous & Kind: <strong className="text-emerald-700">⭐⭐⭐⭐⭐</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    {fb.seniorName.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{fb.seniorName}</span>
                    <span className="text-slate-400 text-[10px]">Senior Requester</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-emerald-700 font-bold flex items-center justify-end gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {fb.volunteerName}
                  </span>
                  <span className="text-slate-400 text-[10px]">{fb.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
