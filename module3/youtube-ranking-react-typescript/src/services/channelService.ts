import axios from "axios";
import type { Channel, SubscribeSortOption, CategoryFilterOption } from "../types/youtube";

// Base URL Express Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

// Khởi tạo Instance Axios
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export interface GetChannelsParams {
    keyword?: string;
    category?: CategoryFilterOption | string;
    sort?: SubscribeSortOption | string;
}

export interface GetChannelsResponse {
    data: Channel[];
    total: number;
}

export interface ChannelDetailResponse {
    idChannel: string;
    nameChannel: string;
    description: string;
    customUrl: string;
    publishedAt: string;
    thumbnail: string;
    banner?: string;
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
}

/**
 * API danh sách kênh YouTube: GET /api/v1/channel/list
 * Params: keyword, category, sort
 */
export const getChannelsService = async (params?: GetChannelsParams): Promise<GetChannelsResponse> => {
    try {
        const response = await api.get<GetChannelsResponse>("/channel/list", {
            params: {
                keyword: params?.keyword ?? "",
                category: params?.category ?? "",
                sort: params?.sort ?? "",
            },
        });
        return response.data;
    } catch (error) {
        try {
            const fallbackRes = await api.get<GetChannelsResponse>("/channel/list", {
                params: {
                    keyword: params?.keyword ?? "",
                    category: params?.category ?? "",
                    sort: params?.sort ?? "",
                },
            });
            return fallbackRes.data;
        } catch {
            throw error;
        }
    }
};

/**
 * API chi tiết kênh YouTube: GET /api/v1/channel?id_channel=:idChannel
 */
export const getChannelDetailService = async (idChannel: string): Promise<ChannelDetailResponse> => {
    const response = await api.get<ChannelDetailResponse>("/channel", {
        params: {
            id_channel: idChannel,
        },
    });
    return response.data;
};

export default {
    getChannelsService,
    getChannelDetailService,
};
