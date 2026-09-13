import express from "express";

const router = express.Router();

router.get("/channel", async (req, res) => {
    const { id_channel: idChannel } = req.query;

    if (!idChannel) {
        return res.status(400).json({
            error: "Missing required query parameter: id_channel"
        });
    }

    try {
        const apiUrl = new URL(
            "https://www.googleapis.com/youtube/v3/channels"
        );

        apiUrl.searchParams.set(
            "part",
            "snippet,statistics,contentDetails"
        );

        apiUrl.searchParams.set("id", idChannel);
        apiUrl.searchParams.set("key", process.env.YOUTUBE_API_KEY);

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(
                `YouTube API returned ${response.status}: ${response.statusText}`
            );
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return res.status(404).json({
                error: "Channel not found"
            });
        }

        const item = data.items[0];

        const channelInfo = {
            idChannel: item.id,
            nameChannel: item.snippet?.title || "",
            description: item.snippet?.description || "",
            customUrl: item.snippet?.customUrl || "",
            publishedAt: item.snippet?.publishedAt || "",
            thumbnail:
                item.snippet?.thumbnails?.high?.url ||
                item.snippet?.thumbnails?.default?.url ||
                "",
            viewCount: item.statistics?.viewCount || "0",
            subscriberCount: item.statistics?.subscriberCount || "0",
            hiddenSubscriberCount:
                item.statistics?.hiddenSubscriberCount ?? false,
            videoCount: item.statistics?.videoCount || "0"
        };

        return res.json(channelInfo);

    } catch (error) {
        console.error("YouTube API Error:", error);

        return res.status(500).json({
            error: "Failed to fetch channel data",
            details: error.message
        });
    }
});

export default router;
