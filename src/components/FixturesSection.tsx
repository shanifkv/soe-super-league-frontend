import FixtureCard from "./FixtureCard";
import { teams } from "../data/teams";

// Helper to get logo URL
const getLogo = (teamName: string) => {
    const team = teams.find(t => t.title.rendered === teamName);
    return team?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
};

const SAMPLE_MATCHES = [
    {
        id: 1,
        team1: "FC MALABARIES",
        team2: "AETOZ FC",
        date: "OCT 15",
        time: "16:30",
        venue: "Main Turf"
    },
    {
        id: 2,
        team1: "CLUB DE FUMINGO",
        team2: "GUNNERS FC",
        date: "OCT 16",
        time: "16:30",
        venue: "Main Turf"
    },
    {
        id: 3,
        team1: "PALLIYANGADI FC",
        team2: "DESHAM FC",
        date: "OCT 17",
        time: "16:30",
        venue: "Training Ground"
    },
    {
        id: 4,
        team1: "BELLARI UNITED",
        team2: "AL QADR FC",
        date: "OCT 20",
        time: "16:30",
        venue: "Main Turf"
    },
    {
        id: 5,
        team1: "FC CUBA",
        team2: "FC BAVERIA",
        date: "OCT 21",
        time: "17:00",
        venue: "Main Turf"
    }
];

export default function FixturesSection() {
    return (
        <section className="relative z-20 py-16 md:py-24 bg-black">
            {/* Section Header */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-600 mb-2">
                            Matchday
                        </h2>
                        <p className="text-zinc-500 font-medium tracking-widest text-sm uppercase">
                            Upcoming Battles
                        </p>
                    </div>

                    <a href="/fixtures" className="hidden md:flex items-center gap-2 text-sm font-bold text-yellow-500 hover:text-white transition-colors group">
                        <span className="uppercase tracking-widest">Full Schedule</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Scrolling Cards */}
            <div className="w-full overflow-x-auto pb-12 px-6 no-scrollbar">
                <div className="flex gap-6 w-max mx-auto md:mx-0 md:pl-[calc((100vw-80rem)/2+1.5rem)]">
                    {SAMPLE_MATCHES.map((match) => (
                        <FixtureCard
                            key={match.id}
                            team1={match.team1}
                            team1Logo={getLogo(match.team1)}
                            team2={match.team2}
                            team2Logo={getLogo(match.team2)}
                            date={match.date}
                            time={match.time}
                            venue={match.venue}
                        />
                    ))}

                    {/* View All Card (Mobile friendly) */}
                    <a href="/fixtures" className="flex-shrink-0 w-40 flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group md:hidden text-center p-4">
                        <span className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                        <span className="text-xs font-bold text-zinc-400 group-hover:text-white uppercase tracking-widest">
                            View All Matches
                        </span>
                    </a>
                </div>
            </div>

            {/* Visual bottom fade for smooth transition to footer later */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>
    );
}
