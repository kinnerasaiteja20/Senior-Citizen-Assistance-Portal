import React, { useEffect, useState } from 'react';
import { categoriesApi } from '../../api.ts';
import { HelpCategory } from '../../types.ts';
import { CategoryIcon } from '../../components/common/CategoryIcon.tsx';
import { useNotification } from '../../context/NotificationContext.tsx';
import {
  PlusCircle,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Layers,
  Clock,
} from 'lucide-react';

export const CategoryManagementPage: React.FC = () => {
  const { showToast } = useNotification();
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<HelpCategory | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('HeartHandshake');
  const [estimatedDuration, setEstimatedDuration] = useState('1 - 2 Hours');
  const [badgeColor, setBadgeColor] = useState('blue');
  const [isActive, setIsActive] = useState(true);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch {
      showToast('Error loading categories', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCat(null);
    setName('');
    setDescription('');
    setIconName('HeartHandshake');
    setEstimatedDuration('1 - 2 Hours');
    setBadgeColor('blue');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: HelpCategory) => {
    setEditingCat(cat);
    setName(cat.name);
    setDescription(cat.description);
    setIconName(cat.iconName || 'HeartHandshake');
    setEstimatedDuration(cat.estimatedDuration || '1 - 2 Hours');
    setBadgeColor(cat.badgeColor || 'blue');
    setIsActive(cat.isActive ?? true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      showToast('Name and description are required.', 'error');
      return;
    }

    try {
      if (editingCat) {
        await categoriesApi.update(editingCat._id, {
          name,
          description,
          iconName,
          estimatedDuration,
          badgeColor,
          isActive,
        });
        showToast('Category updated successfully!', 'success');
      } else {
        await categoriesApi.create({
          name,
          description,
          iconName,
          estimatedDuration,
          badgeColor,
          isActive: true,
        });
        showToast('New category added successfully!', 'success');
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      showToast('Failed to save category', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this category?')) return;
    try {
      await categoriesApi.delete(id);
      showToast('Category deleted successfully', 'success');
      loadCategories();
    } catch {
      showToast('Failed to delete category', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assistance Categories Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure the services seniors can request and volunteers can fulfill
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add New Category</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <CategoryIcon iconName={cat.iconName} className="w-6 h-6" />
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cat.description}</p>
              </div>

              <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-2 border-t border-slate-100 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Estimated: {cat.estimatedDuration}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(cat)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-blue-600 transition"
                title="Edit category"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat._id)}
                className="p-2 hover:bg-rose-50 rounded-xl text-rose-600 transition"
                title="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCat ? 'Edit Help Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Garden & Yard Maintenance"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what kind of errands or care are covered..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Icon Symbol
                  </label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="ShoppingBag">ShoppingBag (Groceries)</option>
                    <option value="Pill">Pill (Medicine)</option>
                    <option value="Stethoscope">Stethoscope (Hospital)</option>
                    <option value="Car">Car (Transport)</option>
                    <option value="Wrench">Wrench (Repairs)</option>
                    <option value="Smartphone">Smartphone (Tech)</option>
                    <option value="Heart">Heart (Companionship)</option>
                    <option value="FileText">FileText (Documents)</option>
                    <option value="HeartHandshake">HeartHandshake (General)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Est. Duration
                  </label>
                  <input
                    type="text"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    placeholder="e.g. 1 - 2 Hours"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="text-blue-600 rounded"
                />
                <label htmlFor="activeToggle" className="font-bold text-slate-700">
                  Active (Seniors can select this in portal)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
