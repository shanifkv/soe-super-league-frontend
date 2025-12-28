import { useState } from "react";
import FixtureCard from "../components/FixtureCard";
import { mockTeams } from "../mock/teams";

// Helper to get logo URL
const getLogo = (teamName: string) => {
    const team = mockTeams.find(t => t.title.rendered === teamName);
    return team?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
};

type MatchStatus = 'UPCOMING' | 'LIVE' | 'FINISHED';

interface Match {
    id: number;
    team1: string;
    team2: string;
    date: string;
    time: string;
    venue: string;
    label?: string;
    status: MatchStatus;
    score1?: number;
    score2?: number;
    minute?: string;
}

// Sample Data Structure
const SCHEDULE = [
    {
        matchday: "Live & Recent",
        dateGroup: "Today",
        matches: [
            { id: 999, team1: "FC MALABARIES", team2: "AETOZ FC", date: "TODAY", time: "NOW", venue: "Main Turf", label: "Pool A", status: "LIVE" as MatchStatus, score1: 2, score2: 1, minute: "72" },
            { id: 998, team1: "CLUB DE FUMINGO", team2: "GUNNERS FC", date: "YESTERDAY", time: "FT", venue: "Main Turf", label: "Pool A", status: "FINISHED" as MatchStatus, score1: 1, score2: 3 },
        ]
    },
    {
        matchday: "Matchday 1",
        dateGroup: "Oct 15 - Oct 17",
        matches: [
            { id: 101, team1: "FC MALABARIES", team2: "AETOZ FC", date: "OCT 15", time: "16:30", venue: "Main Turf", label: "Pool A", status: "UPCOMING" as MatchStatus },
            { id: 102, team1: "CLUB DE FUMINGO", team2: "GUNNERS FC", date: "OCT 16", time: "16:30", venue: "Main Turf", label: "Pool A", status: "UPCOMING" as MatchStatus },
            { id: 103, team1: "PALLIYANGADI FC", team2: "DESHAM FC", date: "OCT 17", time: "16:30", venue: "Training Ground", label: "Pool A", status: "UPCOMING" as MatchStatus },
        ]
    },
    {
        matchday: "Matchday 2",
        dateGroup: "Oct 20 - Oct 22",
        matches: [
            { id: 201, team1: "BELLARI UNITED", team2: "AL QADR FC", date: "OCT 20", time: "16:30", venue: "Main Turf", label: "Pool B", status: "UPCOMING" as MatchStatus },
            { id: 202, team1: "FC CUBA", team2: "FC BAVERIA", date: "OCT 21", time: "16:30", venue: "Main Turf", label: "Pool B", status: "UPCOMING" as MatchStatus },
            { id: 203, team1: "FC MALABARIES", team2: "CLUB DE FUMINGO", date: "OCT 22", time: "16:30", venue: "Training Ground", label: "Pool A", status: "UPCOMING" as MatchStatus },
        ]
    },
    {
        matchday: "Matchday 3",
        dateGroup: "Oct 24 - Oct 26",
        matches: [
            { id: 301, team1: "AETOZ FC", team2: "GUNNERS FC", date: "OCT 24", time: "16:30", venue: "Main Turf", label: "Pool A", status: "UPCOMING" as MatchStatus },
            { id: 302, team1: "PALLIYANGADI FC", team2: "BELLARI UNITED", date: "OCT 24", time: "17:45", venue: "Main Turf", label: "Inter-Pool", status: "UPCOMING" as MatchStatus },
            { id: 303, team1: "DESHAM FC", team2: "AL QADR FC", date: "OCT 25", time: "16:30", venue: "Training Ground", label: "Pool B", status: "UPCOMING" as MatchStatus },
            { id: 304, team1: "FC CUBA", team2: "FC MALABARIES", date: "OCT 26", time: "16:30", venue: "Main Turf", label: "Inter-Pool", status: "UPCOMING" as MatchStatus },
        ]
    },
    {
        matchday: "Semi Finals",
        dateGroup: "Nov 05",
        matches: [
            { id: 401, team1: "TBD", team2: "TBD", date: "NOV 05", time: "16:00", venue: "Main Turf", label: "Semi Final 1", status: "UPCOMING" as MatchStatus },
            { id: 402, team1: "TBD", team2: "TBD", date: "NOV 05", time: "19:00", venue: "Main Turf", label: "Semi Final 2", status: "UPCOMING" as MatchStatus },
        ]
    }
];

export default function Fixtures() {
    const [activeTab, setActiveTab] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'RESULTS'>('ALL');

    const filteredSchedule = SCHEDULE.map(group => {
        const matches = group.matches.filter(match => {
            if (activeTab === 'ALL') return true;
            if (activeTab === 'LIVE') return match.status === 'LIVE';
            if (activeTab === 'UPCOMING') return match.status === 'UPCOMING';
            if (activeTab === 'RESULTS') return match.status === 'FINISHED';
            return true;
        });
        return { ...group, matches };
    }).filter(group => group.matches.length > 0);

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
                    {filteredSchedule.length > 0 ? (
                        filteredSchedule.map((group, index) => (
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
                                            team1={match.team1}
                                            team1Logo={getLogo(match.team1)}
                                            team2={match.team2}
                                            team2Logo={getLogo(match.team2)}
                                            date={match.date}
                                            time={match.time}
                                            venue={match.venue}
                                            label={match.label}
                                            status={match.status}
                                            score1={match.score1}
                                            score2={match.score2}
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
