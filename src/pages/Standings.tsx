import StandingsTable, { type TeamStats } from "../components/StandingsTable";
import { mockTeams } from "../mock/teams";

// Helper to get logo URL
const getLogo = (id: number) => {
    const team = mockTeams.find(t => t.id === id);
    return team?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
};

// Helper to get team name
const getName = (id: number) => {
    const team = mockTeams.find(t => t.id === id);
    return team?.title.rendered || "Team";
};

// Mock Data for Standings
// Pool A: Teams 48, 47, 46, 45, 44
const POOL_A: TeamStats[] = [
    { rank: 1, teamName: getName(48), teamLogo: getLogo(48), played: 3, won: 2, drawn: 1, lost: 0, gf: 7, ga: 2, gd: 5, points: 7 },
    { rank: 2, teamName: getName(47), teamLogo: getLogo(47), played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 3, gd: 2, points: 6 },
    { rank: 3, teamName: getName(46), teamLogo: getLogo(46), played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 4, gd: 0, points: 4 },
    { rank: 4, teamName: getName(45), teamLogo: getLogo(45), played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 5, gd: -3, points: 3 },
    { rank: 5, teamName: getName(44), teamLogo: getLogo(44), played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 5, gd: -4, points: 0 },
];

// Pool B: Teams 43, 42, 41, 31, 30
const POOL_B: TeamStats[] = [
    { rank: 1, teamName: getName(43), teamLogo: getLogo(43), played: 3, won: 3, drawn: 0, lost: 0, gf: 9, ga: 1, gd: 8, points: 9 },
    { rank: 2, teamName: getName(42), teamLogo: getLogo(42), played: 3, won: 2, drawn: 0, lost: 1, gf: 6, ga: 4, gd: 2, points: 6 },
    { rank: 3, teamName: getName(41), teamLogo: getLogo(41), played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 3, gd: 0, points: 4 },
    { rank: 4, teamName: getName(31), teamLogo: getLogo(31), played: 3, won: 0, drawn: 1, lost: 2, gf: 2, ga: 6, gd: -4, points: 1 },
    { rank: 5, teamName: getName(30), teamLogo: getLogo(30), played: 3, won: 0, drawn: 0, lost: 3, gf: 0, ga: 6, gd: -6, points: 0 },
];

export default function Standings() {
    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-16 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 mb-4">
                        Standings
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
                        The battle for the top spot. The top 2 teams from each pool qualify for the Semi-Finals.
                    </p>
                </div>

                {/* Pools Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    <StandingsTable poolName="Pool A" teams={POOL_A} />
                    <StandingsTable poolName="Pool B" teams={POOL_B} />
                </div>
            </div>
        </main>
    );
}
