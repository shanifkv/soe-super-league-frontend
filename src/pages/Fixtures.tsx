import { Link, useSearchParams } from "react-router-dom";
import { teams } from "../data/teams";

type TeamId = 48 | 30 | 46 | 42 | 45 | 43 | 41 | 31 | 47 | 44;

interface FixtureMatch {
    home: TeamId;
    away: TeamId;
}

interface WebRound {
    title: string;
    matches: FixtureMatch[];
}

// Helper to get team details
const getTeam = (id: number) => {
    const team = teams.find(t => t.id === id);
    return {
        name: team?.title.rendered || "Unknown Team",
        logo: team?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || ""
    };
};

/**
 * REAL FIXTURES DATA - SSL Season 7
 */
const FIXTURES: WebRound[] = [
    {
        title: "Round 1",
        matches: [
            { home: 48, away: 30 }, // FC Malabaris vs FC Bavaria
            { home: 46, away: 42 }, // Club D Fumingo vs Bellari United
            { home: 45, away: 43 }, // Gunners FC vs FC Desham
            { home: 41, away: 31 }, // Al Qadr FC vs FC Cuba
        ]
    },
    {
        title: "Round 2",
        matches: [
            { home: 47, away: 46 }, // Aetoz FC vs Club D Fumingo
            { home: 42, away: 48 }, // Bellari United vs FC Malabaris
            { home: 44, away: 41 }, // Palliyangadi FC vs Al Qadr FC
            { home: 31, away: 45 }, // FC Cuba vs Gunners FC
        ]
    },
    {
        title: "Round 3",
        matches: [
            { home: 30, away: 42 }, // FC Bavaria vs Bellari United
            { home: 48, away: 47 }, // FC Malabaris vs Aetoz FC
            { home: 43, away: 31 }, // FC Desham vs FC Cuba
            { home: 45, away: 44 }, // Gunners FC vs Palliyangadi FC
        ]
    },
    {
        title: "Round 4",
        matches: [
            { home: 46, away: 48 }, // Club D Fumingo vs FC Malabaris
            { home: 47, away: 30 }, // Aetoz FC vs FC Bavaria
            { home: 41, away: 45 }, // Al Qadr FC vs Gunners FC
            { home: 44, away: 43 }, // Palliyangadi FC vs FC Desham
        ]
    },
    {
        title: "Round 5",
        matches: [
            { home: 42, away: 47 }, // Bellari United vs Aetoz FC
            { home: 30, away: 46 }, // FC Bavaria vs Club D Fumingo
            { home: 31, away: 44 }, // FC Cuba vs Palliyangadi FC
            { home: 43, away: 41 }, // FC Desham vs Al Qadr FC
        ]
    }
];

export default function Fixtures() {
    const [searchParams] = useSearchParams();
    const teamIdParam = searchParams.get("team");
    const teamId = teamIdParam ? Number(teamIdParam) : null;

    const selectedTeam = teamId ? getTeam(teamId) : null;

    // Filter fixtures based on valid teamId
    const filteredFixtures = FIXTURES.map(round => ({
        ...round,
        matches: round.matches.filter(match =>
            !teamId || match.home === teamId || match.away === teamId
        )
    })).filter(round => round.matches.length > 0);

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
                    {teamId && selectedTeam && (
                        <div className="inline-flex items-center gap-4 bg-zinc-900/50 border border-zinc-700 rounded-full px-6 py-2 shadow-lg animate-fade-in-up">
                            <span className="text-zinc-400 text-sm">Showing fixtures for:</span>
                            <div className="flex items-center gap-2">
                                <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-6 h-6 object-contain" />
                                <span className="font-bold text-white">{selectedTeam.name}</span>
                            </div>
                            <Link
                                to="/fixtures"
                                className="ml-2 p-1 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                                title="Clear filter"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Back Button if filtered */}
                {teamId && (
                    <div className="mb-6 max-w-4xl mx-auto">
                        <Link to="/fixtures" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                            Back to all fixtures
                        </Link>
                    </div>
                )}

                {/* Fixtures List */}
                <div className="space-y-16">
                    {filteredFixtures.length > 0 ? (
                        filteredFixtures.map((round, index) => (
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
                                <div className={teamId ? "flex flex-col gap-6 max-w-2xl mx-auto" : "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"}>
                                    {round.matches.map((match, mIndex) => {
                                        const home = getTeam(match.home);
                                        const away = getTeam(match.away);
                                        const isHome = match.home === teamId;
                                        const isAway = match.away === teamId;

                                        return (
                                            <div
                                                key={mIndex}
                                                className={`relative border rounded-xl p-4 md:p-6 flex justify-between items-center transition-all group
                                                    ${teamId && (isHome || isAway)
                                                        ? "bg-zinc-900 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                                                        : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800"
                                                    }
                                                `}
                                            >
                                                {/* Pool Label */}
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-zinc-700 uppercase tracking-wider">
                                                    {[48, 30, 46, 42, 47].includes(match.home) ? "Pool A" : "Pool B"}
                                                </div>

                                                {/* Home Team */}
                                                <Link
                                                    to={`/fixtures?team=${match.home}`}
                                                    className={`flex items-center gap-3 flex-1 overflow-hidden transition-all hover:opacity-80 cursor-pointer ${teamId && !isHome ? "opacity-50" : "opacity-100"}`}
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

                                                {/* VS */}
                                                <div className="px-2 md:px-4 text-zinc-600 font-mono text-xs md:text-sm font-bold shrink-0 mt-2">VS</div>

                                                {/* Away Team */}
                                                <Link
                                                    to={`/fixtures?team=${match.away}`}
                                                    className={`flex items-center gap-3 flex-1 justify-end flex-row-reverse text-right overflow-hidden transition-all hover:opacity-80 cursor-pointer ${teamId && !isAway ? "opacity-50" : "opacity-100"}`}
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
                            <p className="text-zinc-500 text-lg">No fixtures found for this team.</p>
                            <Link to="/fixtures" className="text-yellow-500 hover:text-yellow-400 text-sm mt-2 inline-block">View all fixtures</Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
