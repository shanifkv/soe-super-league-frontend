import { useState, useEffect } from "react";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../../lib/firebase";

export interface Team {
    id?: string;
    name: string;
    shortName: string;
    logo: string;
    pool: "A" | "B";
}

interface TeamFormProps {
    initialData?: Team;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function TeamForm({ initialData, onSuccess, onCancel }: TeamFormProps) {
    const [formData, setFormData] = useState<Team>({
        name: "",
        shortName: "",
        logo: "",
        pool: "A",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (initialData?.id) {
                // Edit existing
                await setDoc(doc(db, "teams", initialData.id), formData);
            } else {
                // Add new (using custom ID from shortName for cleaner URLs if possible, or auto-id)
                // Let's use auto-ID for simplicity, but if shortName is unique we could use that.
                // For now, standard auto-generated ID is safer.
                await addDoc(collection(db, "teams"), formData);
            }
            onSuccess();
        } catch (error) {
            console.error("Error saving team:", error);
            alert("Failed to save team");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-900/50 p-6 rounded-lg border border-white/10">
            <div>
                <label className="block text-xs uppercase text-zinc-500 mb-1">Team Name</label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500"
                    placeholder="e.g. FC Malabaries"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase text-zinc-500 mb-1">Short Name (3 Chars)</label>
                    <input
                        type="text"
                        required
                        maxLength={3}
                        value={formData.shortName}
                        onChange={(e) => setFormData({ ...formData, shortName: e.target.value.toUpperCase() })}
                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500"
                        placeholder="e.g. FCM"
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase text-zinc-500 mb-1">Pool</label>
                    <select
                        value={formData.pool}
                        onChange={(e) => setFormData({ ...formData, pool: e.target.value as "A" | "B" })}
                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500"
                    >
                        <option value="A">Pool A</option>
                        <option value="B">Pool B</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs uppercase text-zinc-500 mb-1">Logo URL</label>
                <input
                    type="url"
                    required
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-yellow-500"
                    placeholder="https://..."
                />
                {formData.logo && (
                    <div className="mt-2 text-center p-2 bg-white/5 rounded">
                        <p className="text-xs text-zinc-500 mb-1">Preview</p>
                        <img src={formData.logo} alt="Preview" className="h-12 w-12 object-contain mx-auto" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                )}
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
                    {loading ? "Saving..." : initialData ? "Update Team" : "Create Team"}
                </button>
            </div>
        </form>
    );
}
