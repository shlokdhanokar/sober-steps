import { useState, useEffect } from 'react';
import { X, Heart, Wind, LifeBuoy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTracker } from '../../context/TrackerContext';

export function SOSModal({ isOpen, onClose }) {
  const { settings } = useTracker();
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale, hold
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    if (!isOpen) return;

    let timer;
    const tick = () => {
      setSeconds(s => {
        if (s <= 1) {
          setPhase(p => {
            if (p === 'inhale') { setSeconds(4); return 'hold'; }
            if (p === 'hold') { setSeconds(4); return 'exhale'; }
            if (p === 'exhale') { setSeconds(4); return 'inhale'; }
            return 'inhale';
          });
          return 4;
        }
        return s - 1;
      });
    };

    timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [isOpen, phase]);

  if (!isOpen) return null;

  const reasons = settings.reasonsForQuitting || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-md space-y-8 text-center">

        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-rose-500/10 rounded-full text-rose-500 animate-pulse">
            <LifeBuoy className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Stay Strong</h2>
          <p className="text-slate-400 text-sm max-w-[280px] mx-auto">
            This craving will pass in about 15 minutes. Let's focus on your breath for a moment.
          </p>
        </div>

        {/* Breathing Guide */}
        <div className="relative py-12 flex flex-col items-center justify-center">
          <motion.div
            animate={{
              scale: phase === 'inhale' ? 1.5 : (phase === 'exhale' ? 1 : 1.5),
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="absolute w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"
          />

          <div className="relative z-10 w-48 h-48 border-2 border-slate-800 rounded-full flex items-center justify-center">
            <motion.div
              animate={{
                scale: phase === 'inhale' ? 1.4 : (phase === 'exhale' ? 1 : 1.4),
              }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="w-32 h-32 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full shadow-[0_0_30px_rgba(244,63,94,0.4)]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-1">{phase}</span>
              <span className="text-4xl font-black text-white">{seconds}</span>
            </div>
          </div>
        </div>

        {/* Reasons List */}
        {reasons.length > 0 && (
          <div className="space-y-4 pt-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
              <Heart className="w-3 h-3 text-rose-500" /> Remember why you started
            </h4>
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4 text-left">
              {reasons.filter(r => r.trim()).map((reason, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <p className="text-sm text-slate-200 font-medium leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-slate-700"
        >
          Check-in later
        </button>
      </div>
    </div>
  );
}
