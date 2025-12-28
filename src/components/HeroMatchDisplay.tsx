import { useEffect, useState } from "react";
import { mockTeams } from "../mock/teams";

// Helper to get logo
const getLogo = (name: string) => {
    const team = mockTeams.find(t => t.title.rendered === name);
    return team?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
};

// Configurable Match State for Demo
// Change 'status' to 'UPCOMING' or 'LIVE' to see different states
const FEATURED_MATCH = {
    team1: "FC MALABARIES",
    team2: "AETOZ FC",
    date: "2025-10-15T16:30:00",
    venue: "Main Turf",
    status: "LIVE", // 'UPCOMING' | 'LIVE' 
    score1: 2,
    score2: 1,
    minute: "72"
};

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

export default function HeroMatchDisplay() {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(new Date(FEATURED_MATCH.date)));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft(new Date(FEATURED_MATCH.date)));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const isLive = FEATURED_MATCH.status === 'LIVE';

    return (
        <div className="w-full max-w-4xl mx-auto mt-8 mb-12 animate-fade-in-up animation-delay-200">
            {/* Glass Container */}
            <div className="relative overflow-hidden rounded-3xl bg-zinc-900/40 backdrop-blur-md border border-white/10 p-1 md:p-2">
                {/* Glow Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent blur-sm" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 bg-black/20 rounded-2xl p-6 md:p-8 relative z-10">

                    {/* Status Pill */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 md:hidden">
                        {isLive ? (
                            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-600/40">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-red-500 tracking-wider">LIVE NOW</span>
                            </span>
                        ) : (
                            <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/5 tracking-wider">
                                UPCOMING
                            </span>
                        )}
                    </div>

                    {/* Team 1 */}
                    <div className="flex-1 flex flex-col items-center gap-4 text-center group cursor-pointer pt-6 md:pt-0">
                        <div className="relative">
                            <div className="absolute inset-0 bg-yellow-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <img
                                src={getLogo(FEATURED_MATCH.team1)}
                                alt={FEATURED_MATCH.team1}
                                className="w-20 h-20 md:w-32 md:h-32 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                        <h3 className="text-lg md:text-2xl font-black text-white uppercase italic tracking-tighter">
                            {FEATURED_MATCH.team1}
                        </h3>
                    </div>

                    {/* Center Info */}
                    <div className="flex flex-col items-center justify-center shrink-0 min-w-[140px]">
                        {/* Desktop Status */}
                        <div className="hidden md:flex mb-4">
                            {isLive ? (
                                <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-600/40">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-xs font-bold text-red-500 tracking-widest">LIVE</span>
                                </span>
                            ) : (
                                <span className="text-xs font-bold text-zinc-500 bg-white/5 px-4 py-1 rounded-full border border-white/5 tracking-widest">
                                    UPCOMING
                                </span>
                            )}
                        </div>

                        {isLive ? (
                            <>
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="text-5xl md:text-7xl font-mono font-black text-white leading-none tracking-tighter">
                                        {FEATURED_MATCH.score1}
                                    </span>
                                    <span className="text-zinc-600 text-3xl font-light">-</span>
                                    <span className="text-5xl md:text-7xl font-mono font-black text-white leading-none tracking-tighter">
                                        {FEATURED_MATCH.score2}
                                    </span>
                                </div>
                                <div className="text-green-400 font-mono font-bold text-lg animate-pulse tracking-widest">
                                    {FEATURED_MATCH.minute}'
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-3xl md:text-5xl font-black text-white tracking-widest mb-2 opacity-20">VS</div>
                                {timeLeft ? (
                                    <div className="flex gap-4 text-center mt-2">
                                        <div>
                                            <div className="text-xl font-bold text-white tabular-nums">{String(timeLeft.days).padStart(2, '0')}</div>
                                            <div className="text-[8px] text-zinc-500 uppercase">Days</div>
                                        </div>
                                        <div className="text-zinc-700">:</div>
                                        <div>
                                            <div className="text-xl font-bold text-white tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</div>
                                            <div className="text-[8px] text-zinc-500 uppercase">Hrs</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm font-bold text-yellow-500">KICKOFF!</div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Team 2 */}
                    <div className="flex-1 flex flex-col items-center gap-4 text-center group cursor-pointer pt-6 md:pt-0">
                        <div className="relative">
                            <div className="absolute inset-0 bg-yellow-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <img
                                src={getLogo(FEATURED_MATCH.team2)}
                                alt={FEATURED_MATCH.team2}
                                className="w-20 h-20 md:w-32 md:h-32 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                        <h3 className="text-lg md:text-2xl font-black text-white uppercase italic tracking-tighter">
                            {FEATURED_MATCH.team2}
                        </h3>
                    </div>
                </div>

                {/* Venue Strip */}
                <div className="bg-black/40 py-2 flex items-center justify-center gap-2 text-[10px] md:text-xs font-medium text-zinc-400 uppercase tracking-[0.2em]">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-zinc-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                    {FEATURED_MATCH.venue} • {new Date(FEATURED_MATCH.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
            </div>
        </div>
    );
}
