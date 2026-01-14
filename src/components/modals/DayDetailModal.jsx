import { useState, useEffect } from 'react';
import { X, Wine, CheckCircle2, Smile, Meh, Frown } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTracker } from '../../context/TrackerContext';

export function DayDetailModal({ date, isOpen, onClose }) {
  const { logs, logDay } = useTracker();
  const dateStr = format(date, 'yyyy-MM-dd');
  const existingLog = logs[dateStr] || {};

  const [status, setStatus] = useState(existingLog.status || null);
  const [note, setNote] = useState(existingLog.note || '');
  const [mood, setMood] = useState(existingLog.mood || 'neutral');

  // Initialize inputs as empty strings for correct UI behavior
  const [drinkType, setDrinkType] = useState(existingLog.drinkType || 'Beer');
  const [unit, setUnit] = useState(existingLog.unit || 'Can');
  const [volume, setVolume] = useState(existingLog.volume || '');
  const [quantity, setQuantity] = useState(existingLog.quantity || '');
  const [cost, setCost] = useState(existingLog.cost || '');

  // Volume logic helper
  const getVolumeOptions = (unitType) => {
    switch (unitType) {
      case 'Bottle': return [330, 500, 650, 750, 1000];
      case 'Can': return [330, 500];
      case 'Peg (Small)': return [30];
      case 'Peg (Large)': return [60];
      case 'Glass': return [150, 250, 300, 500];
      default: return [];
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStatus(existingLog.status || null);
      setNote(existingLog.note || '');
      setMood(existingLog.mood || 'neutral');
      setCost(existingLog.cost || '');
      setDrinkType(existingLog.drinkType || 'Beer');
      setUnit(existingLog.unit || 'Can');
      setVolume(existingLog.volume || '');
      setQuantity(existingLog.quantity || '');
    }
  }, [isOpen, dateStr, logs]);

  const handleSave = () => {
    logDay(dateStr, {
      status,
      note,
      mood,
      drinkCount: status === 'drank' ? Number(quantity) : 0,
      quantity: status === 'drank' ? Number(quantity) : 0,
      cost: status === 'drank' ? Number(cost) : 0,
      drinkType: status === 'drank' ? drinkType : null,
      unit: status === 'drank' ? unit : null,
      volume: status === 'drank' ? Number(volume) : 0
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-[2rem] w-full max-w-md border border-slate-700/50 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-white/10">

        {/* Header */}
        <div className="p-5 border-b border-slate-700/50 flex items-center justify-between bg-gradient-to-r from-slate-800/50 to-transparent">
          <h3 className="text-xl font-bold text-slate-100 tracking-tight">
            {format(date, 'MMMM do')}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">

          {/* Status Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setStatus('sober')}
              className={twMerge(
                "p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-300 group",
                status === 'sober'
                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  : "bg-slate-800/30 border-transparent hover:border-slate-600 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              )}
            >
              <CheckCircle2 className={twMerge("w-8 h-8 transition-transform group-hover:scale-110", status === 'sober' && "scale-110")} />
              <span className="font-bold tracking-wide">Sober</span>
            </button>
            <button
              onClick={() => setStatus('drank')}
              className={twMerge(
                "p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-300 group",
                status === 'drank'
                  ? "bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]"
                  : "bg-slate-800/30 border-transparent hover:border-slate-600 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              )}
            >
              <Wine className={twMerge("w-8 h-8 transition-transform group-hover:scale-110", status === 'drank' && "scale-110")} />
              <span className="font-bold tracking-wide">Drank</span>
            </button>
          </div>

          {/* Drank Details */}
          {status === 'drank' && (
            <div className="space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">

              <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Drink</label>
                    <select
                      value={drinkType}
                      onChange={(e) => setDrinkType(e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all appearance-none"
                    >
                      <option>Beer</option>
                      <option>Vodka</option>
                      <option>Rum</option>
                      <option>Whiskey</option>
                      <option>Gin</option>
                      <option>Wine</option>
                      <option>Tequila</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unit</label>
                    <select
                      value={unit}
                      onChange={(e) => {
                        const newUnit = e.target.value;
                        setUnit(newUnit);
                        const opts = getVolumeOptions(newUnit);
                        if (opts.length > 0) setVolume(opts[0]);
                        else setVolume('');
                      }}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all appearance-none"
                    >
                      <option>Bottle</option>
                      <option>Can</option>
                      <option>Glass</option>
                      <option>Peg (Small)</option>
                      <option>Peg (Large)</option>
                    </select>
                  </div>
                </div>

                {/* Volume Selection (Dynamic) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Volume ({unit})</label>
                  <select
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all appearance-none"
                  >
                    {getVolumeOptions(unit).map(opt => (
                      <option key={opt} value={opt}>{opt} ml</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quantity</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Spent (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-slate-500">₹</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Mood Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">How did you feel?</label>
            <div className="flex justify-between gap-2 p-1 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              {['happy', 'neutral', 'sad'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={twMerge(
                    "flex-1 py-3 rounded-xl transition-all flex justify-center",
                    mood === m
                      ? "bg-slate-700 text-white shadow-lg scale-105"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-700/50"
                  )}
                >
                  {m === 'happy' && <Smile className="w-6 h-6" />}
                  {m === 'neutral' && <Meh className="w-6 h-6" />}
                  {m === 'sad' && <Frown className="w-6 h-6" />}
                </button>
              ))}
            </div>
          </div>

          {/* Journal Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notes</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="w-full h-24 bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 resize-none transition-all"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-bold tracking-wide transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}
