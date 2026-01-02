import { useEffect, useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

interface Team {
    id: string;
    name: string;
    logo: string;
    shortName: string;
}

interface Match {
    id: string;
    homeTeam?: Team;
    awayTeam?: Team;
    homeTeamId: string;
    awayTeamId: string;
    status: "SCHEDULED" | "LIVE" | "FINISHED";
    score: { home: number; away: number };
    date: Timestamp;
    round?: string;
}

interface WebRound {
    title: string;
    matches: Match[];
}

export default function Fixtures() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const teamIdParam = searchParams.get("team");

    // State for data
    const [rounds, setRounds] = useState<WebRound[]>([]);
    const [loading, setLoading] = useState(true);
    const [teamDetails, setTeamDetails] = useState<Team | null>(null);

    const backLink = location.state?.from || "/fixtures";
    const backLabel = location.state?.from === "/teams" ? "Back to Teams" : location.state?.from === "/standings" ? "Back to Standings" : "Back to all fixtures";

    useEffect(() => {
        // Subscribe to matches
        const q = query(collection(db, "matches"), orderBy("date", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const matches = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));

            // Group by Round
            const groupedArgs: Record<string, Match[]> = {};
            matches.forEach(match => {
                const roundTitle = match.round || "Unscheduled";
                if (!groupedArgs[roundTitle]) groupedArgs[roundTitle] = [];
                groupedArgs[roundTitle].push(match);
            });

            // Convert to array and sort by round number (assuming "Round X" format)
            const roundsArray = Object.entries(groupedArgs).map(([title, matches]) => ({
                title,
                matches
            })).sort((a, b) => {
                const numA = parseInt(a.title.replace(/\D/g, '')) || 999;
                const numB = parseInt(b.title.replace(/\D/g, '')) || 999;
                return numA - numB;
            });

            setRounds(roundsArray);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Effect to find selected team details from loaded matches (since we don't have a direct team cache here yet)
    useEffect(() => {
        if (!teamIdParam || rounds.length === 0) {
            setTeamDetails(null);
            return;
        }

        // Search for the team in the loaded matches
        for (const round of rounds) {
            for (const match of round.matches) {
                if (match.homeTeam?.id === teamIdParam) {
                    setTeamDetails(match.homeTeam);
                    return;
                }
                if (match.awayTeam?.id === teamIdParam) {
                    setTeamDetails(match.awayTeam);
                    return;
                }
            }
        }
    }, [teamIdParam, rounds]);

    // Filter rounds based on selected team
    const filteredRounds = rounds.map(round => ({
        ...round,
        matches: round.matches.filter(match =>
            !teamIdParam ||
            match.homeTeam?.id === teamIdParam ||
            match.awayTeam?.id === teamIdParam
        )
    })).filter(round => round.matches.length > 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-zinc-500 animate-pulse">Loading Season Data...</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-16 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 mb-4">
                        SSL Season 7
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base mb-6">
                        Official fixtures list. The road to glory starts here.
                    </p>

                    {/* Active Filter Indicator */}
                    {teamIdParam && teamDetails && (
                        <div className="inline-flex items-center gap-4 bg-zinc-900/50 border border-zinc-700 rounded-full px-6 py-2 shadow-lg animate-fade-in-up">
                            <span className="text-zinc-400 text-sm">Showing fixtures for:</span>
                            <div className="flex items-center gap-2">
                                <img src={teamDetails.logo} alt={teamDetails.name} className="w-6 h-6 object-contain" />
                                <span className="font-bold text-white">{teamDetails.name}</span>
                            </div>
                            <Link
                                to={backLink}
                                className="ml-2 p-1 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                                title="Clear filter"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Back Button if filtered */}
                {teamIdParam && (
                    <div className="mb-6 max-w-4xl mx-auto">
                        <Link to={backLink} className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                            {backLabel}
                        </Link>
                    </div>
                )}

                {/* Fixtures List */}
                <div className="space-y-16">
                    {filteredRounds.length > 0 ? (
                        filteredRounds.map((round, index) => (
                            <div key={index} className="animate-fade-in relative" style={{ animationDelay: `${index * 100}ms` }}>
                                {/* Round Header */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-800" />
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-white tracking-wider">{round.title}</h2>
                                    </div>
                                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-800" />
                                </div>

                                {/* Matches Grid */}
                                <div className={teamIdParam ? "flex flex-col gap-6 max-w-2xl mx-auto" : "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"}>
                                    {round.matches.map((match) => {
                                        const home = match.homeTeam;
                                        const away = match.awayTeam;

                                        // Fallback if data is missing
                                        if (!home || !away) return null;

                                        const isHome = home.id === teamIdParam;
                                        const isAway = away.id === teamIdParam;

                                        return (
                                            <div
                                                key={match.id}
                                                className={`relative border rounded-xl p-4 md:p-6 flex justify-between items-center transition-all group
                                                    ${teamIdParam && (isHome || isAway)
                                                        ? "bg-zinc-900 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                                                        : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800"
                                                    }
                                                `}
                                            >
                                                {/* Pool Label - TODO: Add Pool to Team Object if needed, for now logic based on ID is removed or needs DB support */}
                                                {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-zinc-700 uppercase tracking-wider">
                                                    Pool A
                                                </div> */}

                                                {/* Home Team */}
                                                <Link
                                                    to={`/fixtures?team=${home.id}`}
                                                    className={`flex items-center gap-3 flex-1 overflow-hidden transition-all hover:opacity-80 cursor-pointer ${teamIdParam && !isHome ? "opacity-50" : "opacity-100"}`}
                                                >
                                                    <img
                                                        src={home.logo}
                                                        alt={home.name}
                                                        className="w-10 h-10 md:w-12 md:h-12 object-contain shrink-0"
                                                    />
                                                    <span className="font-bold text-zinc-100 text-sm md:text-base leading-tight w-full text-left break-words group-hover/home:text-white">
                                                        {home.name}
                                                    </span>
                                                </Link>

                                                {/* VS or Score */}
                                                <div className="px-2 md:px-4 flex flex-col items-center justify-center shrink-0 mt-2">
                                                    {match.status === "LIVE" || match.status === "FINISHED" ? (
                                                        <div className="flex gap-2 font-mono text-xl font-bold text-yellow-500">
                                                            <span>{match.score.home}</span>
                                                            <span className="text-zinc-600">-</span>
                                                            <span>{match.score.away}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-zinc-600 font-mono text-xs md:text-sm font-bold">VS</span>
                                                    )}
                                                    {match.status === "LIVE" && <span className="text-[10px] text-red-500 font-bold animate-pulse">LIVE</span>}
                                                </div>

                                                {/* Away Team */}
                                                <Link
                                                    to={`/fixtures?team=${away.id}`}
                                                    className={`flex items-center gap-3 flex-1 justify-end flex-row-reverse text-right overflow-hidden transition-all hover:opacity-80 cursor-pointer ${teamIdParam && !isAway ? "opacity-50" : "opacity-100"}`}
                                                >
                                                    <img
                                                        src={away.logo}
                                                        alt={away.name}
                                                        className="w-10 h-10 md:w-12 md:h-12 object-contain shrink-0"
                                                    />
                                                    <span className="font-bold text-zinc-100 text-sm md:text-base leading-tight w-full text-right break-words group-hover/away:text-white">
                                                        {away.name}
                                                    </span>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
                            <p className="text-zinc-500 text-lg">No fixtures found.</p>
                            <Link to="/fixtures" className="text-yellow-500 hover:text-yellow-400 text-sm mt-2 inline-block">View all fixtures</Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
