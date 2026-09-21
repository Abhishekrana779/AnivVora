import api from "./axios"

interface ServerResponse<T> {
  success: boolean
  message: string
  data: T
}

export const configApi = {
  getAnimeTypes: async (): Promise<{ value: string; label: string }[]> => {
    const response = await api.get("/config/anime-types")
    return (response.data as ServerResponse<{ value: string; label: string }[]>).data
  },

  getAnimeStatuses: async (): Promise<{ value: string; label: string }[]> => {
    const response = await api.get("/config/anime-statuses")
    return (response.data as ServerResponse<{ value: string; label: string }[]>).data
  },

  getServers: async (): Promise<{ id: string; name: string; url: string }[]> => {
    const response = await api.get("/config/servers")
    return (response.data as ServerResponse<{ id: string; name: string; url: string }[]>).data
  },

  getSubtitleLangs: async (): Promise<{ code: string; name: string }[]> => {
    const response = await api.get("/config/subtitle-langs")
    return (response.data as ServerResponse<{ code: string; name: string }[]>).data
  },

  getVideoQualities: async (): Promise<{ value: string; label: string }[]> => {
    const response = await api.get("/config/video-qualities")
    return (response.data as ServerResponse<{ value: string; label: string }[]>).data
  },

  getWatchlistStatuses: async (): Promise<string[]> => {
    const response = await api.get("/config/watchlist-statuses")
    return (response.data as ServerResponse<string[]>).data
  },

  getScheduleDays: async (): Promise<string[]> => {
    const response = await api.get("/config/schedule-days")
    return (response.data as ServerResponse<string[]>).data
  },

  getAbout: async () => {
    const response = await api.get("/config/about")
    return (response.data as ServerResponse<{
      features: string[]
      techStack: { name: string; description: string }[]
      team: { name: string; role: string; github: string }[]
    }>).data
  },
}
