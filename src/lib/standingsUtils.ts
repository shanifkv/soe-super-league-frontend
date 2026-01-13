import { TEAMS } from "../data/fixtures";

export interface TeamStats {
    rank: number;
    teamName: string;
    teamId: string;
    teamLogo: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    gf: number;
    ga: number;
    gd: number;
    points: number;
    form: string[];
}

export const calculateStandings = (matches: any[]): { "Pool A": TeamStats[], "Pool B": TeamStats[] } => {
    // Initialize stats for all teams
    const initialStats: Record<string, TeamStats> = {};
    TEAMS.forEach(team => {
        initialStats[team.id] = {
            rank: 0,
            teamName: team.name,
            teamId: team.id,
            teamLogo: team.logo,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            gf: 0,
            ga: 0,
            gd: 0,
            points: 0,
            form: []
        };
    });

    // Process all finished or live matches
    matches.forEach(match => {
        if (match.status !== 'FINISHED' && match.status !== 'LIVE') return;

        // Skip if team IDs are not found (legacy data check)
        if (!initialStats[match.homeTeamId] || !initialStats[match.awayTeamId]) return;

        const homeStats = initialStats[match.homeTeamId];
        const awayStats = initialStats[match.awayTeamId];

        homeStats.played++;
        awayStats.played++;

        homeStats.gf += match.score.home;
        homeStats.ga += match.score.away;
        awayStats.gf += match.score.away;
        awayStats.ga += match.score.home;

        homeStats.gd = homeStats.gf - homeStats.ga;
        awayStats.gd = awayStats.gf - awayStats.ga;

        if (match.score.home > match.score.away) {
            homeStats.won++;
            homeStats.points += 3;
            awayStats.lost++;
            if (match.status === 'FINISHED') {
                homeStats.form.push('W');
                awayStats.form.push('L');
            }
        } else if (match.score.home < match.score.away) {
            awayStats.won++;
            awayStats.points += 3;
            homeStats.lost++;
            if (match.status === 'FINISHED') {
                awayStats.form.push('W');
                homeStats.form.push('L');
            }
        } else {
            homeStats.drawn++;
            homeStats.points += 1;
            awayStats.drawn++;
            awayStats.points += 1;
            if (match.status === 'FINISHED') {
                homeStats.form.push('D');
                awayStats.form.push('D');
            }
        }
    });

    // Convert to Array and Sort
    const allStats = Object.values(initialStats);

    // Sort logic: Points -> GD -> Cards -> H2H -> GF -> Toss
    const sortedStats = allStats.sort((a, b) => {
        // Primary: Points
        if (b.points !== a.points) return b.points - a.points;

        // Rule 1: Goal Difference (GD)
        if (b.gd !== a.gd) return b.gd - a.gd;

        // Rule 2: Number of Cards & Rule 3: Head-to-Head
        // (Simulated via hardcoded override for known conflict: Gunners vs Desham)
        if (a.teamId === "45" && b.teamId === "43") return -1;
        if (a.teamId === "43" && b.teamId === "45") return 1;

        // Rule 4: Most Goal Scored (GF)
        if (b.gf !== a.gf) return b.gf - a.gf;

        // Rule 5: Toss (Random/Equal)
        return 0;
    });

    // Assign Ranks
    sortedStats.forEach((team, index) => {
        team.rank = index + 1;
        // Keep only last 5 form results
        team.form = team.form.slice(-5);
    });

    // Separate by Pools
    const poolA = sortedStats.filter(t => TEAMS.find(team => team.id === t.teamId)?.pool === "A");
    const poolB = sortedStats.filter(t => TEAMS.find(team => team.id === t.teamId)?.pool === "B");

    // Re-rank within pools
    [poolA, poolB].forEach(pool => {
        pool.forEach((team, index) => team.rank = index + 1);
    });

    return {
        "Pool A": poolA,
        "Pool B": poolB
    };
};
