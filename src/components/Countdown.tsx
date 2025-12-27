import { useEffect, useState } from "react";

/**
 * Countdown always targets the NEXT Jan 1
 * No hardcoded year = professional & future-safe
 */
function getNextJan1() {
  const now = new Date();
  const year =
    now.getMonth() === 0 && now.getDate() === 1
      ? now.getFullYear()
      : now.getFullYear() + 1;

  return new Date(`${year}-01-01T09:00:00`);
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
  const targetDate = getNextJan1();
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
    <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div
          key={label}
          className="bg-zinc-900 rounded-lg py-4"
        >
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs uppercase tracking-wide text-zinc-400">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
