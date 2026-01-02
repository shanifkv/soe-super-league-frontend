import { doc, writeBatch, Timestamp, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { managers } from "../data/Managers/manager";


// Real SOE Super League Teams
const SEED_TEAMS = [
    { id: "31", name: "FC CUBA", shortName: "FCC", logo: "/logo/logo-cuba.jpg", pool: "A", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "48", name: "FC MALABARIES", shortName: "FCM", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-007.png", pool: "A", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "47", name: "AETOZ FC", shortName: "ATZ", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-008.png", pool: "A", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "46", name: "CLUB DE FUMINGO", shortName: "CDF", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-002.png", pool: "B", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "45", name: "GUNNERS FC", shortName: "GFC", logo: "/logo/gunners-fc.png", pool: "B", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "44", name: "PALLIYANGADI FC", shortName: "PFC", logo: "/logo/palliyangadi-fc.jpg", pool: "B", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "43", name: "DESHAM FC", shortName: "DFC", logo: "/logo/desham-fc.jpg", pool: "A", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "42", name: "BELLARI UNITED", shortName: "BLU", logo: "/logo/bellari-united.png", pool: "B", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "41", name: "AL QADR FC", shortName: "AQF", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-004.png", pool: "A", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
    { id: "30", name: "FC BAVERIA", shortName: "FCB", logo: "/logo/fc-baveria.jpg", pool: "B", stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 } },
];

const MATCH_CONFIG = [
    // Round 1
    { home: "48", away: "30", date: "2026-01-05T16:00:00", round: "Round 1" },
    { home: "46", away: "42", date: "2026-01-05T17:00:00", round: "Round 1" },
    { home: "45", away: "43", date: "2026-01-06T16:00:00", round: "Round 1" },
    { home: "41", away: "31", date: "2026-01-06T17:00:00", round: "Round 1" },
    // Round 2
    { home: "47", away: "46", date: "2026-01-07T16:00:00", round: "Round 2" },
    { home: "42", away: "48", date: "2026-01-07T17:00:00", round: "Round 2" },
    { home: "44", away: "41", date: "2026-01-08T16:00:00", round: "Round 2" },
    { home: "31", away: "45", date: "2026-01-08T17:00:00", round: "Round 2" },
    // Round 3
    { home: "30", away: "42", date: "2026-01-09T16:00:00", round: "Round 3" },
    { home: "48", away: "47", date: "2026-01-09T17:00:00", round: "Round 3" },
    { home: "43", away: "31", date: "2026-01-10T16:00:00", round: "Round 3" },
    { home: "45", away: "44", date: "2026-01-10T17:00:00", round: "Round 3" },
    // Round 4
    { home: "46", away: "48", date: "2026-01-11T16:00:00", round: "Round 4" },
    { home: "47", away: "30", date: "2026-01-11T17:00:00", round: "Round 4" },
    { home: "41", away: "45", date: "2026-01-12T16:00:00", round: "Round 4" },
    { home: "44", away: "43", date: "2026-01-12T17:00:00", round: "Round 4" },
    // Round 5
    { home: "42", away: "47", date: "2026-01-13T16:00:00", round: "Round 5" },
    { home: "30", away: "46", date: "2026-01-13T17:00:00", round: "Round 5" },
    { home: "31", away: "44", date: "2026-01-14T16:00:00", round: "Round 5" },
    { home: "43", away: "41", date: "2026-01-14T17:00:00", round: "Round 5" },
];

const SEED_MATCHES = MATCH_CONFIG.map((m, i) => {
    const home = SEED_TEAMS.find(t => t.id === m.home);
    const away = SEED_TEAMS.find(t => t.id === m.away);

    if (!home || !away) {
        console.error(`Invalid team IDs in match config: ${m.home} vs ${m.away}`);
        // Return a dummy placeholder to avoid crashing, but this shouldn't happen if IDs match
        return {
            id: `m_${i + 1}`,
            date: Timestamp.fromDate(new Date(m.date)),
            status: "SCHEDULED" as const, // Cast to literal type
            score: { home: 0, away: 0 },
            minute: 0,
            events: [],
            homeTeam: { id: "unknown", name: "Unknown", shortName: "UNK", logo: "" },
            awayTeam: { id: "unknown", name: "Unknown", shortName: "UNK", logo: "" },
            homeTeamId: "Unknown",
            awayTeamId: "Unknown",
            round: m.round
        };
    }

    return {
        id: `m_${i + 1}`,
        homeTeam: { id: home.id, name: home.name, shortName: home.shortName, logo: home.logo },
        awayTeam: { id: away.id, name: away.name, shortName: away.shortName, logo: away.logo },
        homeTeamId: home.name, // Legacy
        awayTeamId: away.name, // Legacy
        date: Timestamp.fromDate(new Date(m.date)),
        status: "SCHEDULED" as const,
        score: { home: 0, away: 0 },
        minute: 0,
        events: [],
        round: m.round
    };
});

export const seedDatabase = async () => {
    const batch = writeBatch(db);

    const LEGACY_IDS = [
        "cuba", "malabaries", "aetoz", "fumingo", "gunners",
        "palliyangadi", "desham", "bellari", "alqadr", "baveria",
        "IKzwN0Dsne0Q2HZNxQ1R", "tI9TfUY20IJPPwNEDtx3"
    ];

    // Cleanup Legacy Teams
    console.log("Cleaning up legacy team data...");
    for (const id of LEGACY_IDS) {
        try {
            await deleteDoc(doc(db, "teams", id));
            console.log(`Deleted legacy team: ${id}`);
        } catch (e) {
            console.warn(`Could not delete ${id} (might not exist)`);
        }
    }

    // Cleanup All Matches (Start Fresh)
    console.log("Cleaning up all matches...");
    const matchesSnapshot = await getDocs(collection(db, "matches"));
    for (const doc of matchesSnapshot.docs) {
        await deleteDoc(doc.ref);
    }
    console.log(`Deleted ${matchesSnapshot.size} matches.`);

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

    // Seed Managers
    managers.forEach((manager) => {
        const ref = doc(db, "managers", manager.id);
        batch.set(ref, manager);
    });
    console.log(`Prepared ${managers.length} managers for seeding.`);


    try {
        await batch.commit();
        console.log("Database seeded successfully!");
        alert("Database seeded! Refresh the page.");
    } catch (error: any) {
        console.error("Error seeding database:", error);
        alert(`Error seeding database: ${error.message}`);
    }
};
