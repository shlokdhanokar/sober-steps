import { useState, useEffect } from 'react';
import { TrackerProvider, useTracker } from './context/TrackerContext';
import { CalendarView } from './components/CalendarView';
import { StatsBoard } from './components/StatsBoard';
import { QuoteWidget } from './components/widgets/QuoteWidget';
import { BadgeList } from './components/widgets/BadgeList';
import { SettingsModal } from './components/modals/SettingsModal';
import { StatsModal } from './components/modals/StatsModal';
import { RecoveryModal } from './components/modals/RecoveryModal';
import { SOSModal } from './components/modals/SOSModal';
import { ShareModal } from './components/modals/ShareModal';
import { YearViewModal } from './components/modals/YearViewModal';
import { QuickGoalModal } from './components/modals/QuickGoalModal';
import { DailyPledge } from './components/DailyPledge';
import { WineOff, Settings as SettingsIcon, MoreVertical, TrendingUp, Heart, LifeBuoy, Share2, Grid, Star } from 'lucide-react';

function AppContent() {
  const { settings } = useTracker();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isYearViewOpen, setIsYearViewOpen] = useState(false);
  const [isQuickGoalOpen, setIsQuickGoalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Daily Reminder Logic
  useEffect(() => {
    if (settings.notificationsEnabled && Notification.permission === 'granted') {
      const timer = setTimeout(() => {
        new Notification("Sober Steps", {
          body: "Don't forget to log your win for today! 🌟",
          icon: "/vite.svg"
        });
      }, 5000); // Demo delay: show reminder 5s after opening if enabled
      return () => clearTimeout(timer);
    }
  }, [settings.notificationsEnabled]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 flex flex-col items-center relative selection:bg-indigo-500/30 overflow-x-hidden" onClick={() => setIsMenuOpen(false)}>
      {/* Background glow effects */}
      <div className="fixed top-0 left-0 w-full h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 translate-x-1/2"></div>

      <header className="w-full max-w-lg mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
            <WineOff className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 tracking-tight leading-none mb-1">
              Sober Steps
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Your Journey</p>
              <div className="flex items-center gap-1 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                <span className="text-[9px] font-black text-amber-200">LVL {settings.level || 1}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Main Action Buttons */}
          <button
            onClick={() => setIsSOSOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center gap-2 group transform active:scale-95"
            title="SOS Support"
          >
            <LifeBuoy className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
            <span className="text-xs font-black uppercase tracking-wider">SOS</span>
          </button>

          <div className="h-8 w-px bg-slate-800 mx-1" />

          <button
            onClick={() => setIsRecoveryOpen(true)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300 transition-colors"
            title="Health Timeline"
          >
            <Heart className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsYearViewOpen(true)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 hover:text-indigo-300 transition-colors"
            title="Year in Pixels"
          >
            <Grid className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsStatsOpen(true)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 hover:text-emerald-300 transition-colors"
            title="Statistics"
          >
            <TrendingUp className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden z-[100]">
                <button
                  onClick={() => { setIsShareOpen(true); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> Share Progress
                </button>
                <button
                  onClick={() => { setIsSettingsOpen(true); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                >
                  <SettingsIcon className="w-4 h-4 text-slate-400" /> Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="w-full max-w-lg space-y-2 relative z-0">
        <QuoteWidget />
        <DailyPledge />
        <StatsBoard onSetGoal={() => setIsQuickGoalOpen(true)} />
        <CalendarView />
        <BadgeList />
      </main>

      <footer className="mt-auto pt-10 text-center text-[10px] text-slate-600 uppercase tracking-widest relative z-10">
        <p>© {new Date().getFullYear()} Sober Steps • One day at a time</p>
      </footer>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
      <RecoveryModal isOpen={isRecoveryOpen} onClose={() => setIsRecoveryOpen(false)} />
      <SOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <YearViewModal isOpen={isYearViewOpen} onClose={() => setIsYearViewOpen(false)} />
      <QuickGoalModal isOpen={isQuickGoalOpen} onClose={() => setIsQuickGoalOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <TrackerProvider>
      <AppContent />
    </TrackerProvider>
  );
}

export default App;
