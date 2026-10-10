import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNotification } from '../../context/NotificationContext.tsx';
import { categoriesApi, requestsApi } from '../../api.ts';
import { HelpCategory, UrgencyLevel } from '../../types.ts';
import { CategoryIcon } from '../../components/common/CategoryIcon.tsx';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
}

export const CreateRequestPage: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Medicine & Pharmacy Pickup');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  const [location, setLocation] = useState(user?.address || 'Metro City');
  const [urgency, setUrgency] = useState<UrgencyLevel>('Normal');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    categoriesApi.getAll().then((data) => {
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategory(data[0].name);
        setSelectedCategoryId(data[0]._id);
      }
    });
  }, []);

  const handleCategorySelect = (cat: HelpCategory) => {
    setSelectedCategory(cat.name);
    setSelectedCategoryId(cat._id);
    if (!title) {
      setTitle(`Assistance with ${cat.name}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) {
      showToast('Please fill out all required details.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await requestsApi.create({
        title,
        description,
        category: selectedCategory,
        categoryId: selectedCategoryId,
        scheduledDate,
        scheduledTime,
        location,
        urgency,
        specialInstructions,
      });

      showToast('Assistance request created successfully! Volunteers are being notified.', 'success');
      onNavigate('my-requests');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to submit assistance request.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Heading */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('senior-dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Free Community Assistance
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an Assistance Request
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fill in the details below. Our vetted community volunteers will be notified to assist you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Category Selection Grid */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Choose Assistance Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    type="button"
                    key={cat._id}
                    onClick={() => handleCategorySelect(cat)}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <CategoryIcon iconName={cat.iconName} className="w-5 h-5" />
                    </div>
                    <div>
                      <span className={`block font-bold text-xs ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                        {cat.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Request Summary & Description */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                2. Request Title / Short Summary *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Need weekly blood pressure medication collected from pharmacy"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                3. Detailed Description of Needed Help *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe exactly what you need help with (items, prescription details, doctor name, store preferences)..."
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Step 3: Schedule, Time & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Scheduled Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Preferred Time *
              </label>
              <input
                type="text"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="e.g. 10:30 AM or Afternoon"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
              >
                <option value="Normal">Normal (Scheduled in advance)</option>
                <option value="Urgent">Urgent (Within 24 Hours)</option>
                <option value="Emergency">Emergency (Immediate Priority)</option>
              </select>
            </div>
          </div>

          {/* Step 4: Location & Special instructions */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Service Location / Meeting Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4 text-rose-500" />
                </div>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Street address, building number, apartment"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Special Instructions / Accessibility Notes (Optional)
              </label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Ring Apt 3B directly; I walk with a cane; elevator on ground floor"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('senior-dashboard')}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 rounded-2xl text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold rounded-2xl text-base shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? 'Posting Request...' : 'Submit Assistance Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
