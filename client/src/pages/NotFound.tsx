import { Link } from 'react-router-dom'
import { FaHome, FaSearch } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="text-center">
        <div className="mb-8 text-6xl sm:text-8xl md:text-9xl font-bold text-purple-600">404</div>
        <h1 className="mb-4 text-4xl font-bold text-white">Page Not Found</h1>
        <p className="mb-8 text-lg text-gray-400">
          The anime you're looking for has been sent to another dimension.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-500"
          >
            <FaHome size={20} />
            Go Home
          </Link>
          <Link
            to="/search"
            className="flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-3 text-white hover:bg-gray-700"
          >
            <FaSearch size={20} />
            Search Anime
          </Link>
        </div>
        <div className="mt-12 text-6xl">👾</div>
        <p className="mt-4 text-sm text-gray-500">Error code: ANIME_NOT_FOUND</p>
      </div>
    </div>
  )
}
