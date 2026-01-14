import { useState } from 'react';
import { X, TrendingUp, Calendar as CalIcon, AlertTriangle, Coffee, Pizza, MonitorPlay, ShoppingBag } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from 'date-fns';

export function StatsModal({ isOpen, onClose }) {
  const { logs, settings } = useTracker();
  const [viewMonth, setViewMonth] = useState(new Date());

  if (!isOpen) return null;

  // Prepare Data for Charts
  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const chartData = daysInMonth.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = logs[dateStr];
    return {
      day: format(date, 'd'),
      dateStr,
      drinks: entry?.drinkCount || 0,
      cost: entry?.cost || 0,
      status: entry?.status || 'none'
    };
  });

  const totalDrinksThisMonth = chartData.reduce((acc, curr) => acc + curr.drinks, 0);
  const totalSpentThisMonth = chartData.reduce((acc, curr) => acc + curr.cost, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-xl">
          <p className="text-slate-300 text-xs mb-1">Day {label}</p>
          <p className="text-indigo-400 font-bold text-sm">
            {payload[0].value} {payload[0].dataKey === 'drinks' ? 'Drinks' : settings.currency}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-slate-900/50 backdrop-blur-md border-b border-slate-800">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" /> Statistics
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">

        {/* Month Selector */}
        <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl mb-6">
          <button onClick={() => setViewMonth(subMonths(viewMonth, 1))} className="p-2 text-slate-400 hover:text-white">
            &larr;
          </button>
          <span className="font-medium text-slate-200">{format(viewMonth, 'MMMM yyyy')}</span>
          <button onClick={() => setViewMonth(new Date())} className="p-2 text-xs text-indigo-400 uppercase tracking-widest font-bold">
            Current
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Total Drinks</span>
            <span className="text-2xl font-bold text-white">{totalDrinksThisMonth}</span>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Total Spent</span>
            <span className="text-2xl font-bold text-white max-w-full truncate" title={totalSpentThisMonth}>
              {settings.currency}{totalSpentThisMonth.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Instead of... Calculator (Tangible Value) */}
        <section className="space-y-4">
          <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2">
            Instead of drinking, you could have bought...
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: 'Coffees', price: 150, icon: Coffee, color: 'text-orange-400' },
              { name: 'Pizzas', price: 500, icon: Pizza, color: 'text-amber-400' },
              { name: 'Movies', price: 300, icon: MonitorPlay, color: 'text-indigo-400' },
              { name: 'Clothes', price: 1500, icon: ShoppingBag, color: 'text-rose-400' },
            ].map((item) => {
              const { totalSaved } = useTracker().getStats();
              const count = Math.floor(totalSaved / item.price);
              const Icon = item.icon;
              return (
                <div key={item.name} className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800/50 flex flex-col items-center text-center gap-1 group hover:border-slate-700 transition-colors">
                  <div className={`p-2 rounded-full bg-slate-800/50 mb-1 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-lg font-bold text-white">{count}</span>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{item.name}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Danger Zone Analytics */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-900/10 p-6 rounded-3xl border border-indigo-500/20">
          <h3 className="text-sm font-medium text-indigo-300 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Danger Zone
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs text-indigo-400/60 uppercase tracking-widest font-semibold">Toughest Day</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-slate-100">{
                  Object.keys(chartData.reduce((acc, curr) => {
                    const dayName = format(new Date(curr.dateStr), 'EEEE');
                    if (curr.drinks > 0) acc[dayName] = (acc[dayName] || 0) + 1;
                    return acc;
                  }, {})).reduce((a, b, _, arr) => {
                    const counts = chartData.reduce((acc, curr) => {
                      const dayName = format(new Date(curr.dateStr), 'EEEE');
                      if (curr.drinks > 0) acc[dayName] = (acc[dayName] || 0) + 1;
                      return acc;
                    }, {});
                    return counts[a] > counts[b] ? a : b;
                  }, 'None')
                }</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-indigo-400/60 uppercase tracking-widest font-semibold">Costliest Drink</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-slate-100">{
                  Object.entries(daysInMonth.reduce((acc, date) => {
                    const entry = logs[format(date, 'yyyy-MM-dd')];
                    if (entry?.drinkType && entry.cost) {
                      acc[entry.drinkType] = (acc[entry.drinkType] || 0) + entry.cost;
                    }
                    return acc;
                  }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
                }</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drinks Chart */}
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
          <h3 className="text-sm font-medium text-slate-400 mb-6">Drinks per Day</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  interval={4}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="drinks" radius={[4, 4, 4, 4]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.drinks > 0 ? '#fb7185' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Chart */}
        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
          <h3 className="text-sm font-medium text-slate-400 mb-6">Daily Spending</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  interval={4}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#fbbf24' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
