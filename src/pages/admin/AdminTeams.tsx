import { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import TeamForm, { type Team } from "../../components/admin/TeamForm";

export default function AdminTeams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | undefined>(undefined);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "teams"), (snapshot) => {
            const teamsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Team[];
            // Sort by Name
            teamsData.sort((a, b) => a.name.localeCompare(b.name));
            setTeams(teamsData);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this team?")) {
            await deleteDoc(doc(db, "teams", id));
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black italic tracking-tighter uppercase">Team Management</h1>
                {!isEditing && (
                    <button
                        onClick={() => {
                            setEditingTeam(undefined);
                            setIsEditing(true);
                        }}
                        className="bg-yellow-500 text-black px-4 py-2 rounded font-bold uppercase text-sm hover:bg-yellow-400"
                    >
                        + Add New Team
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="max-w-xl mx-auto">
                    <h2 className="text-xl font-bold text-white mb-4">
                        {editingTeam ? "Edit Team" : "Add New Team"}
                    </h2>
                    <TeamForm
                        initialData={editingTeam}
                        onSuccess={() => setIsEditing(false)}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.map((team) => (
                        <div
                            key={team.id}
                            className="bg-zinc-900/50 border border-white/10 p-4 rounded-lg flex items-center gap-4 hover:border-yellow-500/50 transition-colors"
                        >
                            <img
                                src={team.logo}
                                alt={team.name}
                                className="w-16 h-16 object-contain"
                            />
                            <div className="flex-1">
                                <h3 className="font-bold text-white text-lg">{team.name}</h3>
                                <div className="flex gap-2 text-xs text-zinc-500">
                                    <span className="bg-zinc-800 px-2 py-0.5 rounded text-white">{team.shortName}</span>
                                    <span className="bg-zinc-800 px-2 py-0.5 rounded text-white">Pool {team.pool}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => {
                                        setEditingTeam(team);
                                        setIsEditing(true);
                                    }}
                                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded uppercase"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => team.id && handleDelete(team.id)}
                                    className="text-xs bg-red-500/20 hover:bg-red-500/40 text-red-500 px-3 py-1 rounded uppercase"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
