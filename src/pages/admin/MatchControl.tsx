import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

interface Match {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    status: "SCHEDULED" | "LIVE" | "FINISHED";
    score: { home: number; away: number };
    events: any[];
}

export default function MatchControl() {
    const { id } = useParams();
    const [match, setMatch] = useState<Match | null>(null);

    useEffect(() => {
        if (!id) return;
        const unsubscribe = onSnapshot(doc(db, "matches", id), (doc) => {
            setMatch({ id: doc.id, ...doc.data() } as Match);
        });
        return () => unsubscribe();
    }, [id]);

    const updateStatus = async (status: string) => {
        if (!id) return;
        await updateDoc(doc(db, "matches", id), { status });
    };

    const updateScore = async (team: "home" | "away", delta: number) => {
        if (!match || !id) return;
        const newScore = { ...match.score, [team]: Math.max(0, match.score[team] + delta) };

        // Add event logic could go here (e.g. log the goal automatically)
        await updateDoc(doc(db, "matches", id), { score: newScore });
    };

    if (!match) return <div className="text-white p-8">Loading match...</div>;

    return (
        <div className="max-w-4xl mx-auto text-white">
            <Link to="/admin/dashboard" className="text-zinc-500 hover:text-white mb-6 inline-block">← Back to Dashboard</Link>

            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 mb-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Match Control: <span className="text-yellow-500">{match.id}</span></h1>
                    <div className="flex gap-2">
                        <button onClick={() => updateStatus("SCHEDULED")} className={`px-4 py-2 rounded text-sm font-bold ${match.status === 'SCHEDULED' ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-500'}`}>SCHEDULED</button>
                        <button onClick={() => updateStatus("LIVE")} className={`px-4 py-2 rounded text-sm font-bold ${match.status === 'LIVE' ? 'bg-red-600 text-white animate-pulse' : 'bg-zinc-800 text-zinc-500'}`}>LIVE</button>
                        <button onClick={() => updateStatus("FINISHED")} className={`px-4 py-2 rounded text-sm font-bold ${match.status === 'FINISHED' ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-500'}`}>FINISHED</button>
                    </div>
                </div>

                {/* Scoreboard Control */}
                <div className="grid grid-cols-3 gap-8 items-center text-center">
                    {/* Home */}
                    <div className="p-6 bg-black/50 rounded-xl border border-white/5">
                        <h2 className="text-4xl font-black uppercase mb-4">{match.homeTeamId}</h2>
                        <div className="text-8xl font-mono font-bold mb-6">{match.score.home}</div>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => updateScore('home', -1)} className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xl font-bold">-</button>
                            <button onClick={() => updateScore('home', 1)} className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-500 text-xl font-bold shadow-lg shadow-green-900/20">+</button>
                        </div>
                    </div>

                    {/* VS */}
                    <div className="text-zinc-500 font-bold text-2xl">VS</div>

                    {/* Away */}
                    <div className="p-6 bg-black/50 rounded-xl border border-white/5">
                        <h2 className="text-4xl font-black uppercase mb-4">{match.awayTeamId}</h2>
                        <div className="text-8xl font-mono font-bold mb-6">{match.score.away}</div>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => updateScore('away', -1)} className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xl font-bold">-</button>
                            <button onClick={() => updateScore('away', 1)} className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-500 text-xl font-bold shadow-lg shadow-green-900/20">+</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
