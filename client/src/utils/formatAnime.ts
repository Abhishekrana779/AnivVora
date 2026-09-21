export function formatAnimeTitle(title: string, maxLength: number = 50): string {
  if (title.length <= maxLength) return title
  return title.slice(0, maxLength).trim() + "..."
}

export function formatAnimeType(type: string): string {
  const types: Record<string, string> = {
    TV: "TV Series",
    OVA: "OVA",
    ONA: "ONA",
    Movie: "Movie",
    Special: "Special",
    Music: "Music",
  }
  return types[type] || type
}

export function formatAnimeStatus(status: string): string {
  const statuses: Record<string, string> = {
    Currently_Airing: "Currently Airing",
    Finished_Airing: "Finished Airing",
    Not_Yet_Aired: "Not Yet Aired",
  }
  return statuses[status] || status
}

export function getAnimeRatingColor(rating: number): string {
  if (rating >= 80) return "text-green-500"
  if (rating >= 70) return "text-blue-500"
  if (rating >= 60) return "text-yellow-500"
  if (rating >= 50) return "text-orange-500"
  return "text-red-500"
}

export function getAnimeScoreColor(score: number): string {
  if (score >= 80) return "bg-green-500"
  if (score >= 70) return "bg-blue-500"
  if (score >= 60) return "bg-yellow-500"
  if (score >= 50) return "bg-orange-500"
  return "bg-red-500"
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

export function getYearFromDate(dateString: string): number {
  return new Date(dateString).getFullYear()
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
