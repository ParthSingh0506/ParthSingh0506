import { Play, ListMusic } from 'lucide-react';
import { getArtworkUrl } from '../services/audius';

export default function PlaylistGrid({ playlists, onSelect, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl animate-pulse"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="aspect-square rounded-t-xl" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="p-3 space-y-2">
              <div className="h-3 rounded" style={{ background: 'rgba(255,255,255,0.08)', width: '70%' }} />
              <div className="h-2 rounded" style={{ background: 'rgba(255,255,255,0.05)', width: '50%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!playlists || playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <ListMusic size={48} className="text-gray-700" />
        <p className="text-gray-500">No playlists found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {playlists.map(playlist => {
        const art = getArtworkUrl(playlist.artwork, '480x480');
        return (
          <button
            key={playlist.id}
            onClick={() => onSelect(playlist)}
            className="text-left rounded-xl overflow-hidden group transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="aspect-square relative overflow-hidden">
              {art ? (
                <img src={art} alt={playlist.playlist_name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #be185d)' }}>
                  <ListMusic size={40} className="text-white/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
                  <Play size={20} className="text-white ml-0.5" fill="white" />
                </div>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-white truncate">{playlist.playlist_name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{playlist.user?.name}</p>
              {playlist.track_count && (
                <p className="text-xs text-gray-600 mt-1">{playlist.track_count} tracks</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
