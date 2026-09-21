import { useState, useEffect } from 'react'
import { FaCode, FaUsers, FaHeart, FaExternalLinkAlt } from 'react-icons/fa'
import { configApi } from '../api/configApi'

export default function About() {
  const [loading, setLoading] = useState(true)
  const [features, setFeatures] = useState<string[]>([])
  const [techStack, setTechStack] = useState<{ name: string; description: string }[]>([])
  const [team, setTeam] = useState<{ name: string; role: string; github: string }[]>([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    configApi.getAbout()
      .then((data) => {
        if (!cancelled) {
          setFeatures(data.features || [])
          setTechStack(data.techStack || [])
          setTeam(data.team || [])
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">About AniVora</h1>
          <p className="mt-4 text-xl text-gray-400">Your ultimate anime streaming platform</p>
        </div>

        <section className="mt-16">
          <h2 className="mb-8 text-3xl font-bold text-white">Our Mission</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            AniVora is a modern anime streaming platform built to provide anime enthusiasts with the best
            viewing experience. We aggregate high-quality anime content from multiple sources, offer
            personalized recommendations, and help you track your watch progress seamlessly.
          </p>
        </section>

        <section className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <FaHeart className="text-purple-400" size={28} />
            <h2 className="text-3xl font-bold text-white">Features</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-lg bg-gray-800 p-4 h-12" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-gray-800 p-4">
                  <span className="text-purple-400">✓</span>
                  <span className="text-gray-200">{feature}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <FaCode className="text-purple-400" size={28} />
            <h2 className="text-3xl font-bold text-white">Tech Stack</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-lg bg-gray-800 p-4 h-24" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {techStack.map((tech, i) => (
                <div key={i} className="rounded-lg bg-gray-800 p-4 text-center">
                  <h3 className="font-semibold text-white">{tech.name}</h3>
                  <p className="mt-1 text-sm text-gray-400">{tech.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <FaUsers className="text-purple-400" size={28} />
            <h2 className="text-3xl font-bold text-white">Meet the Team</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl bg-gray-800 p-6 h-40" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {team.map((member, i) => (
                <div key={i} className="rounded-xl bg-gray-800 p-6 text-center shadow-lg">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-600 text-2xl font-bold text-white">
                    {member.name[0]}
                  </div>
                  <h3 className="font-semibold text-white">{member.name}</h3>
                  <p className="text-sm text-gray-400">{member.role}</p>
                  <a
                    href={member.github}
                    className="mt-3 inline-flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
                  >
                    GitHub <FaExternalLinkAlt size={14} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Contact Us</h2>
          <p className="text-gray-400">
            Have feedback or suggestions? Reach out at{' '}
            <a href="mailto:hello@anivora.com" className="text-purple-400 hover:text-purple-300">
              hello@anivora.com
            </a>
          </p>
        </section>
      </main>
    </div>
  )
}
