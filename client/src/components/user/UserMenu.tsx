import { useState, useRef, useEffect } from "react";
import { FaUser, FaListUl, FaHistory, FaCog, FaSignOutAlt, FaSun, FaMoon, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

export interface UserMenuUser {
  username: string;
  avatar?: string;
}

export interface UserMenuProps {
  user: UserMenuUser;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onLogout?: () => void;
}

export function UserMenu({ user, isDarkMode = false, onToggleTheme, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
          {user.username}
        </span>
        <FaChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
         <div className="absolute right-0 mt-2 w-max max-w-[calc(100vw-2rem)] rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.username}</p>
          </div>

          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaUser className="mr-3 h-4 w-4 text-gray-400" />
              Profile
            </Link>
            <Link
              to="/watchlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaListUl className="mr-3 h-4 w-4 text-gray-400" />
              Watchlist
            </Link>
            <Link
              to="/history"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaHistory className="mr-3 h-4 w-4 text-gray-400" />
              Watch History
            </Link>
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaCog className="mr-3 h-4 w-4 text-gray-400" />
              Settings
            </Link>
          </div>

          {onToggleTheme && (
            <div className="border-t border-gray-200 dark:border-gray-700 py-1">
              <button
                onClick={() => {
                  onToggleTheme();
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? (
                  <>
                    <FaSun className="mr-3 h-4 w-4 text-yellow-500" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <FaMoon className="mr-3 h-4 w-4 text-blue-500" />
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          )}

          {onLogout && (
            <div className="border-t border-gray-200 dark:border-gray-700 py-1">
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaSignOutAlt className="mr-3 h-4 w-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
