import { doc, writeBatch, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

// Hardcoded data from our frontend components to seed the DB
const SEED_TEAMS = [
    { id: "mec", name: "Mech Bulls", shortName: "MEC", logo: "/team-logos/mech-bulls.png", group: "A", stats: { played: 3, won: 2, drawn: 1, lost: 0, gf: 5, ga: 2, points: 7 } },
    { id: "civ", name: "Civil Titans", shortName: "CIV", logo: "/team-logos/civil-titans.png", group: "A", stats: { played: 3, won: 2, drawn: 0, lost: 1, gf: 4, ga: 3, points: 6 } },
    { id: "cs", name: "CS-IT Cyber", shortName: "CS", logo: "/team-logos/cs-it-cyber.png", group: "B", stats: { played: 3, won: 3, drawn: 0, lost: 0, gf: 8, ga: 1, points: 9 } },
    { id: "eee", name: "EEE-EC Shockers", shortName: "EEE", logo: "/team-logos/eee-ec-shockers.png", group: "B", stats: { played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 4, points: 4 } },
];

const SEED_MATCHES = [
    {
        id: "m1",
        homeTeamId: "mec",
        awayTeamId: "civ",
        date: Timestamp.fromDate(new Date(Date.now() + 86400000)), // Tomorrow
        status: "SCHEDULED",
        score: { home: 0, away: 0 },
        minute: 0,
        events: []
    },
    {
        id: "m2",
        homeTeamId: "cs",
        awayTeamId: "eee",
        date: Timestamp.fromDate(new Date()), // Today (for testing Live)
        status: "SCHEDULED",
        score: { home: 0, away: 0 },
        minute: 0,
        events: []
    }
];

export const seedDatabase = async () => {
    const batch = writeBatch(db);

    // Seed Teams
    SEED_TEAMS.forEach((team) => {
        const ref = doc(db, "teams", team.id);
        batch.set(ref, team);
    });

    // Seed Matches
    SEED_MATCHES.forEach((match) => {
        const ref = doc(db, "matches", match.id);
        batch.set(ref, match);
    });

    try {
        await batch.commit();
        console.log("Database seeded successfully!");
        alert("Database seeded! Refresh the page.");
    } catch (error) {
        console.error("Error seeding database:", error);
        alert("Error seeding database. Check console.");
    }
};
