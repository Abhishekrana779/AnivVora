import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import {
  FiX,
  
  FiHome,
  
  FiCalendar,
  FiBookmark,
  FiClock,
  FiLogIn,
  FiLogOut,
  FiUser,
  
  
  FiChevronRight,
  FiPlay,
  FiSearch,
  
} from "react-icons/fi";
// import { useTheme } from "../../context/ThemeContext";

const navLinks = [
  {
    to: "/",
    label: "Home",
    icon: FiHome,
  },
  {
    to: "/search",
    label: "Browse",
    icon: FiPlay,
  },
  {
    to: "/schedule",
    label: "Schedule",
    icon: FiCalendar,
  },
  {
    to: "/watchlist",
    label: "Watchlist",
    icon: FiBookmark,
  },
  {
    to: "/history",
    label: "History",
    icon: FiClock,
  },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
  onAuthClick?: () => void;
  onLogout?: () => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  isAuthenticated = false,
  onAuthClick,
  onLogout,
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
}: MobileMenuProps) {
  const location = useLocation();
  // const { theme, resolvedTheme, toggleTheme } = useTheme();

  const drawerRef = useRef<HTMLElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const scrollYRef = useRef(0);

  // const displayTheme = theme === "system" ? resolvedTheme : theme;

  /*
   * Lock background scrolling
   */
  useEffect(() => {
    if (!isOpen) return;

    scrollYRef.current = window.scrollY;

    const body = document.body;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollYRef.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.overflow = "";
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";

      window.scrollTo(0, scrollYRef.current);
    };
  }, [isOpen]);

  /*
   * Close menu when route changes
   */
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  /*
   * Close on Escape
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  /*
   * Focus management + focus trap
   */
  useEffect(() => {
    if (!isOpen) return;

    const drawer = drawerRef.current;

    if (!drawer) return;

    previousActiveElementRef.current =
      document.activeElement as HTMLElement | null;

    const focusableSelector = `
      a[href],
      button:not([disabled]),
      input:not([disabled]),
      [tabindex]:not([tabindex="-1"])
    `;

    const getFocusableElements = () =>
      Array.from(
        drawer.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter((element) => {
        return (
          element.offsetWidth > 0 ||
          element.offsetHeight > 0 ||
          element === document.activeElement
        );
      });

    const focusableElements = getFocusableElements();

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      drawer.focus();
    }

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const elements = getFocusableElements();

      if (elements.length === 0) return;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (event.shiftKey) {
        if (
          document.activeElement === firstElement ||
          !drawer.contains(document.activeElement)
        ) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (
          document.activeElement === lastElement ||
          !drawer.contains(document.activeElement)
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    drawer.addEventListener("keydown", handleTab);

    return () => {
      drawer.removeEventListener("keydown", handleTab);

      const previousElement =
        previousActiveElementRef.current;

      if (
        previousElement &&
        typeof previousElement.focus === "function"
      ) {
        previousElement.focus();
      }
    };
  }, [isOpen]);

  /*
   * IMPORTANT:
   * Render outside Navbar using a React Portal.
   * This prevents backdrop-blur / stacking-context issues.
   */
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      id="mobile-menu"
      className={`fixed inset-0 z-[99999] md:hidden ${
        isOpen
          ? "visible pointer-events-auto"
          : "invisible pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      {/* ================= BACKDROP ================= */}
      <div
        className={`absolute inset-0 bg-black/75 backdrop-blur-[3px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ================= DRAWER ================= */}
      <aside
        ref={drawerRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        tabIndex={-1}
        className={`relative flex h-[100dvh] w-[88%] max-w-[380px] flex-col overflow-hidden border-r border-white/[0.08] bg-gray-950 shadow-[20px_0_80px_rgba(0,0,0,0.65)] transition-transform duration-300 ease-out ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* ================= DECORATIVE GLOW ================= */}

        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-purple-600/20 blur-[90px]" />

        <div className="pointer-events-none absolute -right-32 top-1/3 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px]" />

        <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-indigo-600/10 blur-[90px]" />

        {/* ================= HEADER ================= */}

        <div className="relative flex shrink-0 items-center justify-between border-b border-white/[0.07] bg-gray-950/90 px-5 py-4">
          <Link
            to="/"
            onClick={onClose}
            className="group flex items-center gap-3"
          >
            {/* Logo */}
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-purple-600/40 blur-xl transition-opacity duration-300 group-hover:opacity-80" />

              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 shadow-xl shadow-purple-900/30">
                <img
                  src="/favicon.png"
                  alt="AniVora"
                  className="h-9 w-9 object-contain"
                />
              </div>
            </div>

            {/* Brand */}
            <div>
              <div className="text-xl font-black tracking-tight text-white">
                Ani<span className="text-purple-400">Vora</span>
              </div>

              <div className="text-[9px] uppercase tracking-[0.3em] text-gray-500">
                Anime Streaming
              </div>
            </div>
          </Link>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] text-gray-400 transition-all duration-300 hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white"
            aria-label="Close menu"
            aria-controls="mobile-navigation"
          >
            <FiX className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {/* ================= PROFILE ================= */}

        {isAuthenticated && (
          <div className="relative shrink-0 px-4 pt-4">
            <Link
              to="/profile"
              onClick={onClose}
              className="group relative block overflow-hidden rounded-2xl border border-purple-500/15 bg-gradient-to-br from-purple-600/15 via-indigo-600/10 to-blue-600/10 transition-all duration-300 hover:border-purple-500/30"
            >
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl" />

              <div className="relative flex items-center gap-3 p-4">
                <div className="relative shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 shadow-lg shadow-purple-900/30">
                    <FiUser className="h-6 w-6 text-white" />
                  </div>

                  <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-gray-950 bg-emerald-500" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">
                    My Profile
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Manage your account
                  </p>
                </div>

                <FiChevronRight className="h-4 w-4 text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-purple-400" />
              </div>
            </Link>
          </div>
        )}

        {/* ================= SCROLL CONTENT ================= */}

        <nav className="relative min-h-0 flex-1 overflow-y-auto px-4 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Search */}
          {onSearchSubmit && (
            <form
              onSubmit={onSearchSubmit}
              className="mb-6"
            >
              <label
                htmlFor="mobile-anime-search"
                className="sr-only"
              >
                Search anime
              </label>

              <div className="group relative">
                <FiSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-purple-400" />

                <input
                  id="mobile-anime-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    onSearchChange?.(
                      event.target.value
                    )
                  }
                  placeholder="Search anime, characters..."
                  autoComplete="off"
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.045] pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-500 focus:border-purple-500/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-purple-500/10"
                />
              </div>
            </form>
          )}

          {/* Section title */}
          <div className="mb-3 flex items-center gap-3 px-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600">
              Explore
            </span>

            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {/* Navigation */}
          <div className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;

              const isActive =
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(
                      link.to
                    );

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  aria-current={
                    isActive ? "page" : undefined
                  }
                  className={`group relative flex items-center gap-3.5 rounded-2xl px-3.5 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500/15 to-indigo-500/10 text-white"
                      : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-purple-400 to-indigo-500 shadow-lg shadow-purple-500/40" />
                  )}

                  {/* Icon */}
                  <div
                    className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                      isActive
                        ? "bg-purple-500/15 text-purple-400 shadow-inner"
                        : "bg-white/[0.035] text-gray-500 group-hover:bg-white/[0.07] group-hover:text-purple-400"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </div>

                  {/* Label */}
                  <span className="flex-1 text-sm font-semibold">
                    {link.label}
                  </span>

                  {/* Right icon */}
                  {isActive ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                  ) : (
                    <FiChevronRight className="h-4 w-4 text-gray-700 transition-all group-hover:translate-x-0.5 group-hover:text-gray-500" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ================= BOTTOM ================= */}

        <div className="relative shrink-0 space-y-2 border-t border-white/[0.07] bg-gray-950/95 px-4 py-4">
          

          {/* Authentication */}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                onLogout?.();
                onClose();
              }}
              className="group flex w-full items-center gap-3.5 rounded-xl border border-red-500/[0.07] bg-red-500/[0.035] px-3.5 py-3 text-sm font-medium text-red-400 transition-all hover:border-red-500/[0.15] hover:bg-red-500/[0.08]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/[0.08]">
                <FiLogOut className="h-[17px] w-[17px]" />
              </div>

              <span className="flex-1 text-left">
                Logout
              </span>

              <FiChevronRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onAuthClick?.();
                onClose();
              }}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-900/30 transition-all duration-300 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500"
            >
              <div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />

              <FiLogIn className="relative h-5 w-5" />

              <span className="relative">
                Login
              </span>
            </button>
          )}
        </div>
      </aside>
    </div>,
    document.body
  );
}