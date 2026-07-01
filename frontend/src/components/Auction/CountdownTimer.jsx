import React, { useState, useEffect } from 'react';
import { Clock, Timer } from 'lucide-react';

const CountdownTimer = ({ endDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(endDate) - +new Date();
    if (difference <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      total: difference,
      days:    Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining.total <= 0) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.total <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-white/[0.06] text-zinc-500 dark:text-slate-400 border border-zinc-200 dark:border-white/[0.08] backdrop-blur-sm">
        <Clock className="w-3.5 h-3.5" /> Ended
      </span>
    );
  }

  const formatUnit = (num) => String(num).padStart(2, '0');

  // Severity colors — bright enough for dark background
  let colorClass = 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30';
  if (timeLeft.total < 1000 * 60 * 60) {
    // < 1 hour — urgent
    colorClass = 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 animate-pulse';
  } else if (timeLeft.total < 1000 * 60 * 60 * 12) {
    // < 12 hours — warning
    colorClass = 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm shadow-sm ${colorClass}`}>
      <Timer className="w-3.5 h-3.5" />
      {timeLeft.days > 0 && `${timeLeft.days}d `}
      {formatUnit(timeLeft.hours)}:{formatUnit(timeLeft.minutes)}:{formatUnit(timeLeft.seconds)}
    </span>
  );
};

export default CountdownTimer;
