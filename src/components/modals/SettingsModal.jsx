import { useState } from 'react';
import { X, Save, Download, Upload, Bell, Target, LifeBuoy, TrendingUp, PiggyBank } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';

export function SettingsModal({ isOpen, onClose }) {
  const { settings, logs, updateSettings, importData } = useTracker();
  const [formData, setFormData] = useState(settings);

  if (!isOpen) return null;

  const handleSave = () => {
    updateSettings(formData);
    onClose();
  };

  const handleExport = () => {
    const data = JSON.stringify({ settings, logs });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sober-steps-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const result = importData(text);

    if (result.success) {
      alert('Data restored successfully!');
      onClose();
    } else {
      alert('Failed to restore: ' + result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-[2.5rem] w-full max-w-md border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" /> Settings
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto flex-1 custom-scrollbar">

          <section className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Profile & Life Gains</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Your Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Currency</label>
                <input
                  type="text"
                  maxLength="3"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium text-center"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400" title="Average calories per drink">Avg. Cal/Drink</label>
                <input
                  type="number"
                  value={formData.caloriesPerDrink || ''}
                  onChange={(e) => setFormData({ ...formData, caloriesPerDrink: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400" title="Average hours spent per session">Avg. Hours/Session</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.timePerDrink || ''}
                  onChange={(e) => setFormData({ ...formData, timePerDrink: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>
          </section>

          {/* SOS Section */}
          <section className="space-y-4 pt-4 border-t border-slate-800/50">
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-rose-400" />
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">SOS & Support</h4>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Cravings "Why" List (One per line)</label>
              <textarea
                rows="3"
                placeholder="Why are you doing this?..."
                value={Array.isArray(formData.reasonsForQuitting) ? formData.reasonsForQuitting.join('\n') : ''}
                onChange={(e) => setFormData({ ...formData, reasonsForQuitting: e.target.value.split('\n') })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-rose-500 transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Emergency Contacts (Name:Number, one per line)</label>
              <textarea
                rows="2"
                placeholder="Name:1234567890"
                value={Array.isArray(formData.emergencyContacts) ? formData.emergencyContacts.join('\n') : ''}
                onChange={(e) => setFormData({ ...formData, emergencyContacts: e.target.value.split('\n').filter(Boolean) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-rose-500 transition-all resize-none"
              />
            </div>
          </section>

          {/* Data Management */}
          <section className="pt-4 border-t border-slate-800/50 space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Data Management</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className="p-4 bg-slate-800/50 hover:bg-slate-800 text-slate-200 rounded-2xl border border-slate-700/50 transition-all flex flex-col items-center gap-2 hover:scale-[1.02]"
              >
                <Download className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold">Backup JSON</span>
              </button>
              <label className="p-4 bg-slate-800/50 hover:bg-slate-800 text-slate-200 rounded-2xl border border-slate-700/50 transition-all flex flex-col items-center gap-2 cursor-pointer hover:scale-[1.02]">
                <Upload className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold">Restore JSON</span>
                <input type="file" accept=".json" className="hidden" onChange={handleImport} />
              </label>
            </div>
          </section>
        </div>

        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-bold tracking-wide transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-3 active:scale-95"
          >
            <Save className="w-5 h-5" /> Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
}
