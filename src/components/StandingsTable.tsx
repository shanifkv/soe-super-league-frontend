import { useNavigate } from "react-router-dom";

export interface TeamStats {
    rank: number;
    teamName: string;
    teamLogo?: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    gf: number;
    ga: number;
    gd: number;
    points: number;
}

interface StandingsTableProps {
    poolName: string;
    teams: TeamStats[];
}

export default function StandingsTable({ poolName, teams }: StandingsTableProps) {
    const navigate = useNavigate();

    return (
        <div className="w-full mb-12 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="h-8 w-1 bg-yellow-500 rounded-full" />
                <h2 className="text-2xl md:text-3xl font-bold text-white">{poolName}</h2>
                <div className="h-[1px] flex-1 bg-zinc-800" />
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 text-zinc-400 text-[10px] md:text-xs uppercase tracking-wider border-b border-zinc-800">
                            <th className="p-4 font-bold text-center w-12">#</th>
                            <th className="p-4 font-bold">Team</th>
                            <th className="p-4 font-bold text-center">P</th>
                            <th className="p-4 font-bold text-center">W</th>
                            <th className="p-4 font-bold text-center">D</th>
                            <th className="p-4 font-bold text-center">L</th>
                            <th className="p-4 font-bold text-center hidden md:table-cell">GF</th>
                            <th className="p-4 font-bold text-center hidden md:table-cell">GA</th>
                            <th className="p-4 font-bold text-center">GD</th>
                            <th className="p-4 font-bold text-center text-white">Pts</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {teams.map((team, index) => {
                            // Top 2 Qualify
                            const isQualifier = index < 2;

                            return (
                                <tr
                                    key={team.teamName}
                                    className={`
                                        border-b border-zinc-800/50 transition-colors
                                        ${isQualifier ? "bg-yellow-500/5 hover:bg-yellow-500/10" : "hover:bg-white/5"}
                                    `}
                                    onClick={() => navigate("/teams")}
                                >
                                    <td className="p-4 text-center font-bold text-zinc-500 relative">
                                        {isQualifier && (
                                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-yellow-500" />
                                        )}
                                        {team.rank}
                                    </td>
                                    <td className="p-4 font-bold text-white flex items-center gap-3">
                                        {team.teamLogo && (
                                            <img src={team.teamLogo} alt={team.teamName} className="w-6 h-6 object-contain" />
                                        )}
                                        <span className={isQualifier ? "text-yellow-500" : "text-zinc-200"}>
                                            {team.teamName}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-zinc-300">{team.played}</td>
                                    <td className="p-4 text-center text-zinc-400">{team.won}</td>
                                    <td className="p-4 text-center text-zinc-400">{team.drawn}</td>
                                    <td className="p-4 text-center text-zinc-400">{team.lost}</td>
                                    <td className="p-4 text-center text-zinc-500 hidden md:table-cell">{team.gf}</td>
                                    <td className="p-4 text-center text-zinc-500 hidden md:table-cell">{team.ga}</td>
                                    <td className="p-4 text-center text-zinc-300">{team.gd}</td>
                                    <td className="p-4 text-center font-black text-white text-base">
                                        {team.points}
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
