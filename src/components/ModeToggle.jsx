export default function ModeToggle({ mode, onChange }) {
  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={() => onChange('company')}
        className={`flex-1 flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 text-sm font-semibold transition-all ${
          mode === 'company'
            ? 'bg-slate-900 text-white border-slate-900 shadow-md'
            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className="text-2xl">🏢</span>
        <div>
          <div>Existing Company</div>
          <div className={`text-xs font-normal mt-0.5 ${mode === 'company' ? 'text-slate-400' : 'text-slate-300'}`}>
            Competitive analysis
          </div>
        </div>
      </button>

      <button
        onClick={() => onChange('idea')}
        className={`flex-1 flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 text-sm font-semibold transition-all ${
          mode === 'idea'
            ? 'bg-slate-900 text-white border-slate-900 shadow-md'
            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className="text-2xl">💡</span>
        <div>
          <div>Startup Idea</div>
          <div className={`text-xs font-normal mt-0.5 ${mode === 'idea' ? 'text-slate-400' : 'text-slate-300'}`}>
            Whitespace analysis
          </div>
        </div>
      </button>
    </div>
  );
}
