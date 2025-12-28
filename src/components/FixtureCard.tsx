interface FixtureCardProps {
    team1: string;
    team1Logo?: string;
    team2: string;
    team2Logo?: string;
    date: string;
    time: string;
    venue: string;
    label?: string;
}

export default function FixtureCard({ team1, team1Logo, team2, team2Logo, date, time, venue, label }: FixtureCardProps) {
    return (
        <div className="group relative flex-shrink-0 w-80 md:w-96 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] cursor-default overflow-hidden">
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 flex flex-col items-center">
                {/* League/Match Info */}
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 mb-6 font-medium">
                    {label || "Group Stage • Matchday"}
                </div>

                {/* Teams Layout */}
                <div className="flex items-center justify-between w-full mb-8">
                    {/* Team 1 */}
                    <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center shadow-lg group-hover:border-white/20 transition-colors overflow-hidden p-2">
                            {team1Logo ? (
                                <img src={team1Logo} alt={team1} className="w-full h-full object-contain drop-shadow-md" />
                            ) : (
                                <span className="text-sm md:text-lg font-bold text-zinc-400">{team1.substring(0, 2)}</span>
                            )}
                        </div>
                        <span className="text-xs md:text-sm font-bold text-zinc-300 text-center leading-tight">{team1}</span>
                    </div>

                    {/* VS */}
                    <div className="flex flex-col items-center px-4">
                        <span className="text-xs md:text-sm font-black text-yellow-500 tracking-wider">VS</span>
                    </div>

                    {/* Team 2 */}
                    <div className="flex flex-col items-center gap-3 flex-1">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center shadow-lg group-hover:border-white/20 transition-colors overflow-hidden p-2">
                            {team2Logo ? (
                                <img src={team2Logo} alt={team2} className="w-full h-full object-contain drop-shadow-md" />
                            ) : (
                                <span className="text-sm md:text-lg font-bold text-zinc-400">{team2.substring(0, 2)}</span>
                            )}
                        </div>
                        <span className="text-xs md:text-sm font-bold text-zinc-300 text-center leading-tight">{team2}</span>
                    </div>
                </div>

                {/* Separator */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

                {/* Date & Time */}
                <div className="flex flex-col items-center gap-1">
                    <div className="text-sm md:text-base font-bold text-white tracking-wide">
                        {date}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span>{time}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                        <span>{venue}</span>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button className="text-[10px] uppercase tracking-widest text-yellow-500 hover:text-white transition-colors">
                        Match Details →
                    </button>
                </div>
            </div>
        </div>
    );
}
