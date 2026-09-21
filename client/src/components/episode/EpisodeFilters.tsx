import { FiList, FiType } from 'react-icons/fi';

interface EpisodeFiltersProps {
  sortBy: 'number' | 'title';
  onSortChange: (sort: 'number' | 'title') => void;
  filterWatched: boolean;
  onFilterWatchedChange: (filtered: boolean) => void;
}

export function EpisodeFilters({ sortBy, onSortChange, filterWatched, onFilterWatchedChange }: EpisodeFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex rounded-lg bg-gray-800 p-1">
        <button
          onClick={() => onSortChange('number')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            sortBy === 'number' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FiList className="h-4 w-4" />
          Number
        </button>
        <button
          onClick={() => onSortChange('title')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            sortBy === 'title' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FiType className="h-4 w-4" />
          Title
        </button>
      </div>
      <button
        onClick={() => onFilterWatchedChange(!filterWatched)}
        className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors border ${
          filterWatched
            ? 'bg-green-600/20 border-green-500 text-green-400'
            : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
        }`}
      >
        <span>{filterWatched ? 'Watched Only' : 'All Episodes'}</span>
      </button>
    </div>
  );
}
