import { useEffect, useState } from "react";
import { getPredictions, type Prediction } from "../../lib/adminService";

export default function Predictions() {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadPredictions();
    }, []);

    const loadPredictions = async () => {
        try {
            const data = await getPredictions();
            setPredictions(data);
        } catch (err: any) {
            console.error(err);
            setError("Failed to load predictions. Ensure the table exists in Supabase.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-zinc-500 animate-pulse">Loading predictions...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Prediction Submissions</h1>
                <div className="text-zinc-500 text-sm">Total: {predictions.length}</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-800/50 text-zinc-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium border-b border-zinc-700">Student Name</th>
                                <th className="p-4 font-medium border-b border-zinc-700">Contact</th>
                                <th className="p-4 font-medium border-b border-zinc-700">Dept / Year</th>
                                <th className="p-4 font-medium border-b border-zinc-700 text-center">SF1 Prediction</th>
                                <th className="p-4 font-medium border-b border-zinc-700 text-center">SF2 Prediction</th>
                                <th className="p-4 font-medium border-b border-zinc-700 text-right">Submitted At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {predictions.map((pred) => (
                                <tr key={pred.id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="p-4 font-bold text-white">{pred.student_name}</td>
                                    <td className="p-4 text-zinc-300 font-mono text-sm">{pred.phone_number}</td>
                                    <td className="p-4 text-zinc-300">
                                        <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs font-bold mr-2 text-yellow-500">{pred.department}</span>
                                        <span className="text-zinc-500 text-xs">Year {pred.year}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="inline-flex items-center gap-2 bg-black px-3 py-1 rounded-lg border border-zinc-800">
                                            <span className="font-mono font-bold text-yellow-500">{pred.sf1_score_home}</span>
                                            <span className="text-zinc-600">:</span>
                                            <span className="font-mono font-bold text-yellow-500">{pred.sf1_score_away}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="inline-flex items-center gap-2 bg-black px-3 py-1 rounded-lg border border-zinc-800">
                                            <span className="font-mono font-bold text-yellow-500">{pred.sf2_score_home}</span>
                                            <span className="text-zinc-600">:</span>
                                            <span className="font-mono font-bold text-yellow-500">{pred.sf2_score_away}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right text-zinc-500 text-sm font-mono">
                                        {pred.created_at ? new Date(pred.created_at).toLocaleString() : '-'}
                                    </td>
                                </tr>
                            ))}
                            {predictions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-zinc-500 italic">No predictions submitted yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
