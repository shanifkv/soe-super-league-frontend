import { useEffect, useState } from "react";
import { seedDatabase, syncDatabase, subscribeToMatches, updateMatchScore, updateMatchStatus, updateMatchDate } from "../../lib/adminService";

interface Match {
    id: string;
    homeTeam: { name: string; logo: string };
    awayTeam: { name: string; logo: string };
    score: { home: number; away: number };
    status: "SCHEDULED" | "LIVE" | "FINISHED";
    round: string;
    date: string;
}

// Helper to get local ISO string for datetime-local input
const toLocalISOString = (date: Date) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function FixtureManager() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [seedStatus, setSeedStatus] = useState<"idle" | "seeding" | "success" | "error">("idle");
    const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
    const [filterRound, setFilterRound] = useState<string>("All");

    const uniqueRounds = ["All", ...Array.from(new Set(matches.map(m => m.round))).sort()];

    useEffect(() => {
        const unsubscribe = subscribeToMatches((data) => {
            setMatches(data as Match[]);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSeed = async () => {
        if (!window.confirm("This will overwrite existing data. Continue?")) return;
        setSeedStatus("seeding");
        try {
            await Promise.race([
                seedDatabase(),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000))
            ]);
            setSeedStatus("success");
            setTimeout(() => setSeedStatus("idle"), 2000);
        } catch (error: any) {
            console.error(error);
            setSeedStatus("error");
            setTimeout(() => setSeedStatus("idle"), 2000);
        }
    };

    const handleSafeSync = async () => {
        setSyncStatus("syncing");
        try {
            await syncDatabase();
            setSyncStatus("success");
            setTimeout(() => setSyncStatus("idle"), 2000);
        } catch (error) {
            console.error(error);
            setSyncStatus("error");
            setTimeout(() => setSyncStatus("idle"), 2000);
        }
    };

    const handleScoreUpdate = async (matchId: string, type: 'home' | 'away', value: string) => {
        const numValue = parseInt(value) || 0;
        const match = matches.find(m => m.id === matchId);
        if (!match) return;

        const newScore = { ...match.score, [type]: numValue };
        await updateMatchScore(matchId, newScore.home, newScore.away);
    };

    const handleStatusUpdate = async (matchId: string, status: "SCHEDULED" | "LIVE" | "FINISHED") => {
        await updateMatchStatus(matchId, status);
    };

    const handleDateUpdate = async (matchId: string, newDate: string) => {
        if (!newDate) return;
        const isoDate = new Date(newDate).toISOString();
        await updateMatchDate(matchId, isoDate);
    };

    if (loading) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Fixture Manager</h1>
                <div className="flex gap-4">
                    <button
                        onClick={handleSafeSync}
                        disabled={syncStatus === "syncing"}
                        className={`px-4 py-2 rounded font-bold text-white transition-colors border border-yellow-600 ${syncStatus === "success" ? "bg-green-600 border-green-600" :
                            syncStatus === "error" ? "bg-red-800 border-red-800" :
                                "bg-yellow-600 hover:bg-yellow-700"
                            }`}
                    >
                        {syncStatus === "syncing" ? "Syncing..." :
                            syncStatus === "success" ? "Synced!" :
                                syncStatus === "error" ? "Failed" :
                                    "Safe Sync (Add Missing)"}
                    </button>

                    <button
                        onClick={handleSeed}
                        disabled={seedStatus === "seeding"}
                        className={`px-4 py-2 rounded disabled:opacity-50 text-white transition-colors ${seedStatus === "success" ? "bg-green-600" :
                            seedStatus === "error" ? "bg-red-800" :
                                "bg-red-600 hover:bg-red-700"
                            }`}
                    >
                        {seedStatus === "seeding" ? "Seeding..." :
                            seedStatus === "success" ? "Success!" :
                                seedStatus === "error" ? "Failed" :
                                    "Reset / Seed Database"}
                    </button>
                </div>
            </div>

            <div className="mb-6 flex gap-4">
                <select
                    className="bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                    value={filterRound}
                    onChange={(e) => setFilterRound(e.target.value)}
                >
                    {uniqueRounds.map(round => (
                        <option key={round} value={round}>{round}</option>
                    ))}
                </select>
            </div>

            <div className="grid gap-6">
                {matches
                    .filter(m => filterRound === "All" || m.round === filterRound)
                    .map(match => (
                        <div key={match.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">

                            {/* Status Badge */}
                            <div className="text-xs font-mono px-2 py-1 rounded bg-zinc-800 text-zinc-400 flex flex-col items-center gap-1 min-w-[80px]">
                                <span>{match.round}</span>
                                <span className="text-zinc-500">{new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                            </div>

                            {/* Date Editor */}
                            <input
                                type="datetime-local"
                                className="bg-black border border-zinc-700 rounded p-1 text-white text-xs md:text-sm"
                                value={match.date ? toLocalISOString(new Date(match.date)) : ""}
                                onChange={(e) => handleDateUpdate(match.id, e.target.value)}
                            />

                            {/* Teams & Score */}
                            <div className="flex items-center gap-4 flex-1 justify-center">
                                <div className="text-right w-32">
                                    <div className="font-bold text-white truncate">{match.homeTeam.name}</div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        className="w-12 bg-black border border-zinc-700 p-2 text-center text-white text-lg font-bold rounded"
                                        value={match.score.home}
                                        onChange={(e) => handleScoreUpdate(match.id, 'home', e.target.value)}
                                    />
                                    <span className="text-zinc-500">-</span>
                                    <input
                                        type="number"
                                        className="w-12 bg-black border border-zinc-700 p-2 text-center text-white text-lg font-bold rounded"
                                        value={match.score.away}
                                        onChange={(e) => handleScoreUpdate(match.id, 'away', e.target.value)}
                                    />
                                </div>

                                <div className="text-left w-32">
                                    <div className="font-bold text-white truncate">{match.awayTeam.name}</div>
                                </div>
                            </div>

                            {/* Status Control */}
                            <select
                                className={`p-2 rounded font-bold text-sm ${match.status === 'LIVE' ? 'bg-red-600 text-white' :
                                    match.status === 'FINISHED' ? 'bg-zinc-700 text-zinc-300' :
                                        'bg-blue-600 text-white'
                                    }`}
                                value={match.status}
                                onChange={(e) => handleStatusUpdate(match.id, e.target.value as any)}
                            >
                                <option value="SCHEDULED">SCHEDULED</option>
                                <option value="LIVE">LIVE</option>
                                <option value="FINISHED">FINISHED</option>
                            </select>
                        </div>
                    ))
                }
            </div >
        </div >
    );
}
