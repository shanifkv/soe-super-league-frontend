import { NavLink } from "react-router-dom";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <span className="font-bold tracking-wide">
                    SOE Super League
                </span>

                <nav className="flex gap-6 text-sm">
                    {[
                        { name: "Home", to: "/" },
                        { name: "Teams", to: "/teams" },
                        { name: "Fixtures", to: "/fixtures" },
                        { name: "Standings", to: "/standings" },
                    ].map(link => (
                        <NavLink
                            key={link.name}
                            to={link.to}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-white"
                                    : "text-zinc-400 hover:text-white transition"
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}
