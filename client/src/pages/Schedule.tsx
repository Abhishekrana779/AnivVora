import { useState, useEffect } from 'react'
import { AnimeRow } from '../components/anime/AnimeRow'
import { animeApi } from '../api/animeApi'
import { configApi } from '../api/configApi'
import type { ScheduleDay } from '../types'

const FALLBACK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Schedule() {
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState<string[]>([])
  const [selectedDay, setSelectedDay] = useState<string>('')
  const [schedule, setSchedule] = useState<ScheduleDay[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      configApi.getScheduleDays().catch(() => null),
      animeApi.getSchedule().catch(() => null),
    ])
      .then(([scheduleDays, scheduleData]) => {
        if (cancelled) return
        const daysList = Array.isArray(scheduleDays) && scheduleDays.length > 0 ? scheduleDays : FALLBACK_DAYS
        setDays(daysList)
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
        setSelectedDay(daysList.includes(today) ? today : daysList[0])
        setSchedule(Array.isArray(scheduleData) ? scheduleData : [])
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setDays(FALLBACK_DAYS)
          setSelectedDay(FALLBACK_DAYS[0])
          setSchedule([])
          setLoading(false)
          setError('Failed to load schedule data. Please try again later.')
        }
      })
    return () => { cancelled = true }
  }, [])

  const daySchedule = schedule.find((s) => s.day === selectedDay) || { day: selectedDay, animes: [] as any[] }

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-white">Anime Schedule</h1>
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <div className="mb-8 flex gap-2 overflow-x-auto">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`rounded-lg px-4 py-2 whitespace-nowrap font-medium transition ${
                selectedDay === day
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-bold text-white">{daySchedule.day}</h2>
          {daySchedule.animes?.length ? (
            <AnimeRow title="" animeList={daySchedule.animes} isLoading={loading} />
          ) : (
            <p className="text-gray-400">No anime scheduled for this day.</p>
          )}
        </div>
      </main>
    </div>
  )
}
