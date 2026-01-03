import { useEffect, useState } from "react";
import { getTeams } from "../../lib/adminService";

export default function TeamManager() {
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTeams().then(data => {
            setTeams(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="text-white">Loading teams...</div>;

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold mb-8">Team Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teams.map((team) => (
                    <div key={team.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col items-center gap-4">
                        <img src={team.logo} alt={team.name} className="w-20 h-20 object-contain" />
                        <div className="text-center">
                            <h3 className="font-bold text-lg">{team.name}</h3>
                            <p className="text-zinc-500 text-sm">{team.shortName} • Pool {team.pool}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
