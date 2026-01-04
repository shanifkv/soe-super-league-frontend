import { useEffect, useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { subscribeToMatches } from "../lib/adminService";
// import { MATCHES } from "../data/fixtures"; // Removed static import

interface Team {
    id: string;
    name: string;
    logo: string;
    shortName: string;
    pool?: string;
}

interface Match {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    status: "SCHEDULED" | "LIVE" | "FINISHED";
    score: { home: number; away: number };
    date: string; // Changed from Timestamp to string (ISO)
    round: string;
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
        // Subscribe to Real-time Data
        const unsubscribe = subscribeToMatches((data) => {
            console.log("Fixtures Page Received Data:", data);

            const groupedArgs: Record<string, Match[]> = {};

            data.forEach(match => {
                const roundTitle = match.round;
                if (!groupedArgs[roundTitle]) groupedArgs[roundTitle] = [];
                groupedArgs[roundTitle].push(match);
            });

            // Convert to array and sort by round number
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

    // Effect to find selected team details from loaded matches
    useEffect(() => {
        if (!teamIdParam || rounds.length === 0) {
            setTeamDetails(null);
            return;
        }

        // Search for the team in the loaded matches
        for (const round of rounds) {
            for (const match of round.matches) {
                if (match.homeTeam.id === teamIdParam) {
                    setTeamDetails(match.homeTeam);
                    return;
                }
                if (match.awayTeam.id === teamIdParam) {
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
            match.homeTeam.id === teamIdParam ||
            match.awayTeam.id === teamIdParam
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
            {/* DEBUG BANNER - REMOVE AFTER FIX */}
            <div className="bg-red-900 border border-red-500 p-2 mb-4 text-xs font-mono text-white rounded">
                <strong>DEBUG DIAGNOSTICS:</strong><br />
                Status: {loading ? "Loading..." : "Ready"}<br />
                Matches Fetched: {rounds.reduce((acc, r) => acc + r.matches.length, 0)}<br />
                Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID || "MISSING"}<br />
                Rounds Found: {rounds.length}
                <br />
                <button
                    onClick={async () => {
                        const { debugForceFetch } = await import("../lib/adminService");
                        const result = await debugForceFetch();
                        alert(JSON.stringify(result, null, 2));
                    }}
                    className="mt-2 bg-white text-black px-2 py-1 rounded text-[10px] font-bold uppercase"
                >
                    Test Server Connection
                </button>
            </div>

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
                                        const isHome = home.id === teamIdParam;
                                        const isAway = away.id === teamIdParam;

                                        // Format Date Display
                                        const matchDate = new Date(match.date);
                                        const timeString = matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                                        const dateString = matchDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

                                        return (
                                            <div
                                                key={match.id}
                                                className={`relative border rounded-xl p-3 md:p-6 flex justify-between items-center transition-all group
                                                    ${teamIdParam && (isHome || isAway)
                                                        ? "bg-zinc-900 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                                                        : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800"
                                                    }
                                                `}
                                            >
                                                {/* Home Team */}
                                                <Link
                                                    to={`/fixtures?team=${home.id}`}
                                                    className={`flex items-center gap-2 md:gap-3 flex-1 overflow-hidden transition-all hover:opacity-80 cursor-pointer ${teamIdParam && !isHome ? "opacity-50" : "opacity-100"}`}
                                                >
                                                    <img
                                                        src={home.logo}
                                                        alt={home.name}
                                                        className="w-8 h-8 md:w-12 md:h-12 object-contain shrink-0"
                                                    />
                                                    <span className="font-bold text-zinc-100 text-xs md:text-base leading-tight w-full text-left uppercase tracking-tight group-hover/home:text-white">
                                                        {home.name}
                                                    </span>
                                                </Link>

                                                {/* VS, Score, or Time */}
                                                <div className="px-1 md:px-4 flex flex-col items-center justify-center shrink-0 min-w-[60px] md:min-w-[80px]">
                                                    {/* Pool Badge */}
                                                    {home.pool && (
                                                        <span className="text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 md:mb-2 bg-zinc-800/50 px-1.5 py-0.5 rounded border border-zinc-700/50">
                                                            Pool {home.pool}
                                                        </span>
                                                    )}

                                                    {match.status === "LIVE" || match.status === "FINISHED" ? (
                                                        <div className="flex gap-1 md:gap-2 font-mono text-lg md:text-xl font-bold text-yellow-500">
                                                            <span>{match.score.home}</span>
                                                            <span className="text-zinc-600">-</span>
                                                            <span>{match.score.away}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center text-zinc-500">
                                                            <span className="font-mono text-[10px] md:text-sm font-bold text-zinc-300 whitespace-nowrap">{timeString}</span>
                                                            <span className="text-[8px] md:text-[10px] text-zinc-600 uppercase whitespace-nowrap">{dateString}</span>
                                                        </div>
                                                    )}
                                                    {match.status === "LIVE" && <span className="text-[9px] text-red-500 font-bold animate-pulse mt-0.5">LIVE</span>}
                                                </div>

                                                {/* Away Team */}
                                                <Link
                                                    to={`/fixtures?team=${away.id}`}
                                                    className={`flex items-center gap-2 md:gap-3 flex-1 justify-end flex-row-reverse text-right overflow-hidden transition-all hover:opacity-80 cursor-pointer ${teamIdParam && !isAway ? "opacity-50" : "opacity-100"}`}
                                                >
                                                    <img
                                                        src={away.logo}
                                                        alt={away.name}
                                                        className="w-8 h-8 md:w-12 md:h-12 object-contain shrink-0"
                                                    />
                                                    <span className="font-bold text-zinc-100 text-xs md:text-base leading-tight w-full text-right uppercase tracking-tight group-hover/away:text-white">
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
