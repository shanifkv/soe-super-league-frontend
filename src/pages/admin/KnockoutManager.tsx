import { useEffect, useState } from "react";
import { syncDatabase, subscribeToMatches, updateMatchScore, updateMatchStatus, updateMatchDate } from "../../lib/adminService";

interface Match {
    id: string;
    homeTeam: { name: string; logo: string };
    awayTeam: { name: string; logo: string };
    score: { home: number; away: number };
    status: "SCHEDULED" | "LIVE" | "FINISHED";
    round: string;
    date: string;
}

const KNOCKOUT_ROUNDS = ["Semi Final 1", "Semi Final 2", "Final"];

// Helper to get local ISO string for datetime-local input
const toLocalISOString = (date: Date) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function KnockoutManager() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const unsubscribe = subscribeToMatches((data) => {
            const knockoutMatches = (data as Match[]).filter(m => KNOCKOUT_ROUNDS.includes(m.round));
            setMatches(knockoutMatches);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSafeSync = async () => {
        setSyncStatus("syncing");
        setErrorMessage("");
        try {
            const result = await syncDatabase();
            setSyncStatus("success");
            setTimeout(() => setSyncStatus("idle"), 2000);
            if (result && result.count === 0) {
                alert("No new missing matches found. The database is already up to date!");
            }
        } catch (error: any) {
            console.error(error);
            setSyncStatus("error");
            setErrorMessage(error.message || "Unknown error occurred");
            setTimeout(() => setSyncStatus("idle"), 5000);
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
                <div>
                    <h1 className="text-3xl font-bold text-white">Knockout Manager</h1>
                    <p className="text-zinc-400 mt-2">Manage Semi-Finals and Final</p>
                </div>

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
                            syncStatus === "error" ? `Failed: ${errorMessage}` :
                                "Scan & Add Missing Knockout Matches"}
                </button>
            </div>

            {matches.length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800 border-dashed">
                    <p className="text-zinc-400 mb-4">No knockout matches found in database.</p>
                    <button
                        onClick={handleSafeSync}
                        className="text-yellow-500 hover:text-yellow-400 font-bold underline"
                    >
                        Click here to add them now
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {matches.map(match => (
                        <div key={match.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl relative overflow-hidden">
                            {/* Decorative Background Label */}
                            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-white pointer-events-none uppercase">
                                {match.round.replace("Semi Final", "SF")}
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">

                                {/* Info / Date */}
                                <div className="flex flex-col gap-2 min-w-[200px]">
                                    <span className="text-yellow-500 font-bold uppercase tracking-widest text-sm">{match.round}</span>
                                    <input
                                        type="datetime-local"
                                        className="bg-black border border-zinc-700 rounded p-2 text-white text-sm w-full"
                                        value={match.date ? toLocalISOString(new Date(match.date)) : ""}
                                        onChange={(e) => handleDateUpdate(match.id, e.target.value)}
                                    />
                                </div>

                                {/* Score Board */}
                                <div className="flex items-center gap-6 flex-1 justify-center bg-black/40 p-4 rounded-lg border border-white/5">
                                    <div className="text-right w-32">
                                        <div className="font-bold text-white text-xl truncate">{match.homeTeam.name}</div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            className="w-16 h-16 bg-zinc-800 border-2 border-zinc-700 focus:border-yellow-600 p-0 text-center text-white text-3xl font-black rounded-lg transition-colors"
                                            value={match.score.home}
                                            onChange={(e) => handleScoreUpdate(match.id, 'home', e.target.value)}
                                        />
                                        <span className="text-zinc-600 text-2xl font-bold">-</span>
                                        <input
                                            type="number"
                                            className="w-16 h-16 bg-zinc-800 border-2 border-zinc-700 focus:border-yellow-600 p-0 text-center text-white text-3xl font-black rounded-lg transition-colors"
                                            value={match.score.away}
                                            onChange={(e) => handleScoreUpdate(match.id, 'away', e.target.value)}
                                        />
                                    </div>

                                    <div className="text-left w-32">
                                        <div className="font-bold text-white text-xl truncate">{match.awayTeam.name}</div>
                                    </div>
                                </div>

                                {/* Status Control */}
                                <div className="min-w-[150px]">
                                    <label className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1 block">Status</label>
                                    <select
                                        className={`w-full p-3 rounded font-bold text-sm ${match.status === 'LIVE' ? 'bg-red-600 text-white' :
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
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
