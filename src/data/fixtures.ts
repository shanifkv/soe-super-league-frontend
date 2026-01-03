
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
    { home: "48", away: "30", date: "2026-01-06T17:00:00", round: "Round 1" }, // FC Malabaris vs FC Bavaria (06/01 5:00 PM)
    { home: "46", away: "42", date: "2026-01-07T16:30:00", round: "Round 1" }, // Club D Fumingo vs Bellari United (07/01 4:30 PM)
    { home: "45", away: "43", date: "2026-01-06T17:30:00", round: "Round 1" }, // Gunners FC vs FC Desham (06/01 5:30 PM)
    { home: "41", away: "31", date: "2026-01-07T17:00:00", round: "Round 1" }, // Al Qadr FC vs FC Cuba (07/01 5:00 PM)

    // Round 2
    { home: "47", away: "46", date: "2026-01-12T17:00:00", round: "Round 2" }, // Aetoz FC vs Club D Fumingo (12/01 5:00 PM)
    { home: "42", away: "48", date: "2026-01-11T17:30:00", round: "Round 2" }, // Bellari United vs FC Malabaris (11/01 5:30 PM)
    { home: "44", away: "41", date: "2026-01-12T16:30:00", round: "Round 2" }, // Palliyangadi FC vs Al Qadr FC (12/01 4:30 PM)
    { home: "31", away: "45", date: "2026-01-12T17:30:00", round: "Round 2" }, // FC Cuba vs Gunners FC (12/01 5:30 PM)

    // Round 3
    { home: "30", away: "42", date: "2026-01-10T17:00:00", round: "Round 3" }, // FC Bavaria vs Bellari United (10/01 5:00 PM)
    { home: "48", away: "47", date: "2026-01-07T17:30:00", round: "Round 3" }, // FC Malabaris vs Aetoz FC (07/01 5:30 PM)
    { home: "43", away: "31", date: "2026-01-10T17:30:00", round: "Round 3" }, // FC Desham vs FC Cuba (10/01 5:30 PM)
    { home: "45", away: "44", date: "2026-01-08T16:30:00", round: "Round 3" }, // Gunners FC vs Palliyangadi FC (08/01 4:30 PM)

    // Round 4
    { home: "46", away: "48", date: "2026-01-09T17:30:00", round: "Round 4" }, // Club D Fumingo vs FC Malabaris (09/01 5:30 PM)
    { home: "47", away: "30", date: "2026-01-11T16:30:00", round: "Round 4" }, // Aetoz FC vs FC Bavaria (11/01 4:30 PM)
    { home: "41", away: "45", date: "2026-01-10T16:30:00", round: "Round 4" }, // Al Qadr FC vs Gunners FC (10/01 4:30 PM)
    { home: "44", away: "43", date: "2026-01-11T17:00:00", round: "Round 4" }, // Palliyangadi FC vs FC Desham (11/01 5:00 PM)

    // Round 5
    { home: "42", away: "47", date: "2026-01-09T16:30:00", round: "Round 5" }, // Bellari United vs Aetoz FC (09/01 4:30 PM)
    { home: "30", away: "46", date: "2026-01-08T17:00:00", round: "Round 5" }, // FC Bavaria vs Club D Fumingo (08/01 5:00 PM)
    { home: "31", away: "44", date: "2026-01-09T17:00:00", round: "Round 5" }, // FC Cuba vs Palliyangadi FC (09/01 5:00 PM)
    { home: "43", away: "41", date: "2026-01-08T17:30:00", round: "Round 5" }, // FC Desham vs Al Qadr FC (08/01 5:30 PM)
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
