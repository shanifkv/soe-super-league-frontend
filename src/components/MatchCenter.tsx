import { Link } from "react-router-dom";

export interface Match {
    id: string;
    homeTeam: { name: string; logo: string; id: string; pool?: string; shortName?: string };
    awayTeam: { name: string; logo: string; id: string; pool?: string; shortName?: string };
    status: "SCHEDULED" | "LIVE" | "FINISHED";
    score: { home: number; away: number };
    date: string;
    round: string;
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
                            <Link to={`/fixtures`} key={match.id} className="w-full max-w-lg bg-black border-2 border-red-600 rounded-xl p-4 md:p-6 flex flex-col items-center relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                                {/* Live Pulse Badge */}
                                <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full animate-pulse">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                    <span className="text-white font-black text-xs tracking-widest uppercase">LIVE</span>
                                </div>

                                <div className="flex items-center justify-between w-full mt-4">
                                    {/* Home */}
                                    <div className="flex flex-col items-center w-1/3">
                                        <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-12 h-12 md:w-16 md:h-16 object-contain mb-2" />
                                        <span className="text-sm md:text-lg font-bold text-center uppercase leading-tight text-white">{match.homeTeam.name}</span>
                                    </div>

                                    {/* Score */}
                                    <div className="flex flex-col items-center relative z-10 mx-2">
                                        <div className="flex gap-4 text-4xl md:text-6xl font-black text-white font-display tracking-tighter">
                                            <span>{match.score.home}</span>
                                            <span className="text-zinc-700">-</span>
                                            <span>{match.score.away}</span>
                                        </div>
                                        <div className="text-[10px] text-zinc-500 font-mono mt-1 px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800">
                                            {match.homeTeam.pool ? `POOL ${match.homeTeam.pool}` : 'MATCH'}
                                        </div>
                                    </div>

                                    {/* Away */}
                                    <div className="flex flex-col items-center w-1/3">
                                        <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-12 h-12 md:w-16 md:h-16 object-contain mb-2" />
                                        <span className="text-sm md:text-lg font-bold text-center uppercase leading-tight text-white">{match.awayTeam.name}</span>
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
                    <h3 className="text-zinc-500 text-xs md:text-sm font-bold tracking-widest uppercase mb-4 text-center">Recent Results</h3>
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                        {finishedMatches.map(match => (
                            <div key={match.id} className="w-full max-w-2xl bg-zinc-950/90 border border-zinc-800 rounded-xl p-3 md:p-6 flex items-center justify-between hover:bg-black transition-colors">
                                {/* Home Team */}
                                <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                                    <img src={match.homeTeam.logo} className="w-8 h-8 md:w-16 md:h-16 object-contain flex-shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs md:text-xl font-bold text-white leading-tight break-words">{match.homeTeam.name}</span>
                                        <span className="text-[10px] md:text-xs text-zinc-500 font-mono hidden md:block">HOME</span>
                                    </div>
                                </div>

                                {/* Score */}
                                <div className="flex items-center gap-2 md:gap-8 mx-2 md:mx-4 flex-shrink-0">
                                    <span className="text-xl md:text-4xl font-black text-white">{match.score.home}</span>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[8px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest bg-zinc-800 px-1.5 py-0.5 md:px-2 md:py-1 rounded">FT</span>
                                    </div>
                                    <span className="text-xl md:text-4xl font-black text-white">{match.score.away}</span>
                                </div>

                                {/* Away Team */}
                                <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end min-w-0">
                                    <div className="flex flex-col items-end min-w-0">
                                        <span className="text-xs md:text-xl font-bold text-white leading-tight text-right break-words">{match.awayTeam.name}</span>
                                        <span className="text-[10px] md:text-xs text-zinc-500 font-mono hidden md:block">AWAY</span>
                                    </div>
                                    <img src={match.awayTeam.logo} className="w-8 h-8 md:w-16 md:h-16 object-contain flex-shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SECTION 3: UPCOMING */}
            {upcomingMatches.length > 0 && (
                <div className="w-full mt-4">
                    <h3 className="text-zinc-500 text-xs md:text-sm font-bold tracking-widest uppercase mb-4 text-center">Coming Up</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {upcomingMatches.map(match => (
                            <div key={match.id} className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 flex items-center justify-between hover:bg-zinc-900 transition-all group">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <img src={match.homeTeam.logo} className="w-8 h-8 object-contain grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100" />
                                    <span className="text-xs font-bold text-zinc-400 group-hover:text-white truncate transition-colors">{match.homeTeam.name}</span>
                                </div>
                                <div className="text-center px-2 flex-shrink-0">
                                    <div className="text-[10px] md:text-xs text-zinc-300 font-bold bg-zinc-800 px-2 py-1 rounded inline-block mb-1">
                                        {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </div>
                                    <div className="text-[9px] text-zinc-500 uppercase font-mono">{new Date(match.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                                </div>
                                <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                                    <span className="text-xs font-bold text-zinc-400 group-hover:text-white truncate transition-colors">{match.awayTeam.name}</span>
                                    <img src={match.awayTeam.logo} className="w-8 h-8 object-contain grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100" />
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
