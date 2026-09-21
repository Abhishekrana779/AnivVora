interface AnimeMetaProps {
  data: Record<string, string | number | undefined>;
}

export function AnimeMeta({ data }: AnimeMetaProps) {
  const entries = Object.entries(data).filter(([, v]) => v !== undefined && v !== '');

  if (entries.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
      {entries.map(([label, value]) => (
        <div key={label}>
          <span className="block text-xs text-gray-500 uppercase tracking-wider">{label}</span>
          <span className="text-sm text-gray-200 font-medium">{value}</span>
        </div>
      ))}
    </div>
  );
}
