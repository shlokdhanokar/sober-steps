import { useRef } from 'react';
import { X, Download, Share2, Sparkles } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useTracker } from '../../context/TrackerContext';

export function ShareModal({ isOpen, onClose }) {
  const { getStats, settings } = useTracker();
  const { streak, totalSaved } = getStats();
  const cardRef = useRef(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `sober-steps-streak-${streak}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('oops, something went wrong!', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* The Card - Hidden from direct interaction but rendered for html-to-image */}
        <div
          ref={cardRef}
          className="w-[320px] h-[500px] bg-slate-950 rounded-[2.5rem] border-[12px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col p-8 text-center"
        >
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 blur-[100px] translate-y-1/2 -translate-x-1/2" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />

          <div className="relative z-10 flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-xl font-black text-white/50 tracking-[0.3em] uppercase mb-12">Sober Steps</h1>
              <div className="space-y-2">
                <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Current Streak</p>
                <div className="text-8xl font-black text-white leading-none">
                  {streak}
                </div>
                <p className="text-lg font-bold text-slate-400">Days Unstoppable</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Money Saved</p>
                <p className="text-2xl font-bold text-emerald-400 tracking-tight">
                  {settings.currency}{totalSaved.toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-4" />
                <p className="text-[10px] text-slate-500 font-medium tracking-wide">sobersteps.app</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleDownload}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95"
          >
            <Download className="w-5 h-5" /> Download Story Card
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-slate-400 hover:text-white rounded-2xl font-bold border border-slate-800 transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
