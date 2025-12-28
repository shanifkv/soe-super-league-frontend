import FixtureCard from "../components/FixtureCard";
import { mockTeams } from "../mock/teams";

// Helper to get logo URL
const getLogo = (teamName: string) => {
    const team = mockTeams.find(t => t.title.rendered === teamName);
    return team?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
};

// Sample Data Structure
const SCHEDULE = [
    {
        matchday: "Matchday 1",
        dateGroup: "Oct 15 - Oct 17",
        matches: [
            { id: 101, team1: "FC MALABARIES", team2: "AETOZ FC", date: "OCT 15", time: "16:30", venue: "Main Turf", label: "Pool A" },
            { id: 102, team1: "CLUB DE FUMINGO", team2: "GUNNERS FC", date: "OCT 16", time: "16:30", venue: "Main Turf", label: "Pool A" },
            { id: 103, team1: "PALLIYANGADI FC", team2: "DESHAM FC", date: "OCT 17", time: "16:30", venue: "Training Ground", label: "Pool A" },
        ]
    },
    {
        matchday: "Matchday 2",
        dateGroup: "Oct 20 - Oct 22",
        matches: [
            { id: 201, team1: "BELLARI UNITED", team2: "AL QADR FC", date: "OCT 20", time: "16:30", venue: "Main Turf", label: "Pool B" },
            { id: 202, team1: "FC CUBA", team2: "FC BAVERIA", date: "OCT 21", time: "16:30", venue: "Main Turf", label: "Pool B" },
            { id: 203, team1: "FC MALABARIES", team2: "CLUB DE FUMINGO", date: "OCT 22", time: "16:30", venue: "Training Ground", label: "Pool A" },
        ]
    },
    {
        matchday: "Matchday 3",
        dateGroup: "Oct 24 - Oct 26",
        matches: [
            { id: 301, team1: "AETOZ FC", team2: "GUNNERS FC", date: "OCT 24", time: "16:30", venue: "Main Turf", label: "Pool A" },
            { id: 302, team1: "PALLIYANGADI FC", team2: "BELLARI UNITED", date: "OCT 24", time: "17:45", venue: "Main Turf", label: "Inter-Pool" },
            { id: 303, team1: "DESHAM FC", team2: "AL QADR FC", date: "OCT 25", time: "16:30", venue: "Training Ground", label: "Pool B" },
            { id: 304, team1: "FC CUBA", team2: "FC MALABARIES", date: "OCT 26", time: "16:30", venue: "Main Turf", label: "Inter-Pool" },
        ]
    },
    {
        matchday: "Semi Finals",
        dateGroup: "Nov 05",
        matches: [
            { id: 401, team1: "TBD", team2: "TBD", date: "NOV 05", time: "16:00", venue: "Main Turf", label: "Semi Final 1" },
            { id: 402, team1: "TBD", team2: "TBD", date: "NOV 05", time: "19:00", venue: "Main Turf", label: "Semi Final 2" },
        ]
    }
];

export default function Fixtures() {
    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-16 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 mb-4">
                        Season Fixtures
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
                        Follow the journey of your department. Every match counts in the race for the SOE Super League trophy.
                    </p>
                </div>

                {/* Match Schedule */}
                <div className="space-y-16">
                    {SCHEDULE.map((group, index) => (
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
                                {group.matches.map((match) => (
                                    <FixtureCard
                                        key={match.id}
                                        team1={match.team1}
                                        team1Logo={getLogo(match.team1)}
                                        team2={match.team2}
                                        team2Logo={getLogo(match.team2)}
                                        date={match.date}
                                        time={match.time}
                                        venue={match.venue}
                                        label={match.label}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
