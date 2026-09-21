import { useState } from "react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  icon?: React.ReactNode;
  dismissible?: boolean;
}

export function ErrorMessage({
  message,
  onRetry,
  icon,
  dismissible = false,
}: ErrorMessageProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/30"
      role="alert"
    >
      <span className="mt-0.5 shrink-0 text-red-600 dark:text-red-400">
        {icon ?? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        )}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-red-800 dark:text-red-200">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-red-700 underline hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
          >
            Retry
          </button>
        )}
      </div>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300"
          aria-label="Dismiss error"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
