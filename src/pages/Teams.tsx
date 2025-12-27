import { useEffect, useState } from "react";
import { getTeams } from "../api/sportspress";

import type { Team } from "../types/sportspress";

export default function Teams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getTeams()
            .then((data) => setTeams(data))
            .catch(() => setError("Unable to load teams"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-black text-white px-6 py-10">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">
                    Teams
                </h1>

                {/* DEBUG STATE: LOADING */}
                {loading && (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-[fadeIn_0.5s_ease-out]">
                        <p className="text-4xl font-bold text-amber-500 tracking-wider">
                            FETCHING TEAMS…
                        </p>
                    </div>
                )}

                {/* DEBUG STATE: ERROR */}
                {error && (
                    <div className="flex bg-red-950/50 border-2 border-red-600 rounded-lg p-8 my-8 items-center justify-center text-center">
                        <div>
                            <h2 className="text-3xl font-black text-red-500 mb-2 uppercase">
                                API ERROR — DATA NOT REACHING UI
                            </h2>
                            <p className="text-red-200 text-lg mono">
                                Check CORS / Network / Proxy
                            </p>
                        </div>
                    </div>
                )}

                {/* DEBUG STATE: EMPTY */}
                {!loading && !error && teams.length === 0 && (
                    <div className="flex bg-zinc-900 border-2 border-zinc-700 rounded-lg p-8 my-8 items-center justify-center text-center">
                        <div>
                            <h2 className="text-3xl font-bold text-zinc-400 mb-2 uppercase">
                                NO TEAMS RECEIVED
                            </h2>
                            <p className="text-zinc-500 text-lg">
                                API reachable, but returned empty data
                            </p>
                        </div>
                    </div>
                )}

                {/* SUCCESS STATE */}
                {!loading && !error && teams.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {teams.map((team) => (
                            <div
                                key={team.id}
                                className="bg-zinc-900 rounded-xl p-6 text-center border border-zinc-800 flex flex-col items-center gap-4 hover:border-zinc-700 transition-colors"
                            >
                                <div className="h-24 w-24 flex items-center justify-center p-2 bg-black/20 rounded-full">
                                    {team._embedded?.["wp:featuredmedia"]?.[0]
                                        ?.source_url ? (
                                        <img
                                            src={
                                                team._embedded[
                                                    "wp:featuredmedia"
                                                ][0].source_url
                                            }
                                            alt={team.title.rendered}
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-4xl text-zinc-700">
                                            🛡️
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-semibold text-zinc-100">
                                    {team.title.rendered}
                                </h3>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
