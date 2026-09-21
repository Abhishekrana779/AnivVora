export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "00:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

export function parseDuration(duration: string): number {
  const parts = duration.match(/(\d+)\s*(h|m|s|min|sec|hr)/i)
  if (!parts) return 0

  let totalSeconds = 0
  const value = parseInt(parts[1])
  const unit = parts[2].toLowerCase()

  if (unit.startsWith("h")) {
    totalSeconds += value * 3600
  } else if (unit.startsWith("m")) {
    totalSeconds += value * 60
  } else if (unit.startsWith("s")) {
    totalSeconds += value
  }

  return totalSeconds
}
