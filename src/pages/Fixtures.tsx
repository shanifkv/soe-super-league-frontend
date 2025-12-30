import { mockTeams } from "../mock/teams";

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
    const team = mockTeams.find(t => t.id === id);
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
    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-16 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 mb-4">
                        SSL Season 7
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
                        Official fixtures list. The road to glory starts here.
                    </p>
                </div>

                {/* Fixtures List */}
                <div className="space-y-16">
                    {FIXTURES.map((round, index) => (
                        <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                            {/* Round Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-800" />
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-white tracking-wider">{round.title}</h2>
                                </div>
                                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-800" />
                            </div>

                            {/* Matches Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                {round.matches.map((match, mIndex) => {
                                    const home = getTeam(match.home);
                                    const away = getTeam(match.away);

                                    return (
                                        <div
                                            key={mIndex}
                                            className="relative bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 md:p-6 flex justify-between items-center hover:bg-zinc-800 transition-colors group"
                                        >
                                            {/* Pool Label */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-zinc-700 uppercase tracking-wider">
                                                {[48, 30, 46, 42, 47].includes(match.home) ? "Pool A" : "Pool B"}
                                            </div>

                                            {/* Home Team */}
                                            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                                <img
                                                    src={home.logo}
                                                    alt={home.name}
                                                    className="w-10 h-10 md:w-12 md:h-12 object-contain shrink-0"
                                                />
                                                <span className="font-bold text-zinc-100 text-sm md:text-base leading-tight w-full text-left break-words">
                                                    {home.name}
                                                </span>
                                            </div>

                                            {/* VS */}
                                            <div className="px-2 md:px-4 text-zinc-600 font-mono text-xs md:text-sm font-bold shrink-0 mt-2">VS</div>

                                            {/* Away Team */}
                                            <div className="flex items-center gap-3 flex-1 justify-end flex-row-reverse text-right overflow-hidden">
                                                <img
                                                    src={away.logo}
                                                    alt={away.name}
                                                    className="w-10 h-10 md:w-12 md:h-12 object-contain shrink-0"
                                                />
                                                <span className="font-bold text-zinc-100 text-sm md:text-base leading-tight w-full text-right break-words">
                                                    {away.name}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
