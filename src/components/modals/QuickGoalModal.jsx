import { useState } from 'react';
import { X, Save, PiggyBank, Sparkles } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';

export function QuickGoalModal({ isOpen, onClose }) {
  const { settings, updateSettings } = useTracker();
  const [formData, setFormData] = useState({
    baselineSpend: settings.baselineSpend || 0,
    savingsGoalName: settings.savingsGoalName || '',
    savingsGoalPrice: settings.savingsGoalPrice || 0,
    monthlyBudget: settings.monthlyBudget || 0,
    monthlyDrinkLimit: settings.monthlyDrinkLimit || 0
  });

  if (!isOpen) return null;

  const handleSave = () => {
    updateSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-[2.5rem] w-full max-w-sm border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-indigo-400" /> Goal Planner
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Section: Savings Goal */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/50 pb-2">Treat Yourself (Savings)</h4>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Daily Habit Spend ({settings.currency})</label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={formData.baselineSpend || ''}
                onChange={(e) => setFormData({ ...formData, baselineSpend: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Treat Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shoes"
                  value={formData.savingsGoalName || ''}
                  onChange={(e) => setFormData({ ...formData, savingsGoalName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Cost</label>
                <input
                  type="number"
                  placeholder="5000"
                  value={formData.savingsGoalPrice || ''}
                  onChange={(e) => setFormData({ ...formData, savingsGoalPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section: Monthly Limits */}
          <div className="space-y-4 pt-4 border-t border-slate-800/50">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/50 pb-2">Monthly Limits</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Max Budget</label>
                <input
                  type="number"
                  value={formData.monthlyBudget || ''}
                  onChange={(e) => setFormData({ ...formData, monthlyBudget: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Max Drinks</label>
                <input
                  type="number"
                  value={formData.monthlyDrinkLimit || ''}
                  onChange={(e) => setFormData({ ...formData, monthlyDrinkLimit: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-bold tracking-wide transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-3 active:scale-95"
          >
            <Save className="w-5 h-5" /> Save Goals
          </button>
        </div>
      </div>
    </div>
  );
}
