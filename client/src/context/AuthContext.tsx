import {
type ReactNode,
createContext,
useContext,
useState,
useEffect,
} from "react"
import toast from "react-hot-toast"
import { authApi } from "../api/authApi"
import { storage } from "../utils/storage"
import type { User } from "../types"

interface AuthContextType {
user: User | null
loading: boolean
isAuthenticated: boolean
login: (data: {
email: string
password: string
}) => Promise<void>
register: (data: {
username: string
email: string
password: string
}) => Promise<void>
logout: () => Promise<void>
updateProfile: (data: Partial<User>) => Promise<void>
changePassword: (
oldPassword: string,
newPassword: string
) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthContextProvider({
children,
}: {
children: ReactNode
}) {
const [user, setUser] = useState<User | null>(null)
const [loading, setLoading] = useState(true)

const isAuthenticated = !!user

useEffect(() => {
let isMounted = true

const bootstrap = async () => {
  const token = storage.getToken()

  console.log(
    "[AuthContext] Token exists:",
    Boolean(token)
  )

  // User is not logged in.
  // Do not call /auth/me.
  if (!token) {
    if (isMounted) {
      setUser(null)
      setLoading(false)
    }

    return
  }

  try {
    const userData = await authApi.getMe()

    console.log("[AuthContext] User loaded:", userData)

    if (isMounted) {
      setUser(userData)
      storage.setUser(userData)
    }
  } catch (error) {
    console.error(
      "[AuthContext] getMe failed:",
      error
    )

    // Token is invalid or expired.
    storage.clearAll()

    if (isMounted) {
      setUser(null)
    }
  } finally {
    if (isMounted) {
      setLoading(false)
    }
  }
}

bootstrap()

return () => {
  isMounted = false
}

}, [])

const login = async (data: {
email: string
password: string
}) => {
const response = await authApi.login(data)

console.log(
  "[AuthContext] Login successful, token:",
  Boolean(response.token)
)

if (response.token) {
  storage.setToken(response.token)
}

storage.setUser(response.user)
setUser(response.user)

toast.success("Welcome back!")

}

const register = async (data: {
username: string
email: string
password: string
}) => {
const response = await authApi.register(data)

console.log(
  "[AuthContext] Register successful, token:",
  Boolean(response.token)
)

if (response.token) {
  storage.setToken(response.token)
}

storage.setUser(response.user)
setUser(response.user)

toast.success("Account created successfully!")

}

const logout = async () => {
try {
await authApi.logout()
} catch {
// Ignore logout errors
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

const changePassword = async (
oldPassword: string,
newPassword: string
) => {
await authApi.changePassword(
oldPassword,
newPassword
)

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
throw new Error(
"useAuth must be used within an AuthContextProvider"
)
}

return context
}
