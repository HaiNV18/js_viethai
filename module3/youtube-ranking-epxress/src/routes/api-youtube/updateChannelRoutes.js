import express from "express";

import { getListIdChannel, updateChannelSubscribers } from "../../models/youtube/channelModel.js";

const router = express.Router();

// Format số sub thành "375M", "1.8M", "500K"
function formatSubscribers(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
}

router.get("/update-subcribe-channel", async (req, res) => {

    try {

        // Step 1: Get all ID Channel
        const ids = await getListIdChannel();
        const listIdChannel = ids.map((item) => item.id);
        console.log(listIdChannel)

        // Step 2: Get data from Youtube
        const idQueryString = listIdChannel.join(",");
        const apiUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
        apiUrl.searchParams.set("part", "snippet,statistics"); // snippet, statistics là data YouTube trả về
        apiUrl.searchParams.set("id", idQueryString);
        apiUrl.searchParams.set("key", process.env.YOUTUBE_API_KEY);
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`YouTube API Error ${response.status}: ${response.statusText}`);
        }
        const ytData = await response.json();
        const items = ytData.items || [];

        // Step 3: update subscribers
        const updatedList = [];
        for (const item of items) {
            const channelId = item.id;
            const channelTitle = item.snippet?.title;
            const subCount = Number(item.statistics?.subscriberCount || 0);
            const subFormatted = formatSubscribers(subCount);
            // Cập nhật vào PostgreSQL
            await updateChannelSubscribers(channelId, subCount, subFormatted);
            console.log(subCount)
            updatedList.push({
                id: channelId,
                title: channelTitle,
                subscribers: subCount,
                subscribersFormatted: subFormatted
            });
        }
        return res.status(200).json({
            success: true,
            message: `Update thành công ${updatedList.length} kênh!`,
            data: updatedList
        });

    } catch (error) {
        console.error("YouTube API Error:", error);

        return res.status(500).json({
            success: false,
            message: "Không thể cập nhật",
            error: error.message
        });
    }
});

export default router;
