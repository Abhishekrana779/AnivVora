import api from "./axios"
import type { WatchlistItem } from "../types"

interface ServerResponse<T> {
  success: boolean
  message: string
  data: T
}

export const watchlistApi = {
  addToWatchlist: async (data: {
    animeId: string
    title: string
    image: string
    status?: string
    synopsis?: string
    episodes?: number
    genres?: string[]
  }): Promise<WatchlistItem> => {
    const response = await api.post("/watchlist", data)
    return (response.data as ServerResponse<WatchlistItem>).data
  },

  getWatchlist: async (): Promise<WatchlistItem[]> => {
    const response = await api.get("/watchlist")
    return (response.data as ServerResponse<WatchlistItem[]>).data
  },

  getWatchlistByStatus: async (status: string): Promise<WatchlistItem[]> => {
    const response = await api.get(`/watchlist/status/${status}`)
    return (response.data as ServerResponse<WatchlistItem[]>).data
  },

  updateWatchlistStatus: async (
    id: string,
    data: { status: string }
  ): Promise<WatchlistItem> => {
    const response = await api.put(`/watchlist/${id}/status`, data)
    return (response.data as ServerResponse<WatchlistItem>).data
  },

  removeFromWatchlist: async (id: string): Promise<void> => {
    await api.delete(`/watchlist/${id}`)
  },

  clearWatchlist: async (): Promise<void> => {
    await api.delete("/watchlist")
  },
}
