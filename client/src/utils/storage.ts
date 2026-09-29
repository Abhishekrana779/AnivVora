export const storage = {
  getToken: () => getItem(STORAGE_KEYS.TOKEN),

  setToken: (token: string) => {
    setItem(STORAGE_KEYS.TOKEN, token)
  },

  removeToken: () => {
    removeItem(STORAGE_KEYS.TOKEN)
  },

  getUser: () => {
    const user = getItem(STORAGE_KEYS.USER)

    if (!user) return null

    try {
      return JSON.parse(user)
    } catch {
      return null
    }
  },

  setUser: (user: unknown) => {
    setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },

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

  setSettings: (settings: unknown) => {
    setItem(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify(settings)
    )
  },

  clearAll,
}
