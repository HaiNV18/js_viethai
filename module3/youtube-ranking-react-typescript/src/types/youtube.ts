export interface Channel {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    subscribers: number;
    subscribersFormatted: string;
    category: string;
    videosCount: number;
    url: string;
    facebook?: string;
    tiktok?: string;
    twitter?: string;
    website?: string;
}

export type SubscribeSortOption = "" | "highest" | "lowest";
export type CategoryFilterOption = "" | "VTuber" | "Game" | "News" | "Development" | "Music" | "Tech" | "Entertainment";
