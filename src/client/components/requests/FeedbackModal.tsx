import React, { useState } from 'react';
import { AssistanceRequest } from '../../types.ts';
import { feedbackApi } from '../../api.ts';
import { useNotification } from '../../context/NotificationContext.tsx';
import { Star, X, Check, Heart, Smile } from 'lucide-react';

interface Props {
  request: AssistanceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const FeedbackModal: React.FC<Props> = ({ request, isOpen, onClose, onSuccess }) => {
  const { showToast } = useNotification();
  const [rating, setRating] = useState<number>(5);
  const [punctualityRating, setPunctualityRating] = useState<number>(5);
  const [kindnessRating, setKindnessRating] = useState<number>(5);
  const [comments, setComments] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) {
      showToast('Please share a few words about your experience.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await feedbackApi.create({
        requestId: request._id,
        rating,
        punctualityRating,
        kindnessRating,
        comments,
      });
      showToast('Thank you! Your feedback has been recorded.', 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to submit feedback.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-5 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Smile className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Volunteer Service Review</h2>
              <p className="text-amber-100 text-xs">For {request.assignedVolunteerName || 'Volunteer'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
          {/* Overall Rating */}
          <div className="text-center space-y-2">
            <label className="font-bold text-slate-800 block text-base">
              Overall Experience Rating
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {rating === 5 ? 'Exceptional Care & Help!' : rating === 4 ? 'Very Good Service' : rating === 3 ? 'Satisfactory' : 'Needs Improvement'}
            </span>
          </div>

          {/* Sub-ratings */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Punctuality & Timeliness
              </label>
              <select
                value={punctualityRating}
                onChange={(e) => setPunctualityRating(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-semibold"
              >
                <option value={5}>⭐⭐⭐⭐⭐ Arrived On Time</option>
                <option value={4}>⭐⭐⭐⭐ Small 5m Delay</option>
                <option value={3}>⭐⭐⭐ Moderate Delay</option>
                <option value={2}>⭐⭐ Late</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kindness & Respect
              </label>
              <select
                value={kindnessRating}
                onChange={(e) => setKindnessRating(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-semibold"
              >
                <option value={5}>⭐⭐⭐⭐⭐ Very Courteous</option>
                <option value={4}>⭐⭐⭐⭐ Polite</option>
                <option value={3}>⭐⭐⭐ Neutral</option>
                <option value={2}>⭐⭐ Impatient</option>
              </select>
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">
              Your Feedback & Kind Words
            </label>
            <textarea
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Tell us how the volunteer helped you today..."
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-800 text-sm"
              required
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
