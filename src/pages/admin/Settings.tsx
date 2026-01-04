
import { useState } from "react";
import { seedDatabase } from "../../lib/adminService";

export default function Settings() {
    const [seedStatus, setSeedStatus] = useState<"idle" | "seeding" | "success" | "error">("idle");

    const handleSeed = async () => {
        if (!window.confirm("WARNING: This will overwrite the entire database with local data. Are you sure?")) return;

        setSeedStatus("seeding");
        try {
            await seedDatabase();
            setSeedStatus("success");
            alert("Database seeded successfully!");
        } catch (error: any) {
            console.error(error);
            setSeedStatus("error");
            alert("Error seeding database: " + error.message);
        } finally {
            if (seedStatus !== "error") {
                setTimeout(() => setSeedStatus("idle"), 3000);
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-8">System Settings</h1>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Database Management</h2>
                <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg mb-6">
                    <p className="text-red-400 text-sm">
                        <strong>Danger Zone:</strong> Actions here can cause data loss. Proceed with caution.
                    </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-black rounded-lg border border-zinc-800">
                    <div>
                        <h3 className="font-bold text-white">Seed Database</h3>
                        <p className="text-zinc-500 text-sm">Reset database with initial data from code.</p>
                    </div>
                    <button
                        onClick={handleSeed}
                        disabled={seedStatus === "seeding"}
                        className={`px-4 py-2 rounded font-bold transition-colors ${seedStatus === "seeding" ? "bg-zinc-700 text-zinc-400 cursor-wait" :
                                seedStatus === "success" ? "bg-green-600 text-white" :
                                    "bg-red-600 hover:bg-red-700 text-white"
                            }`}
                    >
                        {seedStatus === "seeding" ? "Seeding..." :
                            seedStatus === "success" ? "Done!" : "Execute Seed"}
                    </button>
                </div>
            </div>
        </div>
    );
}
