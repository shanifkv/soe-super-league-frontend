import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import FixtureForm from "../../components/admin/FixtureForm";

interface Match {
    id: string;
    homeTeam: { name: string; logo: string; shortName: string };
    awayTeam: { name: string; logo: string; shortName: string };
    date: any; // Firestore Timestamp
    venue: string;
    status: string;
    score: { home: number; away: number };
}

export default function AdminFixtures() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingMatch, setEditingMatch] = useState<Match | undefined>(undefined);

    useEffect(() => {
        // Determine sort based on status or date - for Admin, simple Date DESC is usually best to see latest
        // But let's do Date ASC to see upcoming
        const q = query(collection(db, "matches"), orderBy("date", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Match[];
            setMatches(data);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this match? This cannot be undone.")) {
            await deleteDoc(doc(db, "matches", id));
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp?.toDate) return "No Date";
        return timestamp.toDate().toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black italic tracking-tighter uppercase">Fixture Management</h1>
                {!isEditing && (
                    <button
                        onClick={() => {
                            setEditingMatch(undefined);
                            setIsEditing(true);
                        }}
                        className="bg-yellow-500 text-black px-4 py-2 rounded font-bold uppercase text-sm hover:bg-yellow-400"
                    >
                        + Create Fixture
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="max-w-xl mx-auto">
                    <h2 className="text-xl font-bold text-white mb-4">
                        {editingMatch ? "Edit Fixture" : "Schedule New Match"}
                    </h2>
                    <FixtureForm
                        initialData={editingMatch}
                        onSuccess={() => setIsEditing(false)}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    {matches.map((match) => (
                        <div
                            key={match.id}
                            className="bg-zinc-900/50 border border-white/10 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 hover:border-yellow-500/50 transition-colors"
                        >
                            {/* Date & Venue */}
                            <div className="text-center md:text-left min-w-[150px]">
                                <div className="text-yellow-500 font-bold text-sm uppercase">{formatDate(match.date)}</div>
                                <div className="text-zinc-500 text-xs">{match.venue}</div>
                            </div>

                            {/* Matchup */}
                            <div className="flex-1 flex items-center justify-center gap-4">
                                <div className="flex items-center gap-3 text-right">
                                    <span className="font-bold hidden md:block">{match.homeTeam?.name || "Unknown"}</span>
                                    {match.homeTeam?.logo && <img src={match.homeTeam.logo} className="w-8 h-8 object-contain" />}
                                </div>

                                <div className="bg-zinc-800 px-3 py-1 rounded font-mono font-bold text-white">
                                    {match.status === 'SCHEDULED' ? 'VS' : `${match.score?.home ?? 0} - ${match.score?.away ?? 0}`}
                                </div>

                                <div className="flex items-center gap-3 text-left">
                                    {match.awayTeam?.logo && <img src={match.awayTeam.logo} className="w-8 h-8 object-contain" />}
                                    <span className="font-bold hidden md:block">{match.awayTeam?.name || "Unknown"}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <div className={`text-[10px] items-center px-1 rounded border ${match.status === 'LIVE' ? 'border-red-500 text-red-500' : 'border-zinc-700 text-zinc-500'}`}>
                                    {match.status}
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingMatch(match);
                                        setIsEditing(true);
                                    }}
                                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded uppercase"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => match.id && handleDelete(match.id)}
                                    className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-500 px-3 py-1 rounded uppercase"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {matches.length === 0 && (
                        <div className="text-center py-10 text-zinc-500">
                            No fixtures found. Create one above!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
