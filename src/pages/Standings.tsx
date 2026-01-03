import { useEffect, useState } from "react";
import StandingsTable, { type TeamStats } from "../components/StandingsTable";
import { subscribeToMatches } from "../lib/adminService";
import { calculateStandings } from "../lib/standingsUtils";

export default function Standings() {
    const [standings, setStandings] = useState<{ "Pool A": TeamStats[], "Pool B": TeamStats[] }>({
        "Pool A": [],
        "Pool B": []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToMatches((matches) => {
            const calculated = calculateStandings(matches);
            setStandings(calculated);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-zinc-500 animate-pulse">Updating League Table...</div>
            </div>
        );
    }

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
                    <StandingsTable poolName="Pool A" teams={standings["Pool A"]} />
                    <StandingsTable poolName="Pool B" teams={standings["Pool B"]} />
                </div>
            </div>
        </main>
    );
}
