import api from "./axios"
import type { WatchHistoryItem, PaginatedResponse, SearchParams } from "../types"

interface ServerResponse<T> {
  success: boolean
  message: string
  data: T
}

export const historyApi = {
  addToHistory: async (data: {
    anime: string
    episode: number
    title: string
    thumbnail: string
    progress: number
    duration: number
  }): Promise<WatchHistoryItem> => {
    const response = await api.post("/history", data)
    return (response.data as ServerResponse<WatchHistoryItem>).data
  },

  getHistory: async (params?: SearchParams): Promise<PaginatedResponse<WatchHistoryItem>> => {
    const response = await api.get("/history", {
      params,
    })
    return (response.data as ServerResponse<PaginatedResponse<WatchHistoryItem>>).data
  },

  getHistoryByAnime: async (animeId: string): Promise<WatchHistoryItem[]> => {
    const response = await api.get(`/history/anime/${animeId}`)
    return (response.data as ServerResponse<WatchHistoryItem[]>).data
  },

  updateHistoryProgress: async (
    id: string,
    data: { progress: number; duration: number }
  ): Promise<WatchHistoryItem> => {
    const response = await api.put(`/history/${id}`, data)
    return (response.data as ServerResponse<WatchHistoryItem>).data
  },

  deleteHistoryItem: async (id: string): Promise<void> => {
    await api.delete(`/history/${id}`)
  },

  clearHistory: async (): Promise<void> => {
    await api.delete("/history")
  },
}
