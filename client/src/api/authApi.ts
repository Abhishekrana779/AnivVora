import { api, deduplicatedGet } from "./axios"
import type { AuthResponse, RegisterData, LoginData, User } from "../types"

interface ServerResponse<T> {
  success: boolean
  message: string
  data: T
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data)
    return (response.data as ServerResponse<AuthResponse>).data
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data)
    return (response.data as ServerResponse<AuthResponse>).data
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout")
  },

  getMe: async (): Promise<User> => {
    const response = await deduplicatedGet<ServerResponse<User>>("/auth/me")
    return response.data
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put("/auth/profile", data)
    return (response.data as ServerResponse<User>).data
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.post("/auth/change-password", { oldPassword, newPassword })
  },
}
