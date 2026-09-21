import { api, deduplicatedGet } from "./axios"
import type {
  Anime,
  Episode,
  EpisodeSources,
  PaginatedResponse,
  ScheduleDay,
  Genre,
} from "../types"

interface ServerResponse<T> {
  success: boolean
  message: string
  data: T
}

export const animeApi = {
  getTrending: async (): Promise<Anime[]> => {
    const response = await deduplicatedGet<ServerResponse<Anime[]>>("/anime/trending")
    return response.data
  },

  getRecent: async (): Promise<Anime[]> => {
    const response = await deduplicatedGet<ServerResponse<Anime[]>>("/anime/recent")
    return response.data
  },

  searchAnime: async (
    query: string,
    page: number = 1
  ): Promise<PaginatedResponse<Anime>> => {
    const response = await api.get("/anime/search", {
      params: { q: query, page },
    })

    return (response.data as ServerResponse<PaginatedResponse<Anime>>).data
  },

  getAnimeDetails: async (id: string): Promise<Anime> => {
    const response = await api.get(`/anime/${id}`)
    return (response.data as ServerResponse<Anime>).data
  },

  getAnimeEpisodes: async (id: string): Promise<Episode[]> => {
    const response = await api.get(`/anime/${id}/episodes`)
    return (response.data as ServerResponse<Episode[]>).data
  },

  getEpisodeSources: async (
    animeId: string,
    episodeId: string
  ): Promise<EpisodeSources> => {
    const response = await api.post(
      `/anime/${animeId}/episodes/sources`,
      { episodeId }
    )

    return (response.data as ServerResponse<EpisodeSources>).data
  },

  getAnimeByGenre: async (
    genre: string,
    page: number = 1
  ): Promise<PaginatedResponse<Anime>> => {
    const response = await api.get(`/anime/genre/${genre}`, {
      params: { page },
    })

    return (response.data as ServerResponse<PaginatedResponse<Anime>>).data
  },

  getPopular: async (): Promise<Anime[]> => {
    const response = await deduplicatedGet<ServerResponse<Anime[]>>("/anime/popular")
    return response.data
  },

  getSchedule: async (): Promise<ScheduleDay[]> => {
    const response = await deduplicatedGet<ServerResponse<ScheduleDay[]>>("/anime/schedule")
    return response.data
  },

  getGenres: async (): Promise<Genre[]> => {
    const response = await deduplicatedGet<ServerResponse<Genre[]>>("/anime/genres")
    return response.data
  },

  getAll: async (): Promise<Anime[]> => {
    const response = await api.get("/anime")
    return (response.data as ServerResponse<Anime[]>).data
  },
}