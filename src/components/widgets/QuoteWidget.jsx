import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const QUOTES = [
  "One day at a time.",
  "Rock bottom became the solid foundation on which I rebuilt my life.",
  "Your best days are ahead of you.",
  "Sobriety is a journey, not a destination.",
  "It does not matter how slowly you go as long as you do not stop.",
  "The only way out is through.",
  "Recovery is about progression, not perfection.",
  "Strength grows in the moments when you think you can't go on but you keep going anyway.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  "Believe you can and you're halfway there."
];

export function QuoteWidget() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Simple daily rotation based on day of year
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setQuote(QUOTES[dayOfYear % QUOTES.length]);
  }, []);

  return (
    <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-sm mb-6 text-center relative overflow-hidden">
      <Quote className="w-8 h-8 text-indigo-500/20 absolute top-4 left-4" />
      <p className="text-slate-300 font-medium italic relative z-10 px-4">"{quote}"</p>
    </div>
  );
}
