import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaHome,
  FaCompass,
  FaCalendarAlt,
  
  FaBookmark,
  FaHistory,

  FaPlay,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { MobileMenu } from "./MobileMenu";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    setIsOpen(false);

    await logout();

    navigate("/");
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      navigate("/search");
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);

    setIsOpen(false);
    setProfileOpen(false);
  };

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <FaHome />,
    },
    {
      name: "Browse",
      path: "/search",
      icon: <FaCompass />,
    },
    {
      name: "Schedule",
      path: "/schedule",
      icon: <FaCalendarAlt />,
    },
  ];

  return (
    <nav className="sticky top-0 z-50">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 overflow-hidden">
        <div className="absolute left-[8%] top-[-50px] h-32 w-32 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute right-[15%] top-[-60px] h-32 w-32 rounded-full bg-blue-600/15 blur-3xl" />
      </div>

      {/* Main navbar */}
      <div className="relative border-b border-white/[0.08] bg-gray-950/80 backdrop-blur-2xl">
        {/* Top gradient line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

        <div className="mx-auto max-w-[1600px] px-3 sm:px-5 lg:px-8">
          <div className="flex h-[72px] items-center gap-3 lg:gap-5">
            {/* ================= LEFT ================= */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Mobile menu */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen((prev) => !prev);
                  setProfileOpen(false);
                }}
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-gray-300 transition-all duration-300 hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white md:hidden"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <FaTimes
                    size={17}
                    className="transition-transform duration-300"
                  />
                ) : (
                  <FaBars
                    size={17}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                )}
              </button>

              {/* Desktop logo */}
              <Link
                to="/"
                className="group hidden items-center gap-2.5 md:flex"
                aria-label="AniVora Home"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-purple-600/40 blur-xl opacity-40 transition-all duration-500 group-hover:scale-125 group-hover:opacity-80" />

                  <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/20 to-blue-500/10 shadow-lg shadow-purple-900/20">
                    <img
                      src="/favicon.png"
                      alt="AniVora"
                      className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>

                <div className="hidden xl:block">
                  <div className="text-[20px] font-black tracking-tight text-white">
                    Ani<span className="text-purple-400">Vora</span>
                  </div>

                  <div className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-[0.18em] text-gray-500">
                    <FaPlay className="text-[7px] text-purple-400" />
                    Anime Streaming
                  </div>
                </div>
              </Link>

              {/* Mobile logo */}
              <Link
                to="/"
                className="group flex items-center gap-2 md:hidden"
                aria-label="AniVora Home"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-purple-600/40 blur-lg opacity-40 transition-all duration-500 group-hover:scale-125 group-hover:opacity-80" />

                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/20 to-blue-500/10 shadow-lg shadow-purple-900/20">
                    <img
                      src="/favicon.png"
                      alt="AniVora"
                      className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>

                <span className="text-lg font-black tracking-tight text-white">
                  Ani<span className="text-purple-400">Vora</span>
                </span>
              </Link>

              {/* Desktop navigation */}
              <div className="ml-2 hidden items-center rounded-2xl border border-white/[0.06] bg-white/[0.025] p-1 lg:flex xl:ml-5">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-300 xl:px-3.5 ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/10 shadow-inner shadow-purple-500/10" />
                        )}

                        <span
                          className={`relative z-10 text-[11px] transition-all duration-300 ${
                            isActive
                              ? "text-purple-400"
                              : "text-gray-500 group-hover:scale-110 group-hover:text-purple-400"
                          }`}
                        >
                          {item.icon}
                        </span>

                        <span className="relative z-10 hidden xl:block">
                          {item.name}
                        </span>

                        {isActive && (
                          <span className="absolute bottom-0 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-purple-400 shadow-lg shadow-purple-500/60" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* ================= CENTER SEARCH ================= */}
            <form
              onSubmit={handleSearch}
              className="hidden min-w-0 flex-1 md:block"
            >
              <div className="group relative mx-auto max-w-[560px]">
                {/* Search glow */}
                <div className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-blue-500/0 opacity-0 blur-sm transition-all duration-500 group-focus-within:opacity-100" />

                <div className="relative flex h-11 items-center overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.045] shadow-inner shadow-black/20 transition-all duration-300 group-focus-within:border-purple-500/30 group-focus-within:bg-white/[0.065]">
                  <FaSearch className="ml-4 shrink-0 text-[13px] text-gray-500 transition-colors duration-300 group-focus-within:text-purple-400" />

                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search anime, characters, studios..."
                    autoComplete="off"
                    className="h-full min-w-0 flex-1 bg-transparent px-3 text-[13px] text-white outline-none placeholder:text-gray-600"
                  />

                  {/* Search shortcut */}
                  <div className="mr-2 hidden items-center gap-1 sm:flex">
                    <kbd className="rounded-lg border border-white/[0.08] bg-white/[0.05] px-2 py-1 text-[9px] font-medium text-gray-500">
                      /
                    </kbd>
                  </div>

                  {/* Search button */}
                  <button
                    type="submit"
                    className="mr-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/30 transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:to-indigo-500"
                    aria-label="Search"
                  >
                    <FaSearch className="text-[11px]" />
                  </button>
                </div>
              </div>
            </form>

            {/* ================= RIGHT ================= */}
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {/* Mobile search */}
              <button
                type="button"
                onClick={() => navigate("/search")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-gray-300 transition-all duration-300 hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white md:hidden"
                aria-label="Search anime"
              >
                <FaSearch size={15} />
              </button>

              {isAuthenticated ? (
                <div ref={profileRef} className="relative hidden md:block">
                  {/* Profile button */}
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className={`group flex items-center gap-2 rounded-2xl border p-1.5 pr-3 transition-all duration-300 ${
                      profileOpen
                        ? "border-purple-500/30 bg-purple-500/10 shadow-lg shadow-purple-900/10"
                        : "border-white/[0.08] bg-white/[0.04] hover:border-white/[0.12] hover:bg-white/[0.07]"
                    }`}
                    aria-expanded={profileOpen}
                    aria-haspopup="menu"
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className="absolute inset-0 rounded-xl bg-purple-500/30 blur-md" />

                      <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 shadow-lg shadow-purple-900/30">
                        <FaUser className="text-[11px] text-white" />
                      </div>

                      {/* Online indicator */}
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-gray-950 bg-emerald-400" />
                    </div>

                    <FaChevronDown
                      className={`text-[9px] text-gray-500 transition-transform duration-300 ${
                        profileOpen ? "rotate-180 text-purple-400" : ""
                      }`}
                    />
                  </button>

                  {/* Profile dropdown */}
                  {profileOpen && (
                    <div
                      className="absolute right-0 top-[calc(100%+12px)] w-64 overflow-hidden rounded-2xl border border-white/[0.09] bg-gray-950/95 shadow-2xl shadow-black/60 backdrop-blur-2xl"
                      role="menu"
                    >
                      {/* Dropdown glow */}
                      <div className="pointer-events-none absolute -top-16 right-0 h-32 w-32 rounded-full bg-purple-600/15 blur-3xl" />

                      {/* Header */}
                      <div className="relative border-b border-white/[0.07] p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-600">
                            <FaUser className="text-sm text-white" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-white">
                              Your Account
                            </p>

                            <div className="mt-0.5 flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              <span className="text-[10px] text-gray-500">
                                Online
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu */}
                      <div className="relative p-2">
                        <NavLink
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 transition-all hover:bg-white/[0.06] hover:text-white"
                          role="menuitem"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 transition-colors group-hover:bg-purple-500/20">
                            <FaUser className="text-[11px]" />
                          </span>

                          <span>Profile</span>
                        </NavLink>

                        <NavLink
                          to="/watchlist"
                          onClick={() => setProfileOpen(false)}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 transition-all hover:bg-white/[0.06] hover:text-white"
                          role="menuitem"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 transition-colors group-hover:bg-purple-500/20">
                            <FaBookmark className="text-[11px]" />
                          </span>

                          <span>My Watchlist</span>
                        </NavLink>

                        <NavLink
                          to="/history"
                          onClick={() => setProfileOpen(false)}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 transition-all hover:bg-white/[0.06] hover:text-white"
                          role="menuitem"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 transition-colors group-hover:bg-purple-500/20">
                            <FaHistory className="text-[11px]" />
                          </span>

                          <span>Watch History</span>
                        </NavLink>

                        <div className="my-2 h-px bg-white/[0.06]" />

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition-all hover:bg-red-500/[0.07] hover:text-red-300"
                          role="menuitem"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/[0.08] transition-colors group-hover:bg-red-500/[0.14]">
                            <FaSignOutAlt className="text-[11px]" />
                          </span>

                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Desktop login */}
                  <Link
                    to="/login"
                    className="hidden rounded-xl px-4 py-2.5 text-[13px] font-medium text-gray-400 transition-all hover:bg-white/[0.04] hover:text-white md:block"
                  >
                    Login
                  </Link>

                  {/* Desktop register */}
                  <Link
                    to="/register"
                    className="group relative hidden overflow-hidden rounded-xl md:block"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-90 transition-opacity group-hover:opacity-100" />

                    <div className="relative flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white">
                      Get Started
                    </div>
                  </Link>

                  {/* Mobile login */}
                  <Link
                    to="/login"
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-[12px] font-semibold text-white shadow-lg shadow-purple-900/20 transition-all duration-300 hover:from-purple-500 hover:to-indigo-500 md:hidden"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu */}
          <MobileMenu
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            isAuthenticated={isAuthenticated}
            onAuthClick={() => {
              setIsOpen(false);
              navigate("/login");
            }}
            onLogout={handleLogout}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearch}
          />
        </div>
      </div>
    </nav>
  );
}
