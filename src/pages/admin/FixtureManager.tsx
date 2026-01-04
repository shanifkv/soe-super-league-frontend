import { useEffect, useState } from "react";
import { seedDatabase, subscribeToMatches, updateMatchScore, updateMatchStatus, updateMatchDate } from "../../lib/adminService";

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
            await seedDatabase();
            setSeedStatus("success");
            setTimeout(() => setSeedStatus("idle"), 2000);
        } catch (error) {
            console.error(error);
            setSeedStatus("error");
            setTimeout(() => setSeedStatus("idle"), 2000);
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

    // New handler for date updates
    const handleDateUpdate = async (matchId: string, newDate: string) => {
        if (!newDate) return;
        // Input gives local time "2026-01-06T17:00", new Date() converts to local date object, .toISOString() converts to UTC.
        // This is correct for saving to Firestore which stores strings or timestamps usually in UTC/ISO.
        const isoDate = new Date(newDate).toISOString();
        await updateMatchDate(matchId, isoDate);
    };

    if (loading) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Fixture Manager</h1>
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

            <div className="grid gap-6">
                {matches.map(match => (
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
