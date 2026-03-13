import { Loader2 } from 'lucide-react';
import TrackCard from './TrackCard';

export default function TrackList({ tracks, currentTrack, isPlaying, isLoading, onPlay, title, subtitle }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(168,85,247,0.2)' }}>
          <Loader2 size={24} className="text-purple-400 animate-spin" />
        </div>
        <p className="text-gray-500 text-sm">Loading tracks...</p>
      </div>
    );
  }

  if (!tracks || tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="text-5xl">🎵</div>
        <p className="text-gray-400 font-medium">No tracks found</p>
        <p className="text-gray-600 text-sm">Try a different search or genre</p>
      </div>
    );
  }

  return (
    <div>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {/* Column headers */}
      <div className="flex items-center gap-3 px-4 py-1.5 mb-1">
        <span className="w-6 text-center text-xs text-gray-600">#</span>
        <span className="w-10" />
        <span className="flex-1 text-xs text-gray-600 font-medium uppercase tracking-wider">Title</span>
        <span className="hidden sm:block text-xs text-gray-600 font-medium uppercase tracking-wider w-24">Genre</span>
        <span className="hidden sm:block text-xs text-gray-600 font-medium uppercase tracking-wider w-12 text-right">Plays</span>
        <span className="text-xs text-gray-600 font-medium uppercase tracking-wider w-10 text-right">Time</span>
      </div>
      <div className="space-y-0.5">
        {tracks.map((track, index) => (
          <TrackCard
            key={track.id}
            track={track}
            index={index}
            isCurrentTrack={currentTrack?.id === track.id}
            isPlaying={isPlaying && currentTrack?.id === track.id}
            onPlay={(t) => onPlay(t, tracks)}
          />
        ))}
      </div>
    </div>
  );
}
