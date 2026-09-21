import { useState, useEffect, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';

interface EpisodeSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function EpisodeSearch({ onSearch, placeholder = 'Search episodes...', debounceMs = 300 }: EpisodeSearchProps) {
  const [query, setQuery] = useState('');

  const debouncedSearch = useCallback(
    (value: string) => {
      const timeout = setTimeout(() => {
        onSearch(value);
      }, debounceMs);
      return () => clearTimeout(timeout);
    },
    [onSearch, debounceMs]
  );

  useEffect(() => {
    const cleanup = debouncedSearch(query);
    return cleanup;
  }, [query, debouncedSearch]);

  return (
    <div className="relative">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-gray-800 pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
      />
    </div>
  );
}
