import { type ReactNode, createContext, useContext, useState, useEffect } from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

interface ThemeContextProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeContextProvider({
  children,
  defaultTheme = "system",
  storageKey = "ani-vora-theme",
}: ThemeContextProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored && ["light", "dark", "system"].includes(stored)) {
        return stored as Theme
      }
    } catch {
      // ignore
    }
    return defaultTheme
  })

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return theme as ResolvedTheme
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(resolvedTheme)
    try {
      localStorage.setItem(storageKey, theme)
    } catch {
      // ignore
    }
  }, [theme, resolvedTheme, storageKey])

  useEffect(() => {
    if (theme !== "system") {
      setResolvedTheme(theme as ResolvedTheme)
      return
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? "dark" : "light")
    }
    mediaQuery.addEventListener("change", handler)
    setResolvedTheme(mediaQuery.matches ? "dark" : "light")
    return () => mediaQuery.removeEventListener("change", handler)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState((prev: Theme) => {
      if (prev === "light") return "dark"
      if (prev === "dark") return "light"
      return resolvedTheme === "dark" ? "light" : "dark"
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeContextProvider")
  }
  return context
}
