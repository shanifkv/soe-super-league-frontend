import { Outlet, Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/admin/login");
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col">
                <h2 className="text-xl font-bold text-yellow-500 mb-8 tracking-wider">ADMIN PANEL</h2>

                <nav className="flex-1 space-y-2">
                    <Link to="/admin" className="block px-4 py-2 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white">Dashboard</Link>
                    <Link to="/admin/teams" className="block px-4 py-2 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white">Teams</Link>
                    <Link to="/admin/fixtures" className="block px-4 py-2 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white">Fixtures</Link>
                    <Link to="/admin/settings" className="block px-4 py-2 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white">Settings</Link>
                </nav>

                <button onClick={handleLogout} className="mt-auto text-left px-4 py-2 text-red-400 hover:text-red-300 text-sm">
                    Sign Out
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-black p-8">
                <Outlet />
            </main>
        </div>
    );
}
