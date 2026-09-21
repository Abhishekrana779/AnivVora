import { Link } from 'react-router-dom';

interface GenreListProps {
  genres: string[];
  activeGenre?: string;
  onGenreClick?: (genre: string) => void;
}

export function GenreList({ genres, activeGenre, onGenreClick }: GenreListProps) {
  if (!genres || genres.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => {
        const isActive = activeGenre === genre;
        if (onGenreClick) {
          return (
            <button
              key={genre}
              onClick={() => onGenreClick(genre)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {genre}
            </button>
          );
        }
        return (
          <Link
            key={genre}
            to={`/genre/${encodeURIComponent(genre)}`}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {genre}
          </Link>
        );
      })}
    </div>
  );
}
