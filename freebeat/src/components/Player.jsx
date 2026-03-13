import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1,
  Volume2, VolumeX, Volume1, Music, Loader2
} from 'lucide-react';
import { getArtworkUrl } from '../services/audius';

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function VolumeIcon({ isMuted, volume }) {
  if (isMuted || volume === 0) return <VolumeX size={18} />;
  if (volume < 0.5) return <Volume1 size={18} />;
  return <Volume2 size={18} />;
}

export default function Player({
  currentTrack, isPlaying, progress, duration, volume, isMuted,
  isShuffle, repeatMode, isLoading,
  togglePlay, skipNext, skipPrev, seek, setVolume, toggleMute,
  toggleShuffle, cycleRepeat,
}) {
  const artworkUrl = currentTrack ? getArtworkUrl(currentTrack.artwork, '150x150') : null;
  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 z-50"
      style={{ background: 'linear-gradient(to top, #0a0a14, #0f0f1a)', borderTop: '1px solid rgba(168,85,247,0.2)' }}>

      {/* Progress bar - clickable full width */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          seek(pct * duration);
        }}>
        <div className="h-full transition-all duration-100 relative"
          style={{ width: `${progressPct}%`, background: 'linear-gradient(to right, #a855f7, #ec4899)' }}>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="flex items-center h-full px-4 gap-4">
        {/* Track info */}
        <div className="flex items-center gap-3 w-64 min-w-0">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
            style={{ background: '#1a1a2e' }}>
            {artworkUrl ? (
              <img src={artworkUrl} alt="artwork" className="w-full h-full object-cover"
                style={{ animation: isPlaying ? 'spin-slow 8s linear infinite' : undefined, borderRadius: '50%' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music size={20} className="text-purple-500" />
              </div>
            )}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Loader2 size={18} className="text-purple-400 animate-spin" />
              </div>
            )}
          </div>
          {currentTrack ? (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{currentTrack.title}</p>
              <p className="text-xs text-gray-400 truncate">{currentTrack.user?.name || 'Unknown Artist'}</p>
            </div>
          ) : (
            <div className="min-w-0">
              <p className="text-sm text-gray-500">No track selected</p>
              <p className="text-xs text-gray-600">Pick a song to play</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <button onClick={toggleShuffle}
              className={`p-1 rounded transition-colors ${isShuffle ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
              title="Shuffle">
              <Shuffle size={16} />
            </button>
            <button onClick={skipPrev}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Previous">
              <SkipBack size={20} />
            </button>
            <button onClick={togglePlay}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{ background: currentTrack ? 'linear-gradient(135deg, #a855f7, #ec4899)' : '#374151' }}
              title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause size={18} fill="white" className="text-white" />
                : <Play size={18} fill="white" className="text-white ml-0.5" />}
            </button>
            <button onClick={skipNext}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Next">
              <SkipForward size={20} />
            </button>
            <button onClick={cycleRepeat}
              className={`p-1 rounded transition-colors ${repeatMode !== 'none' ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
              title={`Repeat: ${repeatMode}`}>
              {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>
          </div>
          {/* Time */}
          <div className="flex items-center gap-2 text-xs text-gray-500 w-full max-w-sm">
            <span className="w-8 text-right">{formatTime(progress)}</span>
            <div className="flex-1 h-1 bg-gray-700 rounded cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                seek(pct * duration);
              }}>
              <div className="h-full rounded transition-all"
                style={{ width: `${progressPct}%`, background: 'linear-gradient(to right, #a855f7, #ec4899)' }} />
            </div>
            <span className="w-8">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-36">
          <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
            <VolumeIcon isMuted={isMuted} volume={volume} />
          </button>
          <input
            type="range" min={0} max={1} step={0.01} value={isMuted ? 0 : volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1"
            style={{ accentColor: '#a855f7' }}
          />
        </div>
      </div>
    </div>
  );
}
