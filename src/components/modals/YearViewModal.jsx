import { X, Calendar as CalIcon, Info } from 'lucide-react';
import { format, startOfYear, endOfYear, eachDayOfInterval, isSameMonth, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { useTracker } from '../../context/TrackerContext';
import { twMerge } from 'tailwind-merge';

export function YearViewModal({ isOpen, onClose }) {
  const { logs } = useTracker();

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const yearStart = startOfYear(new Date());
  const yearEnd = endOfYear(new Date());
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const getStatusColor = (date) => {
    const dStr = format(date, 'yyyy-MM-dd');
    const entry = logs[dStr];
    if (!entry) return 'bg-slate-800/30';
    if (entry.status === 'sober') return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
    if (entry.status === 'drank') return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]';
    return 'bg-slate-800/30';
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900/95 border border-slate-700/50 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-indigo-500/10">

        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-2xl text-indigo-400">
              <CalIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight uppercase">{currentYear} in Pixels</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Full Year Overview</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8 pt-4">
          {/* Legend */}
          <div className="flex justify-center gap-6 mb-8 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sober</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-rose-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Drank</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-slate-800" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Log</span>
            </div>
          </div>

          <div className="grid grid-cols-6 lg:grid-cols-12 gap-8 min-w-max pb-4">
            {months.map(month => {
              const daysInMonth = eachDayOfInterval({
                start: startOfMonth(month),
                end: endOfMonth(month)
              });

              return (
                <div key={format(month, 'MMM')} className="flex flex-col gap-3">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest text-center">
                    {format(month, 'MMM')}
                  </span>
                  <div className="flex flex-col gap-1.5 items-center">
                    {daysInMonth.map(day => (
                      <div
                        key={format(day, 'yyyy-MM-dd')}
                        className={twMerge(
                          "w-3 h-3 rounded-sm transition-all duration-300",
                          getStatusColor(day)
                        )}
                        title={format(day, 'MMM do')}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-center">
          <div className="flex items-center gap-2 text-slate-500">
            <Info className="w-4 h-4" />
            <span className="text-[10px] font-medium tracking-wide">Hover over a pixel to see the date</span>
          </div>
        </div>

      </div>
    </div>
  );
}
