import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"
import toast from "react-hot-toast"
import { storage } from "../utils/storage"

const API_BASE_URL = import.meta.env.DEV ? "http://localhost:5000/api" : "/api"

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

const pendingRequests = new Map<string, Promise<unknown>>()
const responseCache = new Map<string, { expiry: number; data: unknown }>()
const CACHE_TTL = 60000
const ERROR_CACHE_TTL = 15000

async function deduplicatedGet<T>(url: string): Promise<T> {
  const now = Date.now()
  const cached = responseCache.get(url)

  if (cached) {
    if (cached.expiry > now) {
      if (cached.data instanceof Error) {
        throw cached.data
      }
      return cached.data as T
    }
    responseCache.delete(url)
  }

  const key = `GET:${url}`
  const existing = pendingRequests.get(key)
  if (existing) {
    return existing as Promise<T>
  }

  const request = api.get<T>(url).then((res) => {
    responseCache.set(url, { expiry: now + CACHE_TTL, data: res.data })
    return res.data
  }).catch((err) => {
    if (err.response?.status === 429) {
      responseCache.set(url, { expiry: now + ERROR_CACHE_TTL, data: err })
    }
    if (err.response?.status === 401) {
      responseCache.delete(url)
    }
    pendingRequests.delete(key)
    throw err
  })

  pendingRequests.set(key, request)
  return request
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken()
    console.log('[Axios Request]', config.url, 'hasToken:', !!token)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    if (status === 401) {
      storage.clearAll()
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

export { deduplicatedGet }

export default api