import { useTracker } from '../context/TrackerContext';
import { Flame, Trophy, PiggyBank, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function StatsBoard({ onSetGoal }) {
  const { getStats, settings } = useTracker();
  const { streak, totalSober, totalSpent, totalSaved } = getStats();

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-md mx-auto mb-6">
      <div className="bg-slate-900 rounded-[1.5rem] p-4 border border-slate-800 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-2.5 bg-orange-500/10 rounded-full mb-2 text-orange-400">
          <Flame className="w-5 h-5" />
        </div>
        <span className="text-2xl font-bold text-slate-100">{streak}</span>
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Streak</span>
      </div>

      <div className="bg-slate-900 rounded-[1.5rem] p-4 border border-slate-800 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-2.5 bg-emerald-500/10 rounded-full mb-2 text-emerald-400">
          <Trophy className="w-5 h-5" />
        </div>
        <span className="text-2xl font-bold text-slate-100">{totalSober}</span>
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Days</span>
      </div>

      <div className="bg-slate-900 rounded-[1.5rem] p-4 border border-slate-800 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-2.5 bg-rose-500/10 rounded-full mb-2 text-rose-400">
          <PiggyBank className="w-5 h-5" />
        </div>
        <span className="text-2xl font-bold text-slate-100 whitespace-nowrap">
          {settings.currency}{totalSpent.toLocaleString()}
        </span>
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Spent</span>
      </div>

      {/* Budget & Goals Progress Section */}
      <div className="col-span-3 space-y-3">

        {/* Savings Goal Card */}
        {settings.savingsGoalPrice > 0 ? (
          <div
            onClick={() => onSetGoal && onSetGoal()}
            className="bg-gradient-to-br from-emerald-900/40 to-slate-900 rounded-3xl p-5 border border-emerald-500/20 shadow-xl overflow-hidden relative group cursor-pointer hover:border-emerald-500/40 transition-all active:scale-[0.98]"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-12 h-12 text-emerald-400" />
            </div>
            <div className="flex justify-between items-end mb-4 text-left">
              <div>
                <h4 className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest mb-1">Savings for: {settings.savingsGoalName}</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">{settings.currency}{totalSaved.toLocaleString()}</span>
                  <span className="text-xs text-slate-500 font-medium">/ {settings.currency}{settings.savingsGoalPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-emerald-400">{Math.min(100, Math.floor((totalSaved / settings.savingsGoalPrice) * 100))}%</div>
              </div>
            </div>
            <div className="h-3 bg-slate-950/50 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, (totalSaved / settings.savingsGoalPrice) * 100))}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              />
            </div>
          </div>
        ) : (
          <div
            onClick={() => onSetGoal && onSetGoal()}
            className="bg-slate-900/30 rounded-3xl p-5 border border-dashed border-slate-800 flex flex-col items-center justify-center gap-2 group hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer active:scale-95"
          >
            <div className="p-2 bg-slate-800/50 rounded-full text-slate-600 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-bold text-slate-500 group-hover:text-indigo-300 uppercase tracking-widest">Set Savings Goal</p>
          </div>
        )}

        {(settings.monthlyBudget > 0 || settings.monthlyDrinkLimit > 0) && (
          <div
            onClick={() => onSetGoal && onSetGoal()}
            className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-4 cursor-pointer hover:border-slate-700 hover:bg-slate-800/50 transition-all active:scale-[0.98]"
          >
            {settings.monthlyBudget > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">Monthly Budget</span>
                  <span className={getStats().currentMonthSpent > settings.monthlyBudget ? "text-rose-400" : "text-slate-200"}>
                    {settings.currency}{getStats().currentMonthSpent.toLocaleString()} / {settings.currency}{settings.monthlyBudget.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${(getStats().currentMonthSpent / settings.monthlyBudget) > 1 ? 'bg-rose-500' :
                      (getStats().currentMonthSpent / settings.monthlyBudget) > 0.8 ? 'bg-orange-500' : 'bg-emerald-500'
                      }`}
                    style={{ width: `${Math.min((getStats().currentMonthSpent / settings.monthlyBudget) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {settings.monthlyDrinkLimit > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400">Drink Limit</span>
                  <span className={getStats().currentMonthDrinks > settings.monthlyDrinkLimit ? "text-rose-400" : "text-slate-200"}>
                    {Math.round(getStats().currentMonthDrinks)} / {settings.monthlyDrinkLimit}
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${(getStats().currentMonthDrinks / settings.monthlyDrinkLimit) > 1 ? 'bg-rose-500' :
                      (getStats().currentMonthDrinks / settings.monthlyDrinkLimit) > 0.8 ? 'bg-orange-500' : 'bg-emerald-500'
                      }`}
                    style={{ width: `${Math.min((getStats().currentMonthDrinks / settings.monthlyDrinkLimit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
