import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTeams, subscribeToMatches } from "../../lib/adminService";

export default function Dashboard() {
    const [stats, setStats] = useState({ teams: 0, matches: 0, live: 0 });

    useEffect(() => {
        // Get Teams Count
        getTeams().then(teams => setStats(s => ({ ...s, teams: teams.length })));

        // Get Matches Stats
        const unsubscribe = subscribeToMatches(matches => {
            const live = matches.filter(m => m.status === 'LIVE').length;
            setStats(s => ({ ...s, matches: matches.length, live }));
        });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Teams Card */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <h3 className="text-zinc-500 text-sm uppercase tracking-wider mb-2">Total Teams</h3>
                    <p className="text-4xl font-bold">{stats.teams}</p>
                    <Link to="/admin/teams" className="text-yellow-500 text-sm mt-4 inline-block hover:underline">Manage Teams →</Link>
                </div>

                {/* Matches Card */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                    <h3 className="text-zinc-500 text-sm uppercase tracking-wider mb-2">Total Matches</h3>
                    <p className="text-4xl font-bold">{stats.matches}</p>
                    <Link to="/admin/fixtures" className="text-yellow-500 text-sm mt-4 inline-block hover:underline">Manage Fixtures →</Link>
                </div>

                {/* Live Card */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl relative overflow-hidden">
                    {stats.live > 0 && <div className="absolute top-0 right-0 p-2"><span className="flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span></div>}
                    <h3 className="text-zinc-500 text-sm uppercase tracking-wider mb-2">Live Now</h3>
                    <p className={`text-4xl font-bold ${stats.live > 0 ? 'text-red-500' : 'text-zinc-400'}`}>{stats.live}</p>
                    <Link to="/admin/fixtures" className="text-yellow-500 text-sm mt-4 inline-block hover:underline">Update Scores →</Link>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl text-center">
                <h2 className="text-xl font-bold mb-2">Quick Actions</h2>
                <p className="text-zinc-400 mb-6">Jump straight to managing the league.</p>
                <div className="flex justify-center gap-4">
                    <Link to="/admin/fixtures" className="bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors">
                        Update Scores
                    </Link>
                    <Link to="/admin/teams" className="bg-zinc-800 text-white font-bold px-6 py-3 rounded-lg hover:bg-zinc-700 transition-colors">
                        View Teams
                    </Link>
                </div>
            </div>
        </div>
    );
}
