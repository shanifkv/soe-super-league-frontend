import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import FixtureCard from "../components/FixtureCard";

type MatchStatus = 'UPCOMING' | 'LIVE' | 'FINISHED' | 'SCHEDULED';

interface Match {
    id: string;
    homeTeam: { name: string; logo: string };
    awayTeam: { name: string; logo: string };
    date: any; // Firestore Timestamp
    venue: string;
    type: string;
    status: MatchStatus;
    score: { home: number; away: number };
    minute?: string;
}

interface MatchGroup {
    matchday: string;
    dateGroup: string;
    matches: Match[];
}

export default function Fixtures() {
    const [activeTab, setActiveTab] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'RESULTS'>('ALL');
    const [matches, setMatches] = useState<Match[]>([]);
    const [groupedMatches, setGroupedMatches] = useState<MatchGroup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "matches"), orderBy("date", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Match[];
            setMatches(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Grouping Logic
    useEffect(() => {
        // Filter first
        const filtered = matches.filter(match => {
            // Map 'SCHEDULED' to 'UPCOMING' for tab logic if needed, or just treat them same
            const status = match.status === 'SCHEDULED' ? 'UPCOMING' : match.status;

            if (activeTab === 'ALL') return true;
            if (activeTab === 'LIVE') return status === 'LIVE';
            if (activeTab === 'UPCOMING') return status === 'UPCOMING';
            if (activeTab === 'RESULTS') return status === 'FINISHED';
            return true;
        });

        // Group by Date
        const groups: Record<string, Match[]> = {};

        filtered.forEach(match => {
            let dateKey = "Upcoming";
            // Safe access to toDate
            if (match.date && typeof match.date.toDate === 'function') {
                dateKey = match.date.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(match);
        });

        // Convert to array
        const result: MatchGroup[] = Object.keys(groups).map(dateKey => ({
            matchday: getMatchdayLabel(groups[dateKey]),
            dateGroup: dateKey,
            matches: groups[dateKey]
        }));

        setGroupedMatches(result);

    }, [matches, activeTab]);

    const getMatchdayLabel = (matches: Match[]) => {
        // Simple heuristic for label, could be improved
        const first = matches[0];
        if (first?.type) return first.type;
        return "Matchday";
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp || typeof timestamp.toDate !== 'function') return "TBD";
        return timestamp.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
    };

    const formatTime = (timestamp: any, status: string) => {
        if (status === 'LIVE') return "NOW";
        if (status === 'FINISHED') return "FT";
        if (!timestamp || typeof timestamp.toDate !== 'function') return "--:--";
        return timestamp.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-16 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 mb-4">
                        Season Fixtures
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base mb-8">
                        Follow the journey of your department. Live scores, results, and upcoming battles.
                    </p>

                    {/* Tabs */}
                    <div className="inline-flex p-1 bg-zinc-900 rounded-full border border-zinc-800">
                        {(['ALL', 'LIVE', 'UPCOMING', 'RESULTS'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all duration-300
                                    ${activeTab === tab
                                        ? 'bg-yellow-500 text-black shadow-lg scale-105'
                                        : 'text-zinc-500 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Match Schedule */}
                <div className="space-y-16">
                    {loading ? (
                        <div className="text-center py-20 animate-pulse">Loading fixtures...</div>
                    ) : groupedMatches.length > 0 ? (
                        groupedMatches.map((group, index) => (
                            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                                {/* Matchday Header */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-800" />
                                    <div className="text-center">
                                        <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{group.matchday}</h2>
                                        <p className="text-xs text-zinc-500 uppercase tracking-widest">{group.dateGroup}</p>
                                    </div>
                                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-800" />
                                </div>

                                {/* Matches Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                                    {group.matches.map((match: Match) => (
                                        <FixtureCard
                                            key={match.id}
                                            team1={match.homeTeam.name}
                                            team1Logo={match.homeTeam.logo}
                                            team2={match.awayTeam.name}
                                            team2Logo={match.awayTeam.logo}
                                            date={formatDate(match.date)}
                                            time={formatTime(match.date, match.status)}
                                            venue={match.venue}
                                            label={match.type}
                                            status={match.status === 'SCHEDULED' ? 'UPCOMING' : match.status as any}
                                            score1={match.score.home}
                                            score2={match.score.away}
                                            minute={match.minute}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 animate-fade-in">
                            <p className="text-zinc-500 text-lg">No matches found for this filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
