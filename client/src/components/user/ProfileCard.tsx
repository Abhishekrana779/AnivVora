import { FaEdit, FaCalendarAlt, FaBookmark, FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  watchlistCount: number;
  historyCount: number;
  joinedAt: string;
}

export interface ProfileCardProps {
  user: UserProfile;
  onEditProfile?: () => void;
}

export function ProfileCard({ user, onEditProfile }: ProfileCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600" />

        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.username}</h2>
              <p className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
                <span className="mr-2">{user.email}</span>
              </p>
            </div>
            {onEditProfile && (
              <button
                onClick={onEditProfile}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <FaEdit className="mr-2 h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 mb-1">
                <FaBookmark className="h-5 w-5 mr-2" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{user.watchlistCount}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Watchlist</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center text-purple-600 dark:text-purple-400 mb-1">
                <FaHistory className="h-5 w-5 mr-2" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{user.historyCount}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Watched</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center text-green-600 dark:text-green-400 mb-1">
                <FaCalendarAlt className="h-5 w-5 mr-2" />
              </div>
              <p className="text-sm text-gray-900 dark:text-white font-medium mt-2">Joined</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{formatDate(user.joinedAt)}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <Link
              to="/watchlist"
              className="flex-1 text-center py-2.5 px-4 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              View Watchlist
            </Link>
            <Link
              to="/history"
              className="flex-1 text-center py-2.5 px-4 rounded-lg text-sm font-medium text-purple-600 dark:text-purple-400 border border-purple-600 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
            >
              View History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
