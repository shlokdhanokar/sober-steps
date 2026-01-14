import { useTracker } from '../../context/TrackerContext';
import { Footprints, Zap, Calendar, PiggyBank, Lock, Flame } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const ICONS = {
  Footprints,
  Zap,
  Calendar,
  PiggyBank,
  Flame
};

export function BadgeList() {
  const { getStats } = useTracker();
  const { unlockedBadges, badgesDef } = getStats();

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Achievements</h3>
      <div className="grid grid-cols-4 gap-3">
        {badgesDef.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          const Icon = ICONS[badge.icon] || Footprints;

          return (
            <div
              key={badge.id}
              className={twMerge(
                "aspect-square rounded-2xl flex flex-col items-center justify-center p-2 border transition-all relative group",
                isUnlocked
                  ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/10"
                  : "bg-slate-900 border-slate-800 text-slate-700"
              )}
            >
              {isUnlocked ? (
                <Icon className="w-6 h-6 mb-1" />
              ) : (
                <Lock className="w-6 h-6 mb-1 opacity-50" />
              )}
              <span className="text-[10px] text-center font-medium leading-tight opacity-80 decoration-indigo-300">
                {badge.name}
              </span>

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 bg-slate-800 text-xs text-slate-200 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700 z-10">
                {badge.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
