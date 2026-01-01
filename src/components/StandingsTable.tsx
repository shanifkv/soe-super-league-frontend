import { useNavigate } from "react-router-dom";

export interface TeamStats {
    rank: number;
    teamName: string;
    teamId: number;
    teamLogo?: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    gf: number;
    ga: number;
    gd: number;
    points: number;
    form: ('W' | 'D' | 'L')[];
}

interface StandingsTableProps {
    poolName: string;
    teams: TeamStats[];
}

export default function StandingsTable({ poolName, teams }: StandingsTableProps) {
    const navigate = useNavigate();

    return (
        <div className="w-full mb-12 animate-fade-in text-white">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 px-1">
                <span className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">{poolName}</span>
                <div className="h-[2px] flex-1 bg-white/10 rounded-full" />
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest border-b border-white/10">
                            <th className="py-3 px-2 font-bold text-center w-10">Pos</th>
                            <th className="py-3 px-2 font-bold min-w-[150px]">Club</th>
                            <th className="py-3 px-2 font-bold text-center">Pl</th>
                            <th className="py-3 px-2 font-bold text-center">W</th>
                            <th className="py-3 px-2 font-bold text-center">D</th>
                            <th className="py-3 px-2 font-bold text-center">L</th>
                            <th className="py-3 px-2 font-bold text-center hidden md:table-cell">GD</th>
                            <th className="py-3 px-2 font-bold text-center">Pts</th>
                            <th className="py-3 px-2 font-bold text-center hidden lg:table-cell">Form</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-medium">
                        {teams.map((team, index) => {
                            // Top 2 Qualify
                            const isQualifier = index < 2;

                            return (
                                <tr
                                    key={team.teamName}
                                    className="group border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/fixtures?team=${team.teamId}`)}
                                >
                                    <td className="py-3 px-2 text-center relative">
                                        {isQualifier && (
                                            <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-yellow-500 rounded-r-full" />
                                        )}
                                        <span className="text-zinc-400 group-hover:text-white transition-colors">{team.rank}</span>
                                    </td>
                                    <td className="py-3 px-2">
                                        <div className="flex items-center gap-3">
                                            {team.teamLogo ? (
                                                <img src={team.teamLogo} alt={team.teamName} className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                                            ) : (
                                                <div className="w-6 h-6 md:w-8 md:h-8 bg-zinc-800 rounded-full" />
                                            )}
                                            <span className={`text-sm md:text-base font-bold ${isQualifier ? 'text-white' : 'text-zinc-300'} group-hover:text-white`}>
                                                {team.teamName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-2 text-center text-zinc-300">{team.played}</td>
                                    <td className="py-3 px-2 text-center text-zinc-300">{team.won}</td>
                                    <td className="py-3 px-2 text-center text-zinc-300">{team.drawn}</td>
                                    <td className="py-3 px-2 text-center text-zinc-300">{team.lost}</td>
                                    <td className="py-3 px-2 text-center text-zinc-300 hidden md:table-cell">
                                        {team.gd > 0 ? `+${team.gd}` : team.gd}
                                    </td>
                                    <td className="py-3 px-2 text-center font-black text-white text-base md:text-lg">
                                        {team.points}
                                    </td>
                                    <td className="py-3 px-2 hidden lg:table-cell">
                                        <div className="flex items-center justify-center gap-1">
                                            {team.form.map((result, i) => (
                                                <span
                                                    key={i}
                                                    className={`
                                                        w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold text-white
                                                        ${result === 'W' ? 'bg-green-600' : result === 'D' ? 'bg-zinc-500' : 'bg-red-600'}
                                                    `}
                                                >
                                                    {result}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-2 flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest pl-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span>Semi-Final Qualification</span>
            </div>
        </div>
    );
}
