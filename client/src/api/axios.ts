import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios"
import toast from "react-hot-toast"
import { storage } from "../utils/storage"

const API_BASE_URL = "https://anivvora-server.onrender.com/api"

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken()

    console.log("[Axios Request]", {
      url: config.url,
      hasToken: Boolean(token),
    })

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`)
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    const status = error.response?.status

    if (status === 401) {
      console.warn(
        "[Axios] Unauthorized:",
        error.config?.url
      )

      storage.removeToken?.()

      return Promise.reject(error)
    }

    if (status === 429) {
      toast.error("Too many requests. Please try again later.")
      return Promise.reject(error)
    }

    if (status && status >= 500) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Something went wrong"

      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api
