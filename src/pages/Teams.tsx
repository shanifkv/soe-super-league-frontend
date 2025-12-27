import { useEffect, useState } from "react";
import { getTeams } from "../api/sportspress";
import { mockTeams } from "../mock/teams";

import type { Team } from "../types/sportspress";

export default function Teams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // ✅ DEV MODE: Use Local Snapshot
        if (import.meta.env.DEV) {
            setTeams(mockTeams as unknown as Team[]);
            setLoading(false);
            return;
        }

        // ✅ PROD MODE: Real API
        getTeams()
            .then(setTeams)
            .catch(() => setError("Unable to load teams"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-zinc-400">
                Loading teams…
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white px-6 py-16">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Teams
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {teams.map((team) => {
                    const logoSrc =
                        team._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

                    return (
                        <div
                            key={team.id}
                            className="bg-zinc-900 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-zinc-800 transition"
                        >
                            <div className="w-24 h-24 mb-4 flex items-center justify-center">
                                {logoSrc ? (
                                    <img
                                        src={logoSrc}
                                        alt={team.title.rendered}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-3xl">
                                        🛡️
                                    </div>
                                )}
                            </div>

                            <p className="text-center font-semibold text-sm md:text-base">
                                {team.title.rendered}
                            </p>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
