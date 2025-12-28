import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import soeLogo from "../../assets/soe-super-league-logo.png";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/admin/dashboard");
        } catch (err: any) {
            setError("Invalid credentials. Access denied.");
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 -z-10" />

            <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <img src={soeLogo} alt="Logo" className="w-16 h-16 object-contain mb-4 invert brightness-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                    <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Match Control</h1>
                    <p className="text-zinc-500 text-sm mt-2">Authorized Personnel Only</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                            placeholder="official@soe.league"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold uppercase tracking-widest py-3 rounded transition-all hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] mt-4"
                    >
                        Access Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
}
