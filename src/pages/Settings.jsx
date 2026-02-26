import { useState } from 'react';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft, Trash2, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

export default function Settings() {
  const apiKey = useStore((s) => s.apiKey);
  const setApiKey = useStore((s) => s.setApiKey);
  const resetToSample = useStore((s) => s.resetToSample);

  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApiKey(keyInput.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRemove = () => {
    setKeyInput('');
    setApiKey('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Settings</h1>
      <p className="text-sm text-slate-400 mb-8">Configure your CompetitorIQ experience</p>

      {/* API Key Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-50">
            <Key size={18} className="text-blue-500" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Anthropic API Key</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Required for AI-powered competitor research with real web data
            </p>
          </div>
        </div>

        <div className="relative mb-3">
          <input
            type={showKey ? 'text' : 'password'}
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="sk-ant-api03-..."
            className="w-full px-4 py-3 pr-24 rounded-lg border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
          >
            {showKey ? (
              <EyeOff size={16} className="text-slate-400" />
            ) : (
              <Eye size={16} className="text-slate-400" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={!keyInput.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-40"
          >
            Save Key
          </button>
          {apiKey && (
            <button
              onClick={handleRemove}
              className="px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={13} />
              Remove
            </button>
          )}
          {saved && (
            <span className="flex items-center gap-1 text-sm text-emerald-500">
              <CheckCircle size={14} /> Saved!
            </span>
          )}
        </div>

        {/* Status */}
        <div className={`mt-4 flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
          apiKey
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            : 'bg-amber-50 text-amber-600 border border-amber-100'
        }`}>
          {apiKey ? (
            <>
              <CheckCircle size={13} />
              API key configured — AI-powered research is active
            </>
          ) : (
            <>
              <AlertCircle size={13} />
              No API key — running in demo mode with sample data
            </>
          )}
        </div>

        {/* How to get key */}
        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
          <h3 className="text-xs font-semibold text-slate-600 mb-2">How to get an API key:</h3>
          <ol className="text-xs text-slate-500 space-y-1.5">
            <li className="flex gap-2">
              <span className="font-bold text-slate-400">1.</span>
              Go to <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className="text-blue-500 underline">console.anthropic.com</a>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-slate-400">2.</span>
              Sign up or log in with your account
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-slate-400">3.</span>
              Go to API Keys → Create Key
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-slate-400">4.</span>
              Copy the key and paste it above
            </li>
          </ol>
          <p className="text-[11px] text-slate-400 mt-3">
            Cost: ~$0.01 per research query. Your key is stored locally in your browser and never sent anywhere except Anthropic's API.
          </p>
        </div>
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
            <RotateCcw size={14} />
            Reset to Sample Data
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
            <Trash2 size={14} />
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
