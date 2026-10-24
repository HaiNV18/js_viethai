import express from "express";

const router = express.Router();

const DEFAULT_AVATAR = "default-channel-thumbnail.jpg";
const DEFAULT_BANNER = "default-channel-banner.jpg";

const CHANNELS = [
    {
        id: "UCX6OQ3DkcsbYNE6H8uQQuVA",
        name: "MrBeast",
        handle: "@MrBeast",
        avatar: DEFAULT_AVATAR,
        banner: DEFAULT_BANNER,
        subscribers: 375000000,
        subscribersFormatted: "375M",
        category: "Entertainment",
        videosCount: 840,
        url: "https://youtube.com/@MrBeast",
        twitter: "https://twitter.com/MrBeast",
        website: "https://mrbeast.com",
        tiktok: "https://tiktok.com/@mrbeast",
        facebook: "https://facebook.com/MrBeast6000"
    },
    {
        id: "UCq-Fj5jknLsUf-MWSy4_brA",
        name: "T-Series",
        handle: "@tseries",
        avatar: "tseries-channel-thumbnail.jpg",
        banner: DEFAULT_BANNER,
        subscribers: 285000000,
        subscribersFormatted: "285M",
        category: "Music",
        videosCount: 21500,
        url: "https://youtube.com/@tseries",
        twitter: "https://twitter.com/TSeries",
        website: "https://tseries.com",
        facebook: "https://facebook.com/tseriesmusic"
    },
    {
        id: "UC-lHJZR3Gqxm24_Vd_AJ5Yw",
        name: "PewDiePie",
        handle: "@PewDiePie",
        avatar: "pewdiepie-channel-thumbnail.jpg",
        banner: DEFAULT_BANNER,
        subscribers: 111000000,
        subscribersFormatted: "111M",
        category: "Game",
        videosCount: 4790,
        url: "https://youtube.com/@PewDiePie",
        twitter: "https://twitter.com/pewdiepie",
        website: "https://pewdiepie.com",
        facebook: "https://facebook.com/pewdiepie"
    },
    {
        id: "UCGCZAYq5Xxojl_tSXcVJhiQ",
        name: "ANN News Channel",
        handle: "@ANNnewsCH",
        avatar: "ann-news-channel-thumbnail.jpg",
        banner: DEFAULT_BANNER,
        subscribers: 3800000,
        subscribersFormatted: "3.8M",
        category: "News",
        videosCount: 154000,
        url: "https://youtube.com/@ANNnewsCH",
        website: "https://news.tv-asahi.co.jp",
        twitter: "https://twitter.com/tv_asahi_news"
    },
    {
        id: "UC8butISFwT-Wl7EV0hUK0BQ",
        name: "FreeCodeCamp.org",
        handle: "@freecodecamp",
        avatar: "freecodecamp-channel-thumbnail.jpg",
        banner: DEFAULT_BANNER,
        subscribers: 10200000,
        subscribersFormatted: "10.2M",
        category: "Development",
        videosCount: 1850,
        url: "https://youtube.com/@freecodecamp",
        twitter: "https://twitter.com/freecodecamp",
        website: "https://www.freecodecamp.org"
    },
    {
        id: "UCJFZiqLm7iJ0vEM18y4_bWw",
        name: "Hololive Ch. hololive-VTuber",
        handle: "@hololive",
        avatar: "hololive-channel-thumbnail.jpg",
        banner: "hololive-channel-banner.jpg",
        subscribers: 2500000,
        subscribersFormatted: "2.5M",
        category: "VTuber",
        videosCount: 2100,
        url: "https://youtube.com/@hololive",
        twitter: "https://twitter.com/hololivetv",
        website: "https://hololive.hololivepro.com",
        tiktok: "https://tiktok.com/@hololive_eng"
    },
    {
        id: "UC4YaOt1yT-ZeyB0OmxHgolA",
        name: "Kizuna AI Channel",
        handle: "@KizunaAI",
        avatar: "kizuna-ai-channel-thumbnail.jpg",
        banner: DEFAULT_BANNER,
        subscribers: 3000000,
        subscribersFormatted: "3.0M",
        category: "VTuber",
        videosCount: 1100,
        url: "https://youtube.com/@KizunaAI",
        twitter: "https://twitter.com/aichan_nel",
        website: "https://kizunaai.com",
        tiktok: "https://tiktok.com/@kizunaai0630"
    },
    {
        id: "UC17VwD86qB9hAIdPnm6dYcw",
        name: "Muse Vietnam",
        handle: "@MuseVN",
        avatar: "musevn-channel-thumbnail.jpg",
        banner: DEFAULT_BANNER,
        subscribers: 1800000,
        subscribersFormatted: "1.8M",
        category: "Entertainment",
        videosCount: 3200,
        url: "https://youtube.com/@MuseVN",
        facebook: "https://facebook.com/museacg.vn"
    },
    {
        id: "UClOf1XXinvZsy4wKPAkro2A",
        name: "PlayOverwatch",
        handle: "@PlayOverwatch",
        avatar: "play-overwatch-channel-thumbnail.jpg",
        banner: DEFAULT_BANNER,
        subscribers: 3600000,
        subscribersFormatted: "3.6M",
        category: "Game",
        videosCount: 890,
        url: "https://youtube.com/@PlayOverwatch",
        twitter: "https://twitter.com/PlayOverwatch",
        website: "https://overwatch.blizzard.com",
        facebook: "https://facebook.com/PlayOverwatch"
    },
    {
        id: "UC9nK195uN_z_4L0Qj7x1l0w",
        name: "SBS Drama",
        handle: "@sbsdrama",
        avatar: "sbs-channel-thumbnail.jpg",
        banner: DEFAULT_BANNER,
        subscribers: 7200000,
        subscribersFormatted: "7.2M",
        category: "Entertainment",
        videosCount: 45000,
        url: "https://youtube.com/@sbsdrama",
        website: "https://www.sbs.co.kr",
        facebook: "https://facebook.com/sbsNOW"
    },
    {
        id: "UCuP2vJ6_0nB9H_P1o5_P3wA",
        name: "Vexsper",
        handle: "@vexsper",
        avatar: "vexsper-channel-thumbnail.jpg",
        banner: DEFAULT_BANNER,
        subscribers: 500000,
        subscribersFormatted: "500K",
        category: "Development",
        videosCount: 150,
        url: "https://youtube.com/@vexsper",
        twitter: "https://twitter.com/vexsper"
    },
    {
        id: "UCVia_crjzJylRmGq7SHTiaw",
        name: "Hearthstone",
        handle: "@Hearthstone",
        avatar: "hearthstone-channel-thumbnail.jpg",
        banner: "hearthstone-channel-banner.jpg",
        subscribers: 496000,
        subscribersFormatted: "496K",
        category: "Game",
        videosCount: 1680,
        url: "https://youtube.com/@Hearthstone",
        website: "https://us.shop.battle.net/en-us/family/hearthstone",
    },
    {
        id: "2",
        name: "VTC NEWS",
        handle: "@VTCNewstintuc",
        avatar: "vtc-news-channel-thumbnail.jpg",
        banner: "vtc-news-channel-banner.jpg",
        subscribers: 449000,
        subscribersFormatted: "449K",
        category: "Tech",
        videosCount: 1680,
        url: "https://youtube.com/@VTCNewstintuc",
        website: "https://vtcnews.vn/",
    }
];

/**
 * GET /api/v1/channel/list
 *
 * Query:
 * - keyword: filter by name or handle
 * - category: filter by category
 * - sort: desc-sub | asc-sub | highest | lowest
 */
router.get("/channel/list", (req, res) => {
    const {
        keyword,
        category,
        sort
    } = req.query;

    let results = [...CHANNELS];

    // Filter keyword theo name hoặc handle
    if (keyword && keyword.trim() !== "") {
        const keywordLower = keyword.trim().toLowerCase();

        results = results.filter((channel) =>
            channel.name.toLowerCase().includes(keywordLower) ||
            (channel.handle && channel.handle.toLowerCase().includes(keywordLower))
        );
    }

    // Filter category
    if (category && category.trim() !== "") {
        const categoryLower = category.trim().toLowerCase();

        results = results.filter(
            (channel) => channel.category.toLowerCase() === categoryLower
        );
    }

    // Sort theo subscribers
    if (sort === "desc-sub" || sort === "highest") {
        results.sort(
            (a, b) => b.subscribers - a.subscribers
        );
    }

    if (sort === "asc-sub" || sort === "lowest") {
        results.sort(
            (a, b) => a.subscribers - b.subscribers
        );
    }

    return res.json({
        data: results,
        total: results.length
    });
});

export default router;
