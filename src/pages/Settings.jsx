import { useState } from 'react';
import { CheckCircle, ArrowLeft, Trash2, RotateCcw, Database, Globe, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

export default function Settings() {
  const resetToSample = useStore((s) => s.resetToSample);

  return (
    <div className="max-w-2xl">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Settings</h1>
      <p className="text-sm text-slate-400 mb-8">Configure your CompetitorIQ experience</p>

      {/* Data Sources */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="p-2 rounded-lg bg-emerald-50">
            <Sparkles size={18} className="text-emerald-500" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Data Sources</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              CompetitorIQ uses free data sources — no API keys needed!
            </p>
          </div>
          <div className="ml-auto px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
            ● Active
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="p-1.5 rounded-md bg-blue-100">
              <Database size={14} className="text-blue-500" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700">Built-in Industry Database</div>
              <div className="text-xs text-slate-400">50+ industries with pre-mapped competitors, market data, and analysis</div>
            </div>
            <CheckCircle size={16} className="text-emerald-500 ml-auto shrink-0" />
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="p-1.5 rounded-md bg-violet-100">
              <Globe size={14} className="text-violet-500" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700">Wikipedia API</div>
              <div className="text-xs text-slate-400">Real-time company descriptions, founding dates, HQ locations, and more</div>
            </div>
            <CheckCircle size={16} className="text-emerald-500 ml-auto shrink-0" />
          </div>
        </div>

        <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
          <p className="text-xs text-emerald-700 font-medium">
            ✨ Zero API keys • Zero billing • Unlimited searches • Works immediately
          </p>
        </div>
      </div>

      {/* Supported Industries */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-1">Supported Industries</h2>
        <p className="text-xs text-slate-400 mb-4">Companies in these industries get the richest data</p>

        <div className="flex flex-wrap gap-2">
          {[
            'Fast Food', 'SaaS / Tech', 'E-commerce', 'Streaming', 'Automotive',
            'Sportswear', 'Social Media', 'AI / ML', 'Cloud Computing', 'Fintech',
            'Food Delivery', 'Ride-Hailing', 'Design Tools', 'Airlines',
            'Gaming', 'Pharma', 'IT Services', 'Consulting', 'Retail',
          ].map((industry) => (
            <span
              key={industry}
              className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600"
            >
              {industry}
            </span>
          ))}
        </div>

        <p className="text-xs text-slate-400 mt-4">
          💡 You can research <strong>any company</strong> — those outside the database will still get Wikipedia data and auto-generated analysis.
        </p>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-1">Data Management</h2>
        <p className="text-xs text-slate-400 mb-4">All data is stored locally in your browser</p>

        <div className="flex gap-3">
          <button
            onClick={() => {
              if (window.confirm('Reset all data to sample? This cannot be undone.')) {
                resetToSample();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw size={14} /> Reset to Sample Data
          </button>
          <button
            onClick={() => {
              if (window.confirm('Clear ALL data? This cannot be undone.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} /> Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
