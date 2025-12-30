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
// Pool A: Aetoz, Bellari, Fumingo, Baveria, Malabaries
const POOL_A: TeamStats[] = [
    { rank: 1, teamName: getName(47), teamLogo: getLogo(47), played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, form: [] },
    { rank: 2, teamName: getName(42), teamLogo: getLogo(42), played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, form: [] },
    { rank: 3, teamName: getName(46), teamLogo: getLogo(46), played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, form: [] },
    { rank: 4, teamName: getName(30), teamLogo: getLogo(30), played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, form: [] },
    { rank: 5, teamName: getName(48), teamLogo: getLogo(48), played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, form: [] },
];

// Pool B: Al Qadr, Cuba, Desham, Gunners, Palliyangadi
const POOL_B: TeamStats[] = [
    { rank: 1, teamName: getName(41), teamLogo: getLogo(41), played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, form: [] },
    { rank: 2, teamName: getName(31), teamLogo: getLogo(31), played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, form: [] },
    { rank: 3, teamName: getName(43), teamLogo: getLogo(43), played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, form: [] },
    { rank: 4, teamName: getName(45), teamLogo: getLogo(45), played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, form: [] },
    { rank: 5, teamName: getName(44), teamLogo: getLogo(44), played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, form: [] },
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
