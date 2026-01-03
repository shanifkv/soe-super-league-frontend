import { Link } from "react-router-dom";

export interface Match {
    id: string;
    homeTeam: { name: string; logo: string; id: string; pool?: string };
    awayTeam: { name: string; logo: string; id: string; pool?: string };
    status: "SCHEDULED" | "LIVE" | "FINISHED";
    score: { home: number; away: number };
    date: string;
}

interface MatchCenterProps {
    matches: Match[];
}

export default function MatchCenter({ matches }: MatchCenterProps) {
    // 1. Filter Matches
    const liveMatches = matches.filter(m => m.status === 'LIVE');
    const finishedMatches = matches.filter(m => m.status === 'FINISHED').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
    const upcomingMatches = matches.filter(m => m.status === 'SCHEDULED').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3);

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in-up">

            {/* SECTION 1: LIVE MATCHES (Hero) */}
            {liveMatches.length > 0 && (
                <div className="w-full">
                    <div className="flex items-center gap-2 mb-2 justify-center">
                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                        <h3 className="text-red-500 font-bold tracking-widest text-xs uppercase">Live Now</h3>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {liveMatches.map(match => (
                            <Link to={`/fixtures`} key={match.id} className="w-full max-w-lg bg-zinc-900/80 border border-red-500/30 rounded-xl p-4 flex flex-col items-center relative overflow-hidden group hover:bg-zinc-900 transition-all">
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />

                                <div className="flex items-center justify-between w-full mb-2">
                                    <span className="text-[10px] text-zinc-500 font-mono">{match.homeTeam.pool ? `POOL ${match.homeTeam.pool}` : 'MATCH'}</span>
                                    <span className="text-[10px] text-red-500 font-bold animate-pulse">LIVE</span>
                                </div>

                                <div className="flex items-center justify-between w-full">
                                    {/* Home */}
                                    <div className="flex flex-col items-center w-1/3">
                                        <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-10 h-10 md:w-12 md:h-12 object-contain mb-1" />
                                        <span className="text-[10px] md:text-xs font-bold text-center uppercase leading-tight">{match.homeTeam.name}</span>
                                    </div>

                                    {/* Score */}
                                    <div className="flex gap-2 text-2xl md:text-3xl font-black text-white font-mono">
                                        <span>{match.score.home}</span>
                                        <span className="text-zinc-600">-</span>
                                        <span>{match.score.away}</span>
                                    </div>

                                    {/* Away */}
                                    <div className="flex flex-col items-center w-1/3">
                                        <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-10 h-10 md:w-12 md:h-12 object-contain mb-1" />
                                        <span className="text-[10px] md:text-xs font-bold text-center uppercase leading-tight">{match.awayTeam.name}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* SECTION 2: RECENT RESULTS */}
            {finishedMatches.length > 0 && (
                <div className="w-full">
                    <h3 className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase mb-2 text-center md:text-left">Recent Results</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {finishedMatches.map(match => (
                            <div key={match.id} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img src={match.homeTeam.logo} className="w-6 h-6 object-contain" />
                                    <span className="text-[10px] font-bold text-zinc-300">{match.score.home}</span>
                                </div>
                                <span className="text-[8px] text-zinc-600 font-mono">FT</span>
                                <div className="flex items-center gap-2 flex-row-reverse">
                                    <img src={match.awayTeam.logo} className="w-6 h-6 object-contain" />
                                    <span className="text-[10px] font-bold text-zinc-300">{match.score.away}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SECTION 3: UPCOMING */}
            {upcomingMatches.length > 0 && (
                <div className="w-full">
                    <h3 className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase mb-2 text-center md:text-left">Coming Up</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {upcomingMatches.map(match => (
                            <div key={match.id} className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-2 flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-2">
                                    <img src={match.homeTeam.logo} className="w-5 h-5 object-contain grayscale" />
                                    <span className="text-[9px] font-bold text-zinc-400 truncate max-w-[50px]">{match.homeTeam.name}</span>
                                </div>
                                <div className="text-center">
                                    <div className="text-[9px] text-zinc-300 font-bold">{new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                                    <div className="text-[8px] text-zinc-600 uppercase">{new Date(match.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                                </div>
                                <div className="flex items-center gap-2 flex-row-reverse">
                                    <img src={match.awayTeam.logo} className="w-5 h-5 object-contain grayscale" />
                                    <span className="text-[9px] font-bold text-zinc-400 truncate max-w-[50px]">{match.awayTeam.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Link to="/fixtures" className="text-center text-[10px] text-yellow-500 hover:text-white mt-2 font-bold uppercase tracking-widest">
                View All Fixtures &rarr;
            </Link>
        </div>
    );
}
