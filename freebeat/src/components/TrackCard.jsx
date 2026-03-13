import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react';
import { getArtworkUrl } from '../services/audius';

function formatDuration(secs) {
  if (!secs) return '';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatPlays(plays) {
  if (!plays) return '';
  if (plays >= 1_000_000) return `${(plays / 1_000_000).toFixed(1)}M`;
  if (plays >= 1_000) return `${(plays / 1_000).toFixed(0)}K`;
  return plays.toString();
}

export default function TrackCard({ track, index, isPlaying, isCurrentTrack, onPlay }) {
  const artwork = getArtworkUrl(track.artwork, '150x150');

  return (
    <div
      className={`track-card flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer group ${
        isCurrentTrack
          ? 'bg-purple-900/30 border border-purple-700/40'
          : 'hover:bg-white/5'
      }`}
      onClick={() => onPlay(track)}
    >
      {/* Index / Playing indicator */}
      <div className="w-6 text-center flex-shrink-0">
        {isCurrentTrack && isPlaying ? (
          <div className="flex items-end justify-center gap-0.5 h-4">
            <span className="wave-bar" />
            <span className="wave-bar" />
            <span className="wave-bar" />
            <span className="wave-bar" />
          </div>
        ) : (
          <>
            <span className={`text-sm group-hover:hidden ${isCurrentTrack ? 'text-purple-400' : 'text-gray-500'}`}>
              {index + 1}
            </span>
            <Play
              size={14}
              className="hidden group-hover:block text-white mx-auto"
              fill="white"
            />
          </>
        )}
      </div>

      {/* Artwork */}
      <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 relative">
        {artwork ? (
          <img src={artwork} alt={track.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
            <span className="text-white text-xs font-bold">
              {track.title?.[0] || '?'}
            </span>
          </div>
        )}
        {isCurrentTrack && isPlaying && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Pause size={12} className="text-white" fill="white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isCurrentTrack ? 'text-purple-300' : 'text-white'}`}>
          {track.title}
        </p>
        <p className="text-xs text-gray-500 truncate">{track.user?.name}</p>
      </div>

      {/* Genre badge */}
      {track.genre && (
        <span className="hidden sm:block text-xs text-gray-600 px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          {track.genre}
        </span>
      )}

      {/* Plays */}
      {track.play_count > 0 && (
        <span className="text-xs text-gray-600 w-12 text-right flex-shrink-0 hidden sm:block">
          {formatPlays(track.play_count)}
        </span>
      )}

      {/* Duration */}
      <span className="text-xs text-gray-500 w-10 text-right flex-shrink-0">
        {formatDuration(track.duration)}
      </span>
    </div>
  );
}
