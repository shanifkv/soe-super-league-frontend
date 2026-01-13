import { MATCHES as STATIC_MATCHES } from "../data/fixtures";

// Types (redefined to avoid circular deps if not exported)
interface Team {
    id: string;
    name: string;
    logo: string;
    shortName?: string;
}

export interface Match {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    status: "SCHEDULED" | "LIVE" | "FINISHED";
    score: { home: number; away: number };
    date: string;
    round: string;
}

interface KnockoutBracketProps {
    liveMatches: Match[];
}

export default function KnockoutBracket({ liveMatches }: KnockoutBracketProps) {

    // Merge logic: Use live match if available, otherwise static match
    const getMatch = (roundName: string, fallbackHome?: string, fallbackAway?: string): Match | undefined => {
        let match = liveMatches.find(m => m.round === roundName);

        if (!match) {
            // @ts-ignore - STATIC_MATCHES might have slight type mismatch with live data
            const staticMatch = STATIC_MATCHES.find(m => m.round === roundName);
            if (staticMatch) {
                match = {
                    ...staticMatch,
                    status: "SCHEDULED",
                    score: { home: 0, away: 0 }
                } as unknown as Match;
            }
        }

        if (!match && fallbackHome && fallbackAway) {
            match = liveMatches.find(m => m.homeTeam.name.includes(fallbackHome) && m.awayTeam.name.includes(fallbackAway));
        }

        return match;
    };

    const semiFinal1 = getMatch("Semi Final 1", "Aetoz", "Gunners");
    const semiFinal2 = getMatch("Semi Final 2", "Palliyangadi", "Bavaria");
    const finalMatch = getMatch("Grand Final") || getMatch("Final");

    const semiFinal1Winner = semiFinal1?.status === 'FINISHED'
        ? (semiFinal1.score.home > semiFinal1.score.away ? semiFinal1.homeTeam : semiFinal1.awayTeam)
        : null;

    const semiFinal2Winner = semiFinal2?.status === 'FINISHED'
        ? (semiFinal2.score.home > semiFinal2.score.away ? semiFinal2.homeTeam : semiFinal2.awayTeam)
        : null;

    const finalist1 = finalMatch?.homeTeam || semiFinal1Winner;
    const finalist2 = finalMatch?.awayTeam || semiFinal2Winner;

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 w-full max-w-6xl mx-auto relative px-2">

            {/* Background Connection Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-40 right-40 h-[1px] bg-zinc-800 -z-10" />

            {/* --- Left Side: Semi Final 1 --- */}
            <div className="flex flex-col justify-center gap-6 md:gap-8 w-full md:w-80 relative order-1">
                <div className="text-center md:text-left mb-2 md:mb-4">
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Semi Final 1</span>
                    {semiFinal1?.date && (
                        <div className="text-[10px] text-zinc-600 font-mono mt-1">
                            {new Date(semiFinal1.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase()} • {new Date(semiFinal1.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            <span className="block text-zinc-700">SOE Stadium</span>
                        </div>
                    )}
                </div>
                {/* Connector */}
                <div className="hidden md:block absolute top-[3.5rem] bottom-[3.5rem] -right-8 w-8 border-r border-t border-b border-zinc-800 rounded-r-2xl pointer-events-none" />

                <TeamBracketCard
                    team={semiFinal1?.homeTeam}
                    score={semiFinal1?.score.home}
                    isWinner={semiFinal1 && semiFinal1.status === 'FINISHED' && semiFinal1.score.home > semiFinal1.score.away}
                    align="left"
                    status={semiFinal1?.status}
                />

                <TeamBracketCard
                    team={semiFinal1?.awayTeam}
                    score={semiFinal1?.score.away}
                    isWinner={semiFinal1 && semiFinal1.status === 'FINISHED' && semiFinal1.score.away > semiFinal1.score.home}
                    align="left"
                    status={semiFinal1?.status}
                />
            </div>

            {/* --- Right Side: Semi Final 2 --- */}
            <div className="flex flex-col justify-center gap-6 md:gap-8 w-full md:w-80 relative order-2 md:order-3">
                <div className="text-center md:text-right mb-2 md:mb-4">
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Semi Final 2</span>
                    {semiFinal2?.date && (
                        <div className="text-[10px] text-zinc-600 font-mono mt-1">
                            {new Date(semiFinal2.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase()} • {new Date(semiFinal2.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            <span className="block text-zinc-700">SOE Stadium</span>
                        </div>
                    )}
                </div>
                {/* Connector */}
                <div className="hidden md:block absolute top-[3.5rem] bottom-[3.5rem] -left-8 w-8 border-l border-t border-b border-zinc-800 rounded-l-2xl pointer-events-none" />

                <TeamBracketCard
                    team={semiFinal2?.homeTeam}
                    score={semiFinal2?.score.home}
                    isWinner={semiFinal2 && semiFinal2.status === 'FINISHED' && semiFinal2.score.home > semiFinal2.score.away}
                    align="right"
                    status={semiFinal2?.status}
                />

                <TeamBracketCard
                    team={semiFinal2?.awayTeam}
                    score={semiFinal2?.score.away}
                    isWinner={semiFinal2 && semiFinal2.status === 'FINISHED' && semiFinal2.score.away > semiFinal2.score.home}
                    align="right"
                    status={semiFinal2?.status}
                />
            </div>

            {/* --- Center: Final --- */}
            <div className="flex flex-col items-center gap-8 order-3 md:order-2 w-full md:w-96 z-10 mt-8 md:mt-0">
                {/* Trophy */}
                <div className="relative group">
                    <div className="hidden md:block absolute inset-0 bg-yellow-500/10 blur-2xl rounded-full" />
                    <svg className="w-24 h-24 md:w-32 md:h-32 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)] transform group-hover:scale-105 transition-transform duration-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 2c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v2c0 2.2-1.79 4-4 4h-1v2.5c0 .35-.04.69-.12 1.02l.62 1.98h3.35c.63-1.6 2.65-2.29 4.15-1.55S23.29 13.65 22.55 15.15 19.9 17.44 18.4 16.7L18.4 16.7l-4.2-1.2A5.39 5.39 0 0112 18h0a5.39 5.39 0 01-2.2-.5l-4.2 1.2c-1.5.74-3.5-.05-4.15-1.55S2.85 13.5 3.6 12s3.52-.05 4.15 1.55h3.35L7.12 11.52A5.55 5.55 0 017 10.5V8H6c-2.21 0-4-1.79-4-4V2zm2 2v2c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V4H7z" />
                    </svg>
                </div>

                {/* Final Box */}
                <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />
                    <span className="text-yellow-500 text-xs font-black uppercase tracking-widest mb-6 relative z-10">Grand Final</span>

                    <div className="flex items-center justify-between w-full gap-4 relative z-10">
                        {/* Finalist 1 */}
                        <div className="flex flex-col items-center gap-3">
                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-black border-2 flex items-center justify-center p-3 transition-all ${finalist1 ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-zinc-800'}`}>
                                {finalist1 ? (
                                    <img src={finalist1.logo} className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-zinc-700 text-2xl md:text-3xl font-black">?</span>
                                )}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${finalist1 ? 'text-white' : 'text-zinc-600'}`}>
                                {finalist1?.name || "Winner SF1"}
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <div className="text-2xl md:text-3xl font-black text-white">VS</div>
                            <div className="text-[10px] text-zinc-500 font-mono">13 JAN</div>
                        </div>

                        {/* Finalist 2 */}
                        <div className="flex flex-col items-center gap-3">
                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-black border-2 flex items-center justify-center p-3 transition-all ${finalist2 ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-zinc-800'}`}>
                                {finalist2 ? (
                                    <img src={finalist2.logo} className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-zinc-700 text-2xl md:text-3xl font-black">?</span>
                                )}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${finalist2 ? 'text-white' : 'text-zinc-600'}`}>
                                {finalist2?.name || "Winner SF2"}
                            </span>
                        </div>
                    </div>

                    {!finalMatch && !finalist1 && !finalist2 && <div className="mt-6 text-zinc-500 text-xs">Awaiting Results</div>}
                </div>
            </div>
        </div>
    );
}

function TeamBracketCard({ team, score, isWinner, align, status }: { team?: Team, score?: number, isWinner?: boolean, align: 'left' | 'right', status?: string }) {
    if (!team) return <div className="h-20 bg-zinc-900 rounded-xl animate-pulse" />;

    return (
        <div className={`
            relative flex items-center gap-4 bg-zinc-900 border rounded-xl p-4 transition-all duration-300 z-20 w-full
            ${isWinner ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-zinc-800 hover:border-zinc-700'}
        `}>
            {/* Logo */}
            <div className={`w-12 h-12 shrink-0 ${align === 'right' ? 'md:order-last' : ''}`}>
                <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
            </div>

            {/* Name & Score */}
            <div className={`flex-1 flex flex-col ${align === 'right' ? 'md:items-end md:text-right items-start text-left' : 'items-start text-left'}`}>
                <span className={`font-bold text-sm md:text-base uppercase leading-tight ${isWinner ? 'text-white' : 'text-zinc-300'}`}>
                    {team.name}
                </span>

                {status !== 'SCHEDULED' ? (
                    <span className={`text-xl md:text-2xl font-black ${isWinner ? 'text-yellow-500' : 'text-zinc-600'}`}>
                        {score}
                    </span>
                ) : (
                    <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded mt-1 uppercase tracking-wide">
                        Upcoming
                    </span>
                )}
            </div>

            {/* Winner Indicator */}
            {isWinner && (
                <div className={`absolute -top-2 ${align === 'right' ? '-right-2' : '-left-2'} bg-yellow-500 text-black text-[10px] font-black px-1.5 rounded shadow-lg`}>
                    WINNER
                </div>
            )}
        </div>
    );
}
