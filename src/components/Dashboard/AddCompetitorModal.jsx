import { useState } from 'react';
import { X } from 'lucide-react';
import useStore from '../../store/useStore';

export default function AddCompetitorModal({ isOpen, onClose }) {
  const addCompetitor = useStore((s) => s.addCompetitor);
  const [form, setForm] = useState({
    name: '',
    website: '',
    industry: '',
    description: '',
    score: 50,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addCompetitor(form);
    setForm({ name: '', website: '', industry: '', description: '', score: 50 });
    onClose();
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">Add Competitor</h3>
              <p className="text-xs text-slate-400 mt-0.5">Track a new competitor in your analysis</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={18} className="text-slate-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="e.g. Acme Corp"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Website
              </label>
              <input
                type="text"
                value={form.website}
                onChange={handleChange('website')}
                placeholder="e.g. acmecorp.com"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Industry
              </label>
              <select
                value={form.industry}
                onChange={handleChange('industry')}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-slate-600"
              >
                <option value="">Select industry</option>
                <option value="SaaS">SaaS / Software</option>
                <option value="E-commerce">E-commerce</option>
                <option value="FinTech">FinTech</option>
                <option value="HealthTech">HealthTech</option>
                <option value="EdTech">EdTech</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={handleChange('description')}
                placeholder="Brief description of this competitor..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Initial Score: {form.score}/100
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={form.score}
                onChange={handleChange('score')}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-300 mt-1">
                <span>Weak</span>
                <span>Average</span>
                <span>Strong</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
              >
                Add Competitor
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
