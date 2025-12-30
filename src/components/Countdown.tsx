import { useEffect, useState } from "react";

// Updated to Jan 6, 2026 5:00 PM
function getKickoffDate() {
  return new Date("2026-01-06T17:00:00");
}

function getTimeLeft(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown() {
  const targetDate = getKickoffDate();
  const [timeLeft, setTimeLeft] = useState(() =>
    getTimeLeft(targetDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <p className="text-lg font-semibold text-green-400">
        Kickoff day is here ⚽
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center animate-fade-in-up animation-delay-300">
      <div className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-yellow-500 mb-6 drop-shadow-md">
        Kickoff In
      </div>
      <div className="flex items-center gap-3 md:gap-6 p-4 md:p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
          <span className="text-3xl md:text-5xl font-black text-white tabular-nums leading-none tracking-tight">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mt-2 font-medium">Days</span>
        </div>

        <div className="h-8 md:h-12 w-[1px] bg-white/10" />

        <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
          <span className="text-3xl md:text-5xl font-black text-white tabular-nums leading-none tracking-tight">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mt-2 font-medium">Hrs</span>
        </div>

        <div className="h-8 md:h-12 w-[1px] bg-white/10" />

        <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
          <span className="text-3xl md:text-5xl font-black text-white tabular-nums leading-none tracking-tight">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mt-2 font-medium">Mins</span>
        </div>

        <div className="h-8 md:h-12 w-[1px] bg-white/10" />

        <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
          <span className="text-3xl md:text-5xl font-black text-yellow-500 tabular-nums leading-none tracking-tight">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mt-2 font-medium">Secs</span>
        </div>
      </div>
    </div>
  );
}
