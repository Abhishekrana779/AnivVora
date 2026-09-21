import api from "./axios"
import type { User, PaginatedResponse, SearchParams } from "../types"

interface ServerResponse<T> {
  success: boolean
  message: string
  data: T
}

export const userApi = {
  getAllUsers: async (params?: SearchParams): Promise<PaginatedResponse<User>> => {
    const response = await api.get("/users", { params })
    return (response.data as ServerResponse<PaginatedResponse<User>>).data
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`)
    return (response.data as ServerResponse<User>).data
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, data)
    return (response.data as ServerResponse<User>).data
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`)
  },
}
