export interface Team {
    id: number;
    title: {
        rendered: string;
    };
    _embedded?: {
        "wp:featuredmedia"?: Array<{
            source_url: string;
        }>;
    };
}
