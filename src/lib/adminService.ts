import { collection, doc, updateDoc, onSnapshot, query, orderBy, getDocs, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import { TEAMS, MATCHES } from "../data/fixtures";

export const COLLECTIONS = {
    TEAMS: "teams",
    MATCHES: "matches"
};

// --- DATA SEEDING ---
export const seedDatabase = async () => {
    try {
        const batch = writeBatch(db);

        // Seed Teams
        console.log("Seeding Teams...");
        TEAMS.forEach(team => {
            const teamRef = doc(db, COLLECTIONS.TEAMS, team.id);
            batch.set(teamRef, team);
        });

        // Seed Matches
        console.log("Seeding Matches...");
        MATCHES.forEach(match => {
            const matchRef = doc(db, COLLECTIONS.MATCHES, match.id);
            // Ensure date is string
            const matchData = {
                ...match,
                date: typeof match.date === 'string' ? match.date : new Date(match.date).toISOString()
            };
            batch.set(matchRef, matchData);
        });

        await batch.commit();
        console.log("Database Seeded Successfully!");
        return true;
    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    }
};

// --- READ OPERATIONS ---
export const subscribeToMatches = (callback: (matches: any[]) => void) => {
    // REMOVED orderBy("date", "asc") to rely on client-side sorting (fixes potential index issues)
    const q = query(collection(db, COLLECTIONS.MATCHES));
    return onSnapshot(q, (snapshot) => {
        const matches = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        callback(matches);
    }, (error) => {
        console.error("CRITICAL FIREBASE ERROR:", error);
    });
};

export const getTeams = async () => {
    const snapshot = await getDocs(collection(db, COLLECTIONS.TEAMS));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- WRITE OPERATIONS ---
export const updateMatchScore = async (matchId: string, home: number, away: number, status?: "LIVE" | "FINISHED" | "SCHEDULED") => {
    const matchRef = doc(db, COLLECTIONS.MATCHES, matchId);
    const data: any = {
        score: { home, away }
    };
    if (status) data.status = status;

    await updateDoc(matchRef, data);
};

export const updateMatchStatus = async (matchId: string, status: "LIVE" | "FINISHED" | "SCHEDULED") => {
    const matchRef = doc(db, COLLECTIONS.MATCHES, matchId);
    await updateDoc(matchRef, { status });
};

export const updateMatchDate = async (matchId: string, date: string) => {
    const matchRef = doc(db, COLLECTIONS.MATCHES, matchId);
    await updateDoc(matchRef, { date });
};
