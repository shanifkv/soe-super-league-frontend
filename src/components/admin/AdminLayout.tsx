import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import soeLogo from "../../assets/soe-super-league-logo.png";
import { auth } from "../../lib/firebase";

export default function AdminLayout() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-zinc-900 border-r border-white/10 flex-shrink-0">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                    <img src={soeLogo} alt="Logo" className="w-8 h-8 invert brightness-0" />
                    <span className="font-bold tracking-wider text-sm">ADMIN PORTAL</span>
                </div>

                <nav className="p-4 space-y-1">
                    <Link to="/admin/dashboard" className="block px-4 py-3 rounded hover:bg-white/5 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                        Match Control
                    </Link>
                    <Link to="/admin/fixtures" className="block px-4 py-3 rounded hover:bg-white/5 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                        Fixtures
                    </Link>
                    <Link to="/admin/teams" className="block px-4 py-3 rounded hover:bg-white/5 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                        Teams
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10 mt-auto">
                    <div className="text-xs text-zinc-500 mb-2 px-4">Logged in as {user?.email}</div>
                    <button
                        onClick={() => auth.signOut()}
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-500/10 rounded text-sm transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
