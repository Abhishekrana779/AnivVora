import { FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";

export interface SocialLoginProps {
  onGoogleLogin?: () => void;
  onGitHubLogin?: () => void;
  onTwitterLogin?: () => void;
}

export function SocialLogin({ onGoogleLogin, onGitHubLogin, onTwitterLogin }: SocialLoginProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onGoogleLogin}
          className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <FaGoogle className="h-5 w-5 text-red-500" />
        </button>
        <button
          onClick={onGitHubLogin}
          className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <FaGithub className="h-5 w-5 text-gray-900 dark:text-white" />
        </button>
        <button
          onClick={onTwitterLogin}
          className="flex items-center justify-center py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <FaTwitter className="h-5 w-5 text-sky-500" />
        </button>
      </div>
    </div>
  );
}
