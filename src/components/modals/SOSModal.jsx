import { useState, useEffect } from 'react';
import { X, Heart, Wind, LifeBuoy, Phone, Gamepad2, Coffee } from 'lucide-react';
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

        {/* SOS Contacts & Distractions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4 text-left">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
              <Phone className="w-3 h-3 text-rose-500" /> Help 24/7
            </h4>
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-4 space-y-3">
              {(settings.emergencyContacts || []).map((contact, idx) => {
                const [name, phone] = contact.split(':');
                return (
                  <a key={idx} href={`tel:${phone}`} className="flex items-center justify-between p-2 hover:bg-slate-800 rounded-xl transition-colors group">
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white">{name}</span>
                    <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                  </a>
                );
              })}
              {(!settings.emergencyContacts || settings.emergencyContacts.length === 0) && (
                <p className="text-[10px] text-slate-600 italic">No contacts added. Set them in settings!</p>
              )}
            </div>
          </div>

          <div className="space-y-4 text-left">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
              <Gamepad2 className="w-3 h-3 text-indigo-500" /> Distract
            </h4>
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-4 space-y-3">
              {[
                { label: 'Walk (5m)', icon: Wind },
                { label: 'Gaming', icon: Gamepad2 },
                { label: 'Drink Water', icon: Coffee }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 text-[10px] font-bold text-slate-400">
                  <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <activity.icon className="w-3.5 h-3.5" />
                  </div>
                  {activity.label}
                </div>
              ))}
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
