export const getTeams = async () => {
    // In production (InfinityFree), WP is at root, app is at /app.
    // So /wp-json is available at root relative path.
    // In dev, we need /api prefix to trigger proxy.
    const baseUrl = import.meta.env.PROD ? "" : "/api";
    const res = await fetch(`${baseUrl}/wp-json/sportspress/v2/teams?_embed`);

    if (!res.ok) {
        throw new Error("Failed to fetch teams");
    }

    return res.json();
};
