import { X, Heart, Brain, Moon, Zap, ShieldCheck } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';

const MILESTONES = [
  { hours: 24, label: 'Blood sugar normalizes', icon: Zap, desc: 'Anxiety may peak, but your body is beginning to detox.' },
  { hours: 48, label: 'Better sleep', icon: Moon, desc: 'Sleep patterns start to regulate. REM sleep returns.' },
  { hours: 72, label: 'Energy returns', icon: Zap, desc: 'Physical energy increases as dehydration subsides.' },
  { hours: 168, label: 'Clearer skin', icon: ShieldCheck, desc: 'Skin looks healthier as hydration improves.' }, // 7 days
  { hours: 336, label: 'Cognitive boost', icon: Brain, desc: 'Focus and concentration improve significantly.' }, // 14 days
  { hours: 720, label: 'Liver recovery', icon: Heart, desc: 'Liver fat reduces by up to 15%.' }, // 30 days
];

export function RecoveryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { getStats } = useTracker();
  const { streak } = getStats();
  const streakHours = streak * 24; // Approximation based on days

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-[2rem] w-full max-w-md border border-slate-700/50 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 h-[80vh] flex flex-col">

        {/* Header */}
        <div className="p-5 border-b border-slate-700/50 flex items-center justify-between bg-gradient-to-r from-emerald-900/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-full text-emerald-400">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100 tracking-tight">Recovery</h3>
              <p className="text-xs text-emerald-400 font-medium">{streak} Days Sober</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 relative">
          {/* Vertical Line */}
          <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-slate-800" />

          {MILESTONES.map((m, idx) => {
            const isUnlocked = streakHours >= m.hours;
            const Icon = m.icon;

            return (
              <div key={idx} className={`relative flex gap-6 group ${isUnlocked ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                <div className={`
                    relative z-10 p-3 rounded-2xl border-4 transition-all duration-500
                    ${isUnlocked
                    ? 'bg-slate-900 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900 border-slate-800'}
                 `}>
                  <Icon className={`w-5 h-5 ${isUnlocked ? 'text-emerald-400' : 'text-slate-500'}`} />
                </div>

                <div className="flex-1 pt-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className={`font-bold ${isUnlocked ? 'text-slate-200' : 'text-slate-500'}`}>{m.label}</h4>
                    <span className="text-xs font-mono text-slate-500">
                      {m.hours < 48 ? `${m.hours}h` : `${Math.floor(m.hours / 24)}d`}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
