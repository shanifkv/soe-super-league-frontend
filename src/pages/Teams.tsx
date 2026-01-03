import { Link } from "react-router-dom";
import { TEAMS } from "../data/fixtures";

export default function Teams() {
    // Sort teams alphabetically
    const teams = [...TEAMS].sort((a, b) => a.name.localeCompare(b.name));

    return (
        <main className="min-h-screen bg-black text-white px-6 py-16">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Teams
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {teams.map((team) => (
                    <Link
                        key={team.id}
                        to={`/fixtures?team=${team.id}`}
                        state={{ from: "/teams" }}
                        className="bg-zinc-900/50 rounded-xl p-6 flex flex-col items-center justify-center border border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900 transition-all group cursor-pointer block"
                    >
                        <div className="w-24 h-24 md:w-32 md:h-32 mb-6 flex items-center justify-center bg-zinc-800/50 rounded-2xl border border-zinc-800 p-4 shadow-xl group-hover:scale-105 group-hover:shadow-2xl group-hover:border-zinc-700 transition-all duration-300">
                            {team.logo ? (
                                <img
                                    src={team.logo}
                                    alt={team.name}
                                    className="w-full h-full object-contain drop-shadow-md"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-700 text-4xl">
                                    🛡️
                                </div>
                            )}
                        </div>

                        <p className="text-center font-bold text-sm md:text-lg tracking-wide text-zinc-300 group-hover:text-white transition-colors">
                            {team.name}
                        </p>
                    </Link>
                ))}
            </div>
        </main>
    );
}
