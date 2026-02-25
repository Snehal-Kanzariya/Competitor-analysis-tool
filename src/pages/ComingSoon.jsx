import { Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ComingSoon({ title, description }) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
        <Construction size={28} className="text-amber-400" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">{description}</p>
      <Link
        to="/"
        className="text-sm text-blue-500 font-medium hover:underline"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
