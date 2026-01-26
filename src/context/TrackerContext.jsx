import { createContext, useContext, useState, useEffect } from 'react';
import { differenceInCalendarDays, format, subDays, isSameDay } from 'date-fns';

const TrackerContext = createContext();

const BADGES = [
  { id: 'first_step', name: 'First Step', description: 'Log your first sober day', icon: 'Footprints', condition: (stats) => stats.totalSober >= 1 },
  { id: 'week_warrior', name: 'Week Warrior', description: '7 days total sober', icon: 'Zap', condition: (stats) => stats.totalSober >= 7 },
  { id: 'seven_streak', name: 'Seven in a Row', description: '7 day streak', icon: 'Flame', condition: (stats) => stats.streak >= 7 },
  { id: 'month_master', name: 'Month Master', description: '30 days total sober', icon: 'Calendar', condition: (stats) => stats.totalSober >= 30 },
];

export function TrackerProvider({ children }) {
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('sober-steps-logs');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('sober-steps-settings');
      const defaults = {
        currency: '₹',
        name: 'User',
        baselineSpend: 0,
        monthlyBudget: 0,
        monthlyDrinkLimit: 0,
        savingsGoalName: '',
        savingsGoalPrice: 0,
        reasonsForQuitting: [],
        notificationsEnabled: false,
        lastPledgeDate: null,
        totalXP: 0,
        level: 1
      };
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch (e) {
      return { currency: '₹', name: 'User', totalXP: 0, level: 1 };
    }
  });

  useEffect(() => {
    localStorage.setItem('sober-steps-logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('sober-steps-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const makePledge = () => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    if (settings.lastPledgeDate !== todayStr) {
      const newXP = (settings.totalXP || 0) + 10;
      const newLevel = Math.floor(newXP / 100) + 1;
      updateSettings({
        lastPledgeDate: todayStr,
        totalXP: newXP,
        level: newLevel
      });
      return true;
    }
    return false;
  };

  const logDay = (dateStr, data) => {
    // data: { status: 'sober'|'drank'|null, note?, mood?, drinkCount?, trigger?, location? }
    setLogs(prev => {
      const newLogs = { ...prev };
      if (!data || data.status === null) {
        delete newLogs[dateStr];
      } else {
        newLogs[dateStr] = { ...newLogs[dateStr], ...data };
      }
      return newLogs;
    });

    // Add 5 XP for logging
    if (data && data.status) {
      const newXP = (settings.totalXP || 0) + 5;
      const newLevel = Math.floor(newXP / 100) + 1;
      updateSettings({ totalXP: newXP, level: newLevel });
    }
  };

  const getStats = () => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    let streak = 0;

    // ... (rest of streak logic remains same)
    let loopLimit = 3650;
    let current = today;
    if (logs[todayStr]?.status === 'sober') {
    } else {
      current = subDays(today, 1);
    }
    let count = 0;
    while (loopLimit > 0) {
      const dStr = format(current, 'yyyy-MM-dd');
      const entry = logs[dStr];
      if (entry?.status === 'sober') {
        count++;
        current = subDays(current, 1);
      } else if (isSameDay(current, today) && !entry) {
        current = subDays(current, 1);
      } else {
        break;
      }
      loopLimit--;
    }
    streak = count;

    const totalSober = Object.values(logs).filter(l => l.status === 'sober').length;
    const totalSpent = Object.values(logs).reduce((acc, l) => acc + (l.cost || 0), 0);

    // Savings Calculation
    const trackedDaysCount = Object.keys(logs).length;
    const totalPossibleBaseline = trackedDaysCount * (settings.baselineSpend || 0);
    const totalSaved = totalPossibleBaseline - totalSpent;

    // Monthly Stats
    const currentMonthLogs = Object.entries(logs).filter(([dateStr]) =>
      dateStr.startsWith(format(new Date(), 'yyyy-MM'))
    );
    const currentMonthSpent = currentMonthLogs.reduce((acc, [_, l]) => acc + (l.cost || 0), 0);
    const currentMonthDrinks = currentMonthLogs.reduce((acc, [_, l]) => acc + (l.drinkCount || l.quantity || 0), 0);

    // Trigger Analytics
    const triggerStats = {};
    const locationStats = {};
    Object.values(logs).forEach(l => {
      if (l.status === 'drank') {
        const t = l.trigger || 'Unknown';
        const loc = l.location || 'Unknown';
        triggerStats[t] = (triggerStats[t] || 0) + 1;
        locationStats[loc] = (locationStats[loc] || 0) + 1;
      }
    });

    const unlockedBadges = BADGES.filter(b => {
      return b.condition({ streak, totalSober, totalSaved });
    }).map(b => b.id);

    return {
      streak,
      totalSober,
      totalSpent,
      totalSaved,
      currentMonthSpent,
      currentMonthDrinks,
      unlockedBadges,
      badgesDef: BADGES,
      triggerStats,
      locationStats
    };
  };

  const importData = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.logs && parsed.settings) {
        setLogs(parsed.logs);
        setSettings(parsed.settings);
        return { success: true };
      }
      return { success: false, error: 'Invalid file format' };
    } catch (e) {
      return { success: false, error: 'Invalid JSON' };
    }
  };

  return (
    <TrackerContext.Provider value={{ logs, settings, updateSettings, makePledge, logDay, getStats, importData }}>
      {children}
    </TrackerContext.Provider>
  );
}

export const useTracker = () => useContext(TrackerContext);
