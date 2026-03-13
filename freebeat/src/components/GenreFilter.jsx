import { GENRES } from '../services/audius';

export default function GenreFilter({ selected, onChange }) {
  const genres = GENRES.slice(0, 12); // Show top genres

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {genres.map(genre => (
        <button
          key={genre}
          onClick={() => onChange(genre === 'All' ? '' : genre)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
            (genre === 'All' && !selected) || genre === selected
              ? 'text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          style={
            (genre === 'All' && !selected) || genre === selected
              ? { background: 'linear-gradient(135deg, #a855f7, #ec4899)' }
              : { background: 'rgba(255,255,255,0.06)' }
          }
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
