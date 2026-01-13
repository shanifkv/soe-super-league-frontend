import { useNavigate } from "react-router-dom";

export interface TeamStats {
    rank: number;
    teamName: string;
    teamId: number | string;
    teamLogo?: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    gf: number;
    ga: number;
    gd: number;
    points: number;
    form: string[];
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
                            <th className="py-3 px-1 md:px-2 font-bold text-center w-8 md:w-10">Pos</th>
                            <th className="py-3 px-1 md:px-2 font-bold min-w-[100px] md:min-w-[150px]">Club</th>
                            <th className="py-3 px-1 md:px-2 font-bold text-center">Pl</th>
                            <th className="py-3 px-1 md:px-2 font-bold text-center">W</th>
                            <th className="py-3 px-1 md:px-2 font-bold text-center">D</th>
                            <th className="py-3 px-1 md:px-2 font-bold text-center">L</th>
                            <th className="py-3 px-1 md:px-2 font-bold text-center hidden md:table-cell">GD</th>
                            <th className="py-3 px-1 md:px-2 font-bold text-center">Pts</th>
                            <th className="py-3 px-1 md:px-2 font-bold text-center">Form</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs md:text-sm font-medium">
                        {teams.map((team, index) => {
                            // Top 2 Qualify
                            const isQualifier = index < 2;

                            return (
                                <tr
                                    key={team.teamName}
                                    className="group border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer relative"
                                    onClick={() => navigate(`/fixtures?team=${team.teamId}`, { state: { from: "/standings" } })}
                                >
                                    <td className="py-2 md:py-3 px-1 md:px-2 text-center relative">
                                        {/* Qualification Indicator Line */}
                                        {isQualifier && (
                                            <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-yellow-500 rounded-r shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                                        )}

                                        <div className="flex items-center justify-center gap-2 relative pl-2">
                                            {isQualifier && (
                                                <div className="flex items-center justify-center w-4 h-4 bg-yellow-500/10 border border-yellow-500 rounded text-[9px] font-black text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                                                    Q
                                                </div>
                                            )}
                                            <span className={`transition-colors ${isQualifier ? 'text-white font-bold' : 'text-zinc-500 group-hover:text-white'}`}>
                                                {team.rank}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-2 md:py-3 px-1 md:px-2">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            {team.teamLogo ? (
                                                <img src={team.teamLogo} alt={team.teamName} className="w-5 h-5 md:w-8 md:h-8 object-contain" />
                                            ) : (
                                                <div className="w-5 h-5 md:w-8 md:h-8 bg-zinc-800 rounded-full" />
                                            )}
                                            <span className={`text-xs md:text-base font-bold uppercase tracking-tight ${isQualifier ? 'text-white' : 'text-zinc-300'} group-hover:text-white`}>
                                                {team.teamName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-2 md:py-3 px-1 md:px-2 text-center text-zinc-300">{team.played}</td>
                                    <td className="py-2 md:py-3 px-1 md:px-2 text-center text-zinc-300">{team.won}</td>
                                    <td className="py-2 md:py-3 px-1 md:px-2 text-center text-zinc-300">{team.drawn}</td>
                                    <td className="py-2 md:py-3 px-1 md:px-2 text-center text-zinc-300">{team.lost}</td>
                                    <td className="py-2 md:py-3 px-1 md:px-2 text-center text-zinc-300 hidden md:table-cell">
                                        {team.gd > 0 ? `+${team.gd}` : team.gd}
                                    </td>
                                    <td className="py-2 md:py-3 px-1 md:px-2 text-center font-black text-white text-sm md:text-lg">
                                        {team.points}
                                    </td>
                                    <td className="py-2 md:py-3 px-1 md:px-2">
                                        <div className="flex items-center justify-center gap-[2px]">
                                            {team.form.map((result, i) => (
                                                <span
                                                    key={i}
                                                    className={`
                                                        w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-[2px] text-[8px] md:text-[9px] font-black text-white uppercase
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

            <div className="mt-4 flex items-center gap-2 pl-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_5px_rgba(234,179,8,0.8)]" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Semi-Final Qualification</span>
            </div>
            <div className="mt-1 pl-4 text-[10px] text-zinc-600 font-mono">
                * Tie-breakers: GD &gt; Cards &gt; Head-to-Head &gt; Goal Scored &gt; Toss
            </div>
        </div >
    );
}
