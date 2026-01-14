import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isFuture,
  addMonths,
  subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { DayDetailModal } from './modals/DayDetailModal';
import { twMerge } from 'tailwind-merge';

export function CalendarView() {
  const { logs } = useTracker();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Modal State
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  });

  const handleDayClick = (date) => {
    if (isFuture(date) && !isToday(date)) return;
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const getDayStatusClass = (status) => {
    switch (status) {
      case 'sober':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20';
      case 'drank':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20';
      default:
        return 'bg-slate-800/30 text-slate-500 border-slate-800 hover:bg-slate-800/80';
    }
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-b from-slate-900 to-slate-900/50 rounded-[2rem] border border-slate-800 shadow-2xl backdrop-blur-xl mb-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-slate-200 tracking-wide">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-3 mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {daysInMonth.map((date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const status = logs[dateStr]?.status;
            const isCurrentMonth = isSameMonth(date, currentMonth);
            const isFutureDate = isFuture(date) && !isToday(date);

            return (
              <button
                key={dateStr}
                onClick={() => handleDayClick(date)}
                disabled={isFutureDate}
                className={twMerge(
                  "aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 relative group overflow-hidden",
                  !isCurrentMonth && "opacity-0 pointer-events-none", // Hide non-current month days for cleaner look
                  isFutureDate && "opacity-20 cursor-not-allowed",
                  getDayStatusClass(status),
                  isToday(date) && "ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-slate-950 bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                )}
              >
                <span className="text-sm font-medium z-10">{format(date, 'd')}</span>
                {status === 'sober' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10">
                    <CheckCircle2 className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                {status === 'drank' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-rose-500/10">
                    <XCircle className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <DayDetailModal
        date={selectedDate || new Date()}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
