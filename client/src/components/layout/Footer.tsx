import { Link } from "react-router-dom";
import {
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaDiscord,
  FaArrowUp,
  FaPlay,
} from "react-icons/fa";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/[0.06] bg-gray-950">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-purple-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-indigo-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
            >
              {/* Logo */}
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-purple-600/40 blur-xl opacity-50 transition-opacity group-hover:opacity-80" />

                <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 shadow-xl shadow-purple-900/30">
                  <img
                    src="/favicon.png"
                    alt="AniVora"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Brand Name */}
              <div>
                <div className="text-2xl font-black tracking-tight text-white">
                  Ani<span className="text-purple-400">Vora</span>
                </div>

                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.3em] text-gray-500">
                  Anime Streaming
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-lg text-sm leading-7 text-gray-400">
              Your ultimate destination for anime. Discover new series,
              follow your favorite shows, build your watchlist, and enjoy
              your anime journey in one place.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-2">
              <a
                href="#"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-gray-500 transition-all hover:border-purple-500/20 hover:bg-purple-500/10 hover:text-purple-400"
              >
                <FaGithub />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-gray-500 transition-all hover:border-purple-500/20 hover:bg-purple-500/10 hover:text-purple-400"
              >
                <FaTwitter />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-gray-500 transition-all hover:border-purple-500/20 hover:bg-purple-500/10 hover:text-purple-400"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                aria-label="Discord"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-gray-500 transition-all hover:border-purple-500/20 hover:bg-purple-500/10 hover:text-purple-400"
              >
                <FaDiscord />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.15em] text-white">
              Explore
            </h3>

            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="group flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-purple-400"
              >
                <span className="h-px w-0 bg-purple-400 transition-all group-hover:w-3" />
                Home
              </Link>

              <Link
                to="/search"
                className="group flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-purple-400"
              >
                <span className="h-px w-0 bg-purple-400 transition-all group-hover:w-3" />
                Browse Anime
              </Link>

              <Link
                to="/schedule"
                className="group flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-purple-400"
              >
                <span className="h-px w-0 bg-purple-400 transition-all group-hover:w-3" />
                Schedule
              </Link>

              <Link
                to="/genres"
                className="group flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-purple-400"
              >
                <span className="h-px w-0 bg-purple-400 transition-all group-hover:w-3" />
                Genres
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.15em] text-white">
              Account
            </h3>

            <div className="flex flex-col gap-3">
              <Link
                to="/watchlist"
                className="group flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-purple-400"
              >
                <span className="h-px w-0 bg-purple-400 transition-all group-hover:w-3" />
                Watchlist
              </Link>

              <Link
                to="/history"
                className="group flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-purple-400"
              >
                <span className="h-px w-0 bg-purple-400 transition-all group-hover:w-3" />
                Watch History
              </Link>

              <Link
                to="/profile"
                className="group flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-purple-400"
              >
                <span className="h-px w-0 bg-purple-400 transition-all group-hover:w-3" />
                Profile
              </Link>

              <Link
                to="/settings"
                className="group flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-purple-400"
              >
                <span className="h-px w-0 bg-purple-400 transition-all group-hover:w-3" />
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Featured CTA */}
        <div className="relative mb-10 overflow-hidden rounded-2xl border border-purple-500/10 bg-gradient-to-r from-purple-600/[0.08] via-indigo-600/[0.06] to-blue-600/[0.05] p-5 sm:p-6">
          <div className="absolute -right-10 -top-20 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/30">
                <FaPlay className="ml-0.5 text-sm text-white" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  Ready for your next anime?
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Explore thousands of anime and find your next favorite.
                </p>
              </div>
            </div>

            <Link
              to="/search"
              className="inline-flex items-center justify-center rounded-xl bg-white/[0.06] px-5 py-2.5 text-xs font-semibold text-white ring-1 ring-white/[0.08] transition-all hover:bg-white/[0.1]"
            >
              Browse Anime
            </Link>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/[0.06] flex flex-wrap justify-center py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-center text-xs text-gray-600 sm:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-gray-500">
                AniVora
              </span>
              . free of copyright.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                developed by Abhi
              </div>

              {/* Back To Top */}
              <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className="group flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-gray-500 transition-all hover:border-purple-500/20 hover:bg-purple-500/10 hover:text-purple-400"
              >
                <FaArrowUp className="text-xs transition-transform group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}