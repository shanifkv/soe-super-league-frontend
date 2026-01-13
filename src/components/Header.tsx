import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import saharaLogo from "../assets/sahara-community-logo.png";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isMenuOpen]);

    const navLinks = [
        { name: "Home", to: "/" },
        { name: "Teams", to: "/teams" },
        { name: "Fixtures", to: "/fixtures" },
        { name: "Standings", to: "/standings" },
        { name: "Finals", to: "/knockout" },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/95 via-black/80 to-transparent py-4 md:py-6 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-50">
                <NavLink
                    to="/"
                    className="flex items-center hover:opacity-80 transition-opacity duration-300 group"
                >
                    <img
                        src={saharaLogo}
                        alt="Sahara Community"
                        className="h-12 md:h-20 lg:h-24 w-auto object-contain brightness-0 invert drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] hover:scale-105 transition-transform duration-300"
                    />
                </NavLink>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2 z-50 relative"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                        <span className={`block w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                        <span className={`block w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
                        <span className={`block w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                    </div>
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-8 text-sm font-medium">
                    {navLinks.map(link => (
                        <NavLink
                            key={link.name}
                            to={link.to}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-white relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-white"
                                    : "text-zinc-400 hover:text-white transition-colors hover:scale-105 transform duration-200"
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Mobile Navigation Overlay */}
            <div
                className={`fixed inset-0 bg-black/95 backdrop-blur-xl z-40 md:hidden flex flex-col items-center justify-center transition-all duration-500 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            >
                <nav className="flex flex-col items-center gap-8 text-2xl font-black uppercase tracking-widest">
                    {navLinks.map((link, i) => (
                        <NavLink
                            key={link.name}
                            to={link.to}
                            className={({ isActive }) =>
                                `transition-all duration-500 transform ${isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${isActive ? "text-yellow-500" : "text-zinc-500 hover:text-white"
                                }`
                            }
                            style={{ transitionDelay: `${i * 100}ms` }}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}
