import { doc, writeBatch, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

// Real SOE Super League Teams
const SEED_TEAMS = [
    { id: "cuba", name: "FC CUBA", shortName: "FCC", logo: "/logo-cuba.jpg", group: "A", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "malabaries", name: "FC MALABARIES", shortName: "FCM", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-007.png", group: "A", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "aetoz", name: "AETOZ FC", shortName: "ATZ", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-008.png", group: "A", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "fumingo", name: "CLUB DE FUMINGO", shortName: "CDF", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-002.png", group: "B", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "gunners", name: "GUNNERS FC", shortName: "GFC", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-003.png", group: "B", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "palliyangadi", name: "PALLIYANGADI FC", shortName: "PFC", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-006.png", group: "B", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "desham", name: "DESHAM FC", shortName: "DFC", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-001.png", group: "A", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "bellari", name: "BELLARI UNITED", shortName: "BLU", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-009.png", group: "B", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "alqadr", name: "AL QADR FC", shortName: "AQF", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-004.png", group: "A", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "baveria", name: "FC BAVERIA", shortName: "FCB", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-005.jpg", group: "B", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
];

const SEED_MATCHES = [
    {
        id: "m_live_demo",
        homeTeamId: "FC MALABARIES",
        awayTeamId: "AETOZ FC",
        date: Timestamp.fromDate(new Date()), // LIVE NOW
        status: "LIVE",
        score: { home: 1, away: 0 },
        minute: 45,
        events: []
    },
    {
        id: "m_upcoming_1",
        homeTeamId: "CLUB DE FUMINGO",
        awayTeamId: "GUNNERS FC",
        date: Timestamp.fromDate(new Date(Date.now() + 3600000 * 2)), // In 2 hours
        status: "SCHEDULED",
        score: { home: 0, away: 0 },
        minute: 0,
        events: []
    },
    {
        id: "m_upcoming_2",
        homeTeamId: "PALLIYANGADI FC",
        awayTeamId: "DESHAM FC",
        date: Timestamp.fromDate(new Date(Date.now() + 86400000)), // Tomorrow
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
