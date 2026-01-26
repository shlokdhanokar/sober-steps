import { useTracker } from '../context/TrackerContext';
import { ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export function DailyPledge() {
  const { settings, makePledge } = useTracker();
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const hasPledged = settings.lastPledgeDate === todayStr;

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <AnimatePresence mode="wait">
        {!hasPledged ? (
          <motion.button
            key="pledge-btn"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={makePledge}
            className="w-full p-6 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-[2rem] flex items-center justify-between group hover:border-indigo-500/60 transition-all shadow-xl shadow-indigo-500/5 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-100 italic">Daily Commitment</h4>
                <p className="text-xs text-slate-400">"I commit to staying sober today."</p>
              </div>
            </div>
            <div className="bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/30 group-hover:bg-indigo-400 transition-colors">
              Pledge
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="pledge-done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-[2rem] flex items-center gap-4 shadow-xl shadow-emerald-500/5 cursor-default relative overflow-hidden"
          >
            <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-400">Commitment Made</h4>
              <p className="text-xs text-slate-400">You've pledged to stay strong today. +10 XP</p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy className="w-12 h-12 text-emerald-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
