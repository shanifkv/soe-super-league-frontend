
import { supabase } from "./supabase";
import { TEAMS, MATCHES } from "../data/fixtures";
import { managers } from "../data/Managers/manager";

export const COLLECTIONS = {
    TEAMS: "teams",
    MATCHES: "matches",
    MANAGERS: "managers"
};

// --- DATA SEEDING ---
export const seedDatabase = async () => {
    try {
        console.log("Seeding Teams...");
        const { error: teamError } = await supabase.from(COLLECTIONS.TEAMS).upsert(TEAMS);
        if (teamError) throw teamError;

        console.log("Seeding Managers...");
        // Convert numeric teamId to string to match Teams table
        const managersData = managers.map(m => ({
            ...m,
            teamId: m.teamId ? String(m.teamId) : null
        }));
        const { error: managerError } = await supabase.from(COLLECTIONS.MANAGERS).upsert(managersData);
        if (managerError) throw managerError;

        console.log("Seeding Matches...");
        const matchesData = MATCHES.map(match => ({
            ...match,
            date: typeof match.date === 'string' ? match.date : new Date(match.date).toISOString()
        }));

        const { error: matchError } = await supabase.from(COLLECTIONS.MATCHES).upsert(matchesData);
        if (matchError) throw matchError;

        console.log("Database Seeded Successfully!");
        return true;
    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    }
};

// --- READ OPERATIONS ---
export const subscribeToMatches = (callback: (matches: any[]) => void, onError?: (error: any) => void) => {
    console.log("Starting Subscription to 'matches'...");

    // Initial Fetch
    supabase.from('matches').select('*').then(({ data, error }) => {
        if (error) {
            console.error("Initial Fetch Error:", error);
            if (onError) onError(error);
        } else if (data) {
            const sortedMatches = data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
            callback(sortedMatches);
        }
    });

    // Realtime Subscription
    const channel = supabase.channel('public:matches')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'matches' },
            (payload) => {
                console.log('Change received!', payload);
                // Re-fetch all matches on any change to ensure consistency (simplest approach)
                // Optimization: Update local state based on payload
                supabase.from('matches').select('*').then(({ data }) => {
                    if (data) {
                        const sortedMatches = data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        callback(sortedMatches);
                    }
                });
            }
        )
        .subscribe((status) => {
            console.log("Subscription status:", status);
            if (status === 'SUBSCRIBED') {
                // ok
            }
            if (status === 'CHANNEL_ERROR') {
                if (onError) onError("Channel Error");
            }
        });

    return () => {
        supabase.removeChannel(channel);
    };
};

export const getTeams = async () => {
    const { data, error } = await supabase.from(COLLECTIONS.TEAMS).select('*');
    if (error) throw error;
    return data;
};

// --- WRITE OPERATIONS ---
export const updateMatchScore = async (matchId: string, home: number, away: number, status?: "LIVE" | "FINISHED" | "SCHEDULED") => {
    const updates: any = {
        score: { home, away }
    };
    if (status) updates.status = status;

    const { error } = await supabase.from(COLLECTIONS.MATCHES).update(updates).eq('id', matchId);
    if (error) throw error;
};

export const updateMatchStatus = async (matchId: string, status: "LIVE" | "FINISHED" | "SCHEDULED") => {
    const { error } = await supabase.from(COLLECTIONS.MATCHES).update({ status }).eq('id', matchId);
    if (error) throw error;
};

export const updateMatchDate = async (matchId: string, date: string) => {
    const { error } = await supabase.from(COLLECTIONS.MATCHES).update({ date }).eq('id', matchId);
    if (error) throw error;
};
