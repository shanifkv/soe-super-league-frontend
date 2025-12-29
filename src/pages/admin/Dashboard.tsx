import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, Timestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Link } from "react-router-dom";
import { seedDatabase } from "../../lib/seed";

interface Match {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    status: "SCHEDULED" | "LIVE" | "FINISHED";
    score: { home: number; away: number };
    date: Timestamp;
}

export default function Dashboard() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to matches collection
        const q = query(collection(db, "matches"), orderBy("date", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Match));
            setMatches(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="max-w-4xl mx-auto text-white">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                    Match Control Center
                </h1>
                {/* Helper for first-time setup */}
                <button
                    onClick={seedDatabase}
                    className="text-xs text-zinc-500 hover:text-white underline"
                >
                    Seed Database (Dev Only)
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-zinc-500 animate-pulse">Loading Matches...</div>
            ) : (
                <div className="space-y-6">
                    {matches.map((match) => (
                        <div
                            key={match.id}
                            className={`relative overflow-hidden group bg-zinc-900 border ${match.status === "LIVE" ? "border-red-500/50 shadow-red-900/20" : "border-white/10"
                                } rounded-xl p-6 transition-all hover:bg-zinc-800`}
                        >
                            {match.status === "LIVE" && (
                                <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl animate-pulse">
                                    LIVE
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                {/* Teams */}
                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-2xl font-black uppercase text-white tracking-tight">{match.homeTeamId}</span>
                                        {match.status !== 'SCHEDULED' && <span className="text-4xl font-mono text-yellow-500">{match.score.home}</span>}
                                    </div>
                                    <span className="text-zinc-500 text-sm font-bold">VS</span>
                                    <div className="flex flex-col gap-1 text-right">
                                        <span className="text-2xl font-black uppercase text-white tracking-tight">{match.awayTeamId}</span>
                                        {match.status !== 'SCHEDULED' && <span className="text-4xl font-mono text-yellow-500">{match.score.away}</span>}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex gap-2 mb-2">
                                        {/* Quick Actions (Requested by User) - Only for Live Matches */}
                                        {match.status === 'LIVE' && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        const newScore = { ...match.score, home: match.score.home + 1 };
                                                        updateDoc(doc(db, "matches", match.id), { score: newScore });
                                                    }}
                                                    className="px-2 py-1 bg-zinc-800 text-white text-xs rounded hover:bg-zinc-700"
                                                >
                                                    +1 Home
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const newScore = { ...match.score, away: match.score.away + 1 };
                                                        updateDoc(doc(db, "matches", match.id), { score: newScore });
                                                    }}
                                                    className="px-2 py-1 bg-zinc-800 text-white text-xs rounded hover:bg-zinc-700"
                                                >
                                                    +1 Away
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right mr-4">
                                            <div className="text-xs uppercase text-zinc-500 tracking-wider">Status</div>
                                            <div className={`font-bold ${match.status === "LIVE" ? "text-red-500" : "text-white"}`}>
                                                {match.status}
                                            </div>
                                        </div>

                                        <Link
                                            to={`/admin/match/${match.id}`}
                                            className="bg-white text-black font-bold uppercase tracking-wider px-6 py-3 rounded hover:bg-yellow-400 transition-colors"
                                        >
                                            {match.status === "LIVE" ? "Manage Live" : "Open Console"}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {matches.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
                            <p className="text-zinc-500 mb-4">No matches found in database.</p>
                            <button
                                onClick={seedDatabase}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                            >
                                Click here to Seed Data
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
