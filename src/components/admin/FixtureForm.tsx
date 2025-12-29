import { useState, useEffect } from "react";
import { addDoc, collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { type Team } from "./TeamForm";

// Re-using simplified Match interface for the form (local type)
interface MatchFormState {
    homeTeamId: string;
    awayTeamId: string;
    date: string; // ISO datetime string for input
    venue: string;
    type: "Group" | "Semi-Final" | "Final" | "Friendly";
    status: "SCHEDULED" | "LIVE" | "FINISHED";
}

interface FixtureFormProps {
    initialData?: any; // Using any for flexibility with Firestore Timestamp conversion
    onSuccess: () => void;
    onCancel: () => void;
}

export default function FixtureForm({ initialData, onSuccess, onCancel }: FixtureFormProps) {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<MatchFormState>({
        homeTeamId: "",
        awayTeamId: "",
        date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
        venue: "SOE Ground",
        type: "Group",
        status: "SCHEDULED"
    });

    // Fetch teams for dropdowns
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "teams"), (snap) => {
            // Filter out invalid teams before processing
            const t = snap.docs.map(d => ({ id: d.id, ...d.data() } as Team))
                .filter(team => team && team.name); // Safety Check

            console.log("FixtureForm Teams Loaded:", t);

            t.sort((a, b) => a.name.localeCompare(b.name));
            setTeams(t);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (initialData) {
            // Convert Firestore Timestamp to input string (local time safe-ish)
            let dateStr = "";
            if (initialData.date?.toDate) {
                const d = initialData.date.toDate();
                // Adjust for local timezone offset manually to fit input type="datetime-local" which expects local time
                const offset = d.getTimezoneOffset() * 60000;
                const localISOTime = new Date(d.getTime() - offset).toISOString().slice(0, 16);
                dateStr = localISOTime;
            }

            setFormData({
                homeTeamId: initialData.homeTeam?.id || "",
                awayTeamId: initialData.awayTeam?.id || "",
                date: dateStr,
                venue: initialData.venue || "SOE Ground",
                type: initialData.type || "Group",
                status: initialData.status || "SCHEDULED"
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.homeTeamId === formData.awayTeamId) {
            alert("Home and Away teams must be different");
            return;
        }
        setLoading(true);

        try {
            const homeTeam = teams.find(t => t.id === formData.homeTeamId);
            const awayTeam = teams.find(t => t.id === formData.awayTeamId);

            if (!homeTeam || !awayTeam) throw new Error("Invalid team selection");

            const payload = {
                date: new Date(formData.date), // JS Date object is handled by Firestore SDK
                homeTeam: {
                    id: homeTeam.id,
                    name: homeTeam.name,
                    shortName: homeTeam.shortName,
                    logo: homeTeam.logo
                },
                awayTeam: {
                    id: awayTeam.id,
                    name: awayTeam.name,
                    shortName: awayTeam.shortName,
                    logo: awayTeam.logo
                },
                venue: formData.venue,
                type: formData.type,
                status: formData.status,
                score: initialData?.score || { home: 0, away: 0 }, // Preserve score if editing, else 0-0
                events: initialData?.events || []
            };

            if (initialData?.id) {
                await updateDoc(doc(db, "matches", initialData.id), payload);
            } else {
                await addDoc(collection(db, "matches"), payload);
            }
            onSuccess();
        } catch (error) {
            console.error("Error saving fixture:", error);
            alert("Failed to save fixture");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-900/50 p-6 rounded-lg border border-white/10">

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase text-zinc-500 mb-1">Home Team</label>
                    <select
                        required
                        value={formData.homeTeamId}
                        onChange={(e) => setFormData({ ...formData, homeTeamId: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500"
                    >
                        <option value="">Select Team</option>
                        {teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs uppercase text-zinc-500 mb-1">Away Team</label>
                    <select
                        required
                        value={formData.awayTeamId}
                        onChange={(e) => setFormData({ ...formData, awayTeamId: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500"
                    >
                        <option value="">Select Team</option>
                        {teams.map(t => (
                            <option key={t.id} value={t.id} disabled={t.id === formData.homeTeamId}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase text-zinc-500 mb-1">Date & Time</label>
                    <input
                        type="datetime-local"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase text-zinc-500 mb-1">Venue</label>
                    <input
                        type="text"
                        required
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase text-zinc-500 mb-1">Match Type</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500"
                    >
                        <option value="Group">Group Stage</option>
                        <option value="Semi-Final">Semi-Final</option>
                        <option value="Final">Final</option>
                        <option value="Friendly">Friendly</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs uppercase text-zinc-500 mb-1">Status</label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500"
                    >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="LIVE">Live</option>
                        <option value="FINISHED">Finished</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm text-zinc-400 hover:text-white"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-yellow-500 text-black font-bold uppercase text-sm rounded hover:bg-yellow-400 disabled:opacity-50"
                >
                    {loading ? "Saving..." : initialData ? "Update Match" : "Schedule Match"}
                </button>
            </div>
        </form>
    );
}
