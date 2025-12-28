interface FixtureCardProps {
    team1: string;
    team1Logo?: string;
    team2: string;
    team2Logo?: string;
    date: string;
    time: string;
    venue: string;
    label?: string;
    status?: 'UPCOMING' | 'LIVE' | 'FINISHED';
    score1?: number;
    score2?: number;
    minute?: string;
}

export default function FixtureCard({
    team1, team1Logo,
    team2, team2Logo,
    date, time, venue,
    label,
    status = 'UPCOMING',
    score1, score2,
    minute
}: FixtureCardProps) {
    const isTeam1Winning = (score1 ?? 0) > (score2 ?? 0);
    const isTeam2Winning = (score2 ?? 0) > (score1 ?? 0);

    return (
        <div className="group relative flex-shrink-0 w-80 md:w-96 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-none md:rounded-lg p-0 overflow-hidden hover:bg-zinc-900/60 transition-colors duration-300">
            {/* Top Bar: League/Status */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">
                    {label || "Group Stage"}
                </span>
                {status === 'LIVE' && (
                    <span className="flex items-center gap-2 px-2 py-0.5 rounded bg-red-600/20 border border-red-600/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-red-500 tracking-wider">LIVE</span>
                    </span>
                )}
                {status === 'FINISHED' && (
                    <span className="text-[10px] font-bold text-zinc-500 tracking-wider bg-zinc-800 px-2 py-0.5 rounded">FT</span>
                )}
            </div>

            {/* Match Content */}
            <div className="p-6 flex items-center justify-between relative">
                {/* Team 1 */}
                <div className="flex flex-col items-center gap-3 flex-1">
                    <img
                        src={team1Logo}
                        alt={team1}
                        className={`w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-md transition-opacity ${status !== 'UPCOMING' && !isTeam1Winning && !isTeam2Winning ? 'opacity-80' : ''} ${status !== 'UPCOMING' && isTeam1Winning ? 'opacity-100 scale-110' : ''}`}
                    />
                    <span className={`text-xs md:text-sm text-center leading-tight ${status !== 'UPCOMING' && isTeam1Winning ? 'font-black text-white' : 'font-medium text-zinc-400'}`}>
                        {team1}
                    </span>
                </div>

                {/* Score / VS Center */}
                <div className="flex flex-col items-center px-4 w-24">
                    {status === 'UPCOMING' ? (
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xl font-bold text-zinc-500 tabular-nums">{time}</span>
                            <span className="text-[10px] text-zinc-600 uppercase tracking-wide">{date.split(' ')[0]}</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2 bg-zinc-950 px-3 py-1 rounded border border-white/10">
                                <span className={`text-2xl md:text-3xl font-mono tabular-nums leading-none ${isTeam1Winning ? 'text-yellow-500' : 'text-white'}`}>{score1 ?? 0}</span>
                                <span className="text-zinc-600 text-sm opacity-50">-</span>
                                <span className={`text-2xl md:text-3xl font-mono tabular-nums leading-none ${isTeam2Winning ? 'text-yellow-500' : 'text-white'}`}>{score2 ?? 0}</span>
                            </div>
                            {status === 'LIVE' && minute && (
                                <span className="text-xs font-mono text-green-400 font-bold tracking-widest animate-pulse">{minute}'</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Team 2 */}
                <div className="flex flex-col items-center gap-3 flex-1">
                    <img
                        src={team2Logo}
                        alt={team2}
                        className={`w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-md transition-opacity ${status !== 'UPCOMING' && !isTeam1Winning && !isTeam2Winning ? 'opacity-80' : ''} ${status !== 'UPCOMING' && isTeam2Winning ? 'opacity-100 scale-110' : ''}`}
                    />
                    <span className={`text-xs md:text-sm text-center leading-tight ${status !== 'UPCOMING' && isTeam2Winning ? 'font-black text-white' : 'font-medium text-zinc-400'}`}>
                        {team2}
                    </span>
                </div>
            </div>

            {/* Footer Venue (Upcoming Only) */}
            {status === 'UPCOMING' && (
                <div className="px-4 py-2 text-center border-t border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest">{venue}</span>
                </div>
            )}
        </div>
    );
}
