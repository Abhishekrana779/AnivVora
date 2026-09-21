import { type ReactNode, createContext, useContext, useState, useEffect } from "react"
import toast from "react-hot-toast"
import { authApi } from "../api/authApi"
import { storage } from "../utils/storage"
import type { User } from "../types"

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (data: { email: string; password: string }) => Promise<void>
  register: (data: { username: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const isAuthenticated = !!user

 useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    setUser(null);
    setLoading(false);
    return;
  }

  const loadUser = async () => {
    try {
      const response = await getMe();
      setUser(response.data);
    } catch (error) {
      console.error("[AuthContext] getMe failed:", error);

      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  loadUser();
}, []);

  const login = async (data: { email: string; password: string }) => {
    const response = await authApi.login(data)
    setUser(response.user)
    storage.setUser(response.user)
    if (response.token) {
      storage.setToken(response.token)
    }
    toast.success("Welcome back!")
  }

  const register = async (data: { username: string; email: string; password: string }) => {
    const response = await authApi.register(data)
    setUser(response.user)
    storage.setUser(response.user)
    if (response.token) {
      storage.setToken(response.token)
    }
    toast.success("Account created successfully!")
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore logout errors
    } finally {
      setUser(null)
      storage.clearAll()
      toast.success("Logged out successfully")
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    const updatedUser = await authApi.updateProfile(data)
    setUser(updatedUser)
    storage.setUser(updatedUser)
    toast.success("Profile updated")
  }

  const changePassword = async (oldPassword: string, newPassword: string) => {
    await authApi.changePassword(oldPassword, newPassword)
    toast.success("Password changed successfully")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider")
  }
  return context
}
