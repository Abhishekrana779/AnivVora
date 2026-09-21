const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "ani-vora-theme",
  SETTINGS: "ani-vora-settings",
}

export function getItem(key: string): string | null {
  try {
    const item = localStorage.getItem(key)
    return item
  } catch {
    return null
  }
}

export function setItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // ignore storage errors
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore storage errors
  }
}

export function clearAll(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.SETTINGS)
    localStorage.removeItem(STORAGE_KEYS.THEME)
  } catch {
    // ignore storage errors
  }
}

export const storage = {
  getToken: () => getItem(STORAGE_KEYS.TOKEN),
  setToken: (token: string) => setItem(STORAGE_KEYS.TOKEN, token),
  getUser: () => {
    const user = getItem(STORAGE_KEYS.USER)
    if (!user) return null
    try {
      return JSON.parse(user)
    } catch {
      return null
    }
  },
  setUser: (user: unknown) => setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
  getTheme: () => getItem(STORAGE_KEYS.THEME) || "system",
  setTheme: (theme: string) => setItem(STORAGE_KEYS.THEME, theme),
  getSettings: () => {
    const settings = getItem(STORAGE_KEYS.SETTINGS)
    if (!settings) return null
    try {
      return JSON.parse(settings)
    } catch {
      return null
    }
  },
  setSettings: (settings: unknown) => setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)),
  clearAll,
}
