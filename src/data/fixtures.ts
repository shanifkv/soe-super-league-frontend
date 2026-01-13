
// Team Data
export const TEAMS = [
    { id: "31", name: "FC CUBA", shortName: "FCC", logo: "/logo/logo-cuba.jpg", pool: "B" },
    { id: "48", name: "FC MALABARIES", shortName: "FCM", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-007.png", pool: "A" },
    { id: "47", name: "AETOZ FC", shortName: "ATZ", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-008.png", pool: "A" },
    { id: "46", name: "CLUB DE FUMINGO", shortName: "CDF", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-002.png", pool: "A" },
    { id: "45", name: "GUNNERS FC", shortName: "GFC", logo: "/logo/gunners-fc.png", pool: "B" },
    { id: "44", name: "PALLIYANGADI FC", shortName: "PFC", logo: "/logo/palliyangadi-fc.jpg", pool: "B" },
    { id: "43", name: "DESHAM FC", shortName: "DFC", logo: "/logo/desham-fc.jpg", pool: "B" },
    { id: "42", name: "BELLARI UNITED", shortName: "BLU", logo: "/logo/bellari-united.png", pool: "A" },
    { id: "41", name: "AL QADR FC", shortName: "AQF", logo: "https://ssl-sahara.rf.gd/wp-content/uploads/2025/12/team-004.png", pool: "B" },
    { id: "30", name: "FC BAVERIA", shortName: "FCB", logo: "/logo/fc-baveria.jpg", pool: "A" },
];

const MATCH_CONFIG = [
    // Round 1
    { home: "48", away: "30", date: "2026-01-06T17:00:00", round: "Round 1", score: { home: 1, away: 2 } }, // FC Malabaris 1-2 FC Bavaria
    { home: "46", away: "42", date: "2026-01-07T16:30:00", round: "Round 1", score: { home: 1, away: 1 } }, // Club D Fumingo 1-1 Bellari United
    { home: "45", away: "43", date: "2026-01-06T17:30:00", round: "Round 1", score: { home: 3, away: 0 } }, // Gunners FC 3-0 FC Desham
    { home: "41", away: "31", date: "2026-01-07T17:00:00", round: "Round 1", score: { home: 0, away: 1 } }, // Al Qadr FC 0-1 FC Cuba

    // Round 2
    { home: "47", away: "46", date: "2026-01-12T17:00:00", round: "Round 2", score: { home: 2, away: 0 } }, // Aetoz FC 2-0 Club D Fumingo
    { home: "42", away: "48", date: "2026-01-11T17:30:00", round: "Round 2", score: { home: 1, away: 0 } }, // Bellari United 1-0 FC Malabaris
    { home: "44", away: "41", date: "2026-01-12T16:30:00", round: "Round 2", score: { home: 1, away: 0 } }, // Palliyangadi FC 1-0 Al Qadr FC
    { home: "31", away: "45", date: "2026-01-12T17:30:00", round: "Round 2", score: { home: 0, away: 1 } }, // FC Cuba 0-1 Gunners FC

    // Round 3
    { home: "30", away: "42", date: "2026-01-10T17:00:00", round: "Round 3", score: { home: 2, away: 2 } }, // FC Bavaria 2-2 Bellari United
    { home: "48", away: "47", date: "2026-01-07T17:30:00", round: "Round 3", score: { home: 0, away: 1 } }, // FC Malabaris 0-1 Aetoz FC
    { home: "43", away: "31", date: "2026-01-10T17:30:00", round: "Round 3", score: { home: 1, away: 0 } }, // FC Desham 1-0 FC Cuba
    { home: "45", away: "44", date: "2026-01-08T16:30:00", round: "Round 3", score: { home: 0, away: 1 } }, // Gunners FC 0-1 Palliyangadi FC

    // Round 4
    { home: "46", away: "48", date: "2026-01-09T17:30:00", round: "Round 4", score: { home: 2, away: 0 } }, // Club D Fumingo 2-0 FC Malabaris
    { home: "47", away: "30", date: "2026-01-11T16:30:00", round: "Round 4", score: { home: 1, away: 0 } }, // Aetoz FC 1-0 FC Bavaria
    { home: "41", away: "45", date: "2026-01-10T16:30:00", round: "Round 4", score: { home: 1, away: 1 } }, // Al Qadr FC 1-1 Gunners FC
    { home: "44", away: "43", date: "2026-01-11T17:00:00", round: "Round 4", score: { home: 1, away: 0 } }, // Palliyangadi FC 1-0 FC Desham

    // Round 5
    { home: "42", away: "47", date: "2026-01-09T16:30:00", round: "Round 5", score: { home: 1, away: 1 } }, // Bellari United 1-1 Aetoz FC
    { home: "30", away: "46", date: "2026-01-08T17:00:00", round: "Round 5", score: { home: 1, away: 1 } }, // FC Bavaria 1-1 Club D Fumingo
    { home: "31", away: "44", date: "2026-01-09T17:00:00", round: "Round 5", score: { home: 0, away: 0 } }, // FC Cuba 0-0 Palliyangadi FC
    { home: "43", away: "41", date: "2026-01-08T17:30:00", round: "Round 5", score: { home: 1, away: 1 } }, // FC Desham 1-1 Al Qadr FC

    // Semi Finals
    { home: "47", away: "45", date: "2026-01-13T17:00:00", round: "Semi Final 1" }, // Aetoz FC vs Gunners FC (13/01 5:00 PM)
    { home: "44", away: "30", date: "2026-01-13T17:30:00", round: "Semi Final 2" }, // Palliyangadi FC vs FC Bavaria (13/01 5:30 PM)
];

// Generate Full Match Objects
export const MATCHES = MATCH_CONFIG.map((m, i) => {
    const home = TEAMS.find(t => t.id === m.home);
    const away = TEAMS.find(t => t.id === m.away);

    if (!home || !away) {
        throw new Error(`Invalid team IDs in match config: ${m.home} vs ${m.away}`);
    }

    return {
        id: `m_${i + 1}`,
        homeTeam: home,
        awayTeam: away,
        homeTeamId: home.id,
        awayTeamId: away.id,
        date: m.date, // ISO String
        status: "SCHEDULED" as const,
        score: { home: 0, away: 0 },
        minute: 0,
        events: [],
        round: m.round
    };
});
