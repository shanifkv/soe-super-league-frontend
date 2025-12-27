import { NavLink } from "react-router-dom";
import saharaLogo from "../assets/sahara-community-logo.png";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/90 to-transparent py-4 md:py-6 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <NavLink
                    to="/"
                    className="flex items-center hover:opacity-80 transition-opacity duration-300 group"
                >
                    <img
                        src={saharaLogo}
                        alt="Sahara Community"
                        className="h-14 md:h-20 w-auto object-contain brightness-0 invert"
                    />
                </NavLink>

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
