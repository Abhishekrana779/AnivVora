import { useState, useEffect } from "react"
import { getItem, setItem } from "../utils/storage"

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      setItem(key, JSON.stringify(storedValue))
    } catch {
      // ignore
    }
  }, [key, storedValue])

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const nextValue = value instanceof Function ? value(storedValue) : value
      setStoredValue(nextValue)
      setItem(key, JSON.stringify(nextValue))
    } catch {
      // ignore
    }
  }

  return [storedValue, setValue]
}

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
