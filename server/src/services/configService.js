const animeTypes = [
  { value: 'TV', label: 'TV Series' },
  { value: 'OVA', label: 'OVA' },
  { value: 'ONA', label: 'ONA' },
  { value: 'Movie', label: 'Movie' },
  { value: 'Special', label: 'Special' },
  { value: 'Music', label: 'Music' },
];

const animeStatuses = [
  { value: 'Currently_Airing', label: 'Currently Airing' },
  { value: 'Finished_Airing', label: 'Finished Airing' },
  { value: 'Not_Yet_Aired', label: 'Not Yet Aired' },
];

const servers = [
  { id: 'vidstreaming', name: 'Vidstreaming', url: '' },
  { id: 'mixdrop', name: 'MixDrop', url: '' },
  { id: 'streamtape', name: 'StreamTape', url: '' },
  { id: 'mp4upload', name: 'MP4Upload', url: '' },
];

const subtitleLangs = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: 'Japanese' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
];

const videoQualities = [
  { value: 'auto', label: 'Auto' },
  { value: '1080p', label: '1080p' },
  { value: '720p', label: '720p' },
  { value: '480p', label: '480p' },
  { value: '360p', label: '360p' },
];

const watchlistStatuses = ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'];

const scheduleDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const about = {
  features: [
    'Browse thousands of anime titles',
    'Watch anime with multiple servers',
    'Create and manage your watchlist',
    'Track your watch history',
    'Discover anime by genre',
    'Get personalized recommendations',
    'Customize your viewing experience',
    'Multi-language subtitle support',
  ],
  techStack: [
    { name: 'React', description: 'Frontend UI Library' },
    { name: 'TypeScript', description: 'Type-safe JavaScript' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS' },
    { name: 'React Router', description: 'Client-side routing' },
    { name: 'Node.js', description: 'Backend runtime' },
    { name: 'Express', description: 'Backend framework' },
    { name: 'MongoDB', description: 'NoSQL database' },
    { name: 'Vite', description: 'Build tool' },
  ],
  team: [
    { name: 'Abhi', role: 'Full Stack Developer', github: '#' },
    { name: 'Team Member 2', role: 'Frontend Developer', github: '#' },
    { name: 'Team Member 3', role: 'Backend Developer', github: '#' },
  ],
};

exports.getAnimeTypes = async () => animeTypes;
exports.getAnimeStatuses = async () => animeStatuses;
exports.getServers = async () => servers;
exports.getSubtitleLangs = async () => subtitleLangs;
exports.getVideoQualities = async () => videoQualities;
exports.getWatchlistStatuses = async () => watchlistStatuses;
exports.getScheduleDays = async () => scheduleDays;
exports.getAbout = async () => about;
