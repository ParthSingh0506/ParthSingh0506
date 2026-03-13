import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import TrackList from './components/TrackList';
import SearchBar from './components/SearchBar';
import GenreFilter from './components/GenreFilter';
import PlaylistGrid from './components/PlaylistGrid';
import { usePlayer } from './hooks/usePlayer';
import {
  getTrendingTracks, searchTracks, getTrendingPlaylists,
  getPlaylistTracks
} from './services/audius';
import { TrendingUp, ListMusic, ChevronLeft, Radio } from 'lucide-react';
import './index.css';

// Free internet radio stations (SomaFM - 100% free, listener supported)
const RADIO_STATIONS = [
  { id: 'r1', name: 'Groove Salad', genre: 'Ambient / Chill', url: 'https://ice3.somafm.com/groovesalad-256-mp3', color: '#10b981' },
  { id: 'r2', name: 'Drone Zone',   genre: 'Ambient',         url: 'https://ice3.somafm.com/dronezone-256-mp3',  color: '#6366f1' },
  { id: 'r3', name: 'Indie Pop Rocks', genre: 'Indie Pop',    url: 'https://ice3.somafm.com/indiepop-256-mp3',   color: '#ec4899' },
  { id: 'r4', name: 'Beat Blender', genre: 'Electronic',      url: 'https://ice3.somafm.com/beatblender-256-mp3',color: '#f59e0b' },
  { id: 'r5', name: 'Deep Space One',genre: 'Space Electronic',url: 'https://ice3.somafm.com/deepspaceone-256-mp3',color:'#8b5cf6'},
  { id: 'r6', name: 'Jazz & Blues', genre: 'Jazz',            url: 'https://ice3.somafm.com/jazzandblues-256-mp3',color:'#f97316'},
  { id: 'r7', name: 'Lush',         genre: 'Electronic',      url: 'https://ice3.somafm.com/lush-256-mp3',       color: '#14b8a6' },
  { id: 'r8', name: 'Suburbs of Goa',genre: 'World',          url: 'https://ice3.somafm.com/suburbsofgoa-256-mp3',color:'#ef4444'},
];

export default function App() {
  const [view, setView] = useState('trending');
  const [tracks, setTracks] = useState([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [genre, setGenre] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const radioAudioRef = useRef(null);
  const [radioActive, setRadioActive] = useState(null);
  const [radioPlaying, setRadioPlaying] = useState(false);

  const player = usePlayer();

  // Load trending on mount and when genre changes
  useEffect(() => {
    if (view === 'trending') {
      loadTrending(genre);
    }
  }, [view, genre]);

  const loadTrending = async (g) => {
    setIsLoadingTracks(true);
    try {
      const data = await getTrendingTracks(g, 25);
      setTracks(data);
    } catch (err) {
      console.error('Failed to load trending:', err);
    } finally {
      setIsLoadingTracks(false);
    }
  };

  const handleSearch = useCallback(async (q) => {
    setSearchQuery(q);
    if (!q) { setTracks([]); return; }
    setIsLoadingTracks(true);
    try {
      const data = await searchTracks(q, 30);
      setTracks(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsLoadingTracks(false);
    }
  }, []);

  const handleNavigate = (v) => {
    setView(v);
    setSelectedPlaylist(null);
    if (v === 'playlists' && playlists.length === 0) {
      loadPlaylists();
    }
  };

  const loadPlaylists = async () => {
    setIsLoadingPlaylists(true);
    try {
      const data = await getTrendingPlaylists(20);
      setPlaylists(data);
    } catch (err) {
      console.error('Failed to load playlists:', err);
    } finally {
      setIsLoadingPlaylists(false);
    }
  };

  const handleSelectPlaylist = async (playlist) => {
    setSelectedPlaylist(playlist);
    setIsLoadingTracks(true);
    try {
      const data = await getPlaylistTracks(playlist.id);
      setPlaylistTracks(data);
    } catch (err) {
      console.error('Failed to load playlist tracks:', err);
    } finally {
      setIsLoadingTracks(false);
    }
  };

  const [playlistTracks, setPlaylistTracks] = useState([]);

  const handleRadioPlay = (station) => {
    if (radioActive?.id === station.id) {
      if (radioPlaying) {
        radioAudioRef.current?.pause();
        setRadioPlaying(false);
      } else {
        radioAudioRef.current?.play();
        setRadioPlaying(true);
      }
      return;
    }
    // Stop any current Audius track
    if (radioAudioRef.current) {
      radioAudioRef.current.pause();
    }
    const audio = new Audio(station.url);
    audio.volume = player.volume;
    radioAudioRef.current = audio;
    audio.play().catch(console.error);
    setRadioActive(station);
    setRadioPlaying(true);
    audio.onpause = () => setRadioPlaying(false);
    audio.onplay = () => setRadioPlaying(true);
    audio.onerror = () => setRadioPlaying(false);
  };

  const renderContent = () => {
    switch (view) {
      case 'trending':
        return (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(168,85,247,0.2)' }}>
                <TrendingUp size={18} className="text-purple-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Trending Now</h1>
                <p className="text-xs text-gray-500">Top tracks on Audius right now</p>
              </div>
            </div>
            <GenreFilter selected={genre} onChange={setGenre} />
            <TrackList
              tracks={tracks}
              currentTrack={player.currentTrack}
              isPlaying={player.isPlaying}
              isLoading={isLoadingTracks}
              onPlay={player.playTrack}
            />
          </div>
        );

      case 'search':
        return (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">Search</h1>
              <p className="text-xs text-gray-500">Find your favorite artists and tracks</p>
            </div>
            <SearchBar onSearch={handleSearch} />
            {searchQuery ? (
              <TrackList
                tracks={tracks}
                currentTrack={player.currentTrack}
                isPlaying={player.isPlaying}
                isLoading={isLoadingTracks}
                onPlay={player.playTrack}
                title={`Results for "${searchQuery}"`}
                subtitle={`${tracks.length} tracks found`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <div className="text-5xl">🔍</div>
                <p className="text-gray-400 font-medium">Search for any music</p>
                <p className="text-gray-600 text-sm max-w-xs">
                  Access millions of tracks from independent artists worldwide — completely free
                </p>
              </div>
            )}
          </div>
        );

      case 'playlists':
        if (selectedPlaylist) {
          return (
            <div className="flex flex-col gap-5">
              <button
                onClick={() => setSelectedPlaylist(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm w-fit"
              >
                <ChevronLeft size={18} /> Back to Playlists
              </button>
              <TrackList
                tracks={playlistTracks}
                currentTrack={player.currentTrack}
                isPlaying={player.isPlaying}
                isLoading={isLoadingTracks}
                onPlay={player.playTrack}
                title={selectedPlaylist.playlist_name}
                subtitle={`by ${selectedPlaylist.user?.name}`}
              />
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(168,85,247,0.2)' }}>
                <ListMusic size={18} className="text-purple-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Trending Playlists</h1>
                <p className="text-xs text-gray-500">Curated collections you'll love</p>
              </div>
            </div>
            <PlaylistGrid
              playlists={playlists}
              onSelect={handleSelectPlaylist}
              isLoading={isLoadingPlaylists}
            />
          </div>
        );

      case 'radio':
        return (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(168,85,247,0.2)' }}>
                <Radio size={18} className="text-purple-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Free Radio</h1>
                <p className="text-xs text-gray-500">SomaFM internet radio — listener supported, always free</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RADIO_STATIONS.map(station => (
                <RadioStation
                  key={station.id}
                  station={station}
                  isActive={radioActive?.id === station.id}
                  isPlaying={radioActive?.id === station.id && radioPlaying}
                  onPlay={() => handleRadioPlay(station)}
                />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen" style={{ background: '#0f0f1a' }}>
      <Sidebar currentView={view} onNavigate={handleNavigate} />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-24" style={{ background: '#0f0f1a' }}>
        {/* Ambient gradient top-right */}
        <div className="fixed top-0 right-0 w-96 h-96 opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)', zIndex: 0 }} />

        <div className="relative z-10 px-6 pt-6">
          {renderContent()}
        </div>
      </div>

      {/* Player bar */}
      <Player {...player} />
    </div>
  );
}

// Radio station card component
function RadioStation({ station, isActive, isPlaying, onPlay }) {
  return (
    <button
      onClick={onPlay}
      className="flex items-center gap-4 p-4 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] w-full"
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${station.color}22, rgba(168,85,247,0.1))`
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isActive ? station.color + '50' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: station.color + '25' }}>
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-6">
            {[0, 1, 2, 3].map(i => (
              <span key={i} className="wave-bar" style={{ background: station.color }} />
            ))}
          </div>
        ) : (
          <Radio size={22} style={{ color: station.color }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
          {station.name}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{station.genre}</p>
        {isActive && (
          <p className="text-xs font-medium mt-1" style={{ color: station.color }}>
            {isPlaying ? '● LIVE' : '○ Paused'}
          </p>
        )}
      </div>
      {!isActive && (
        <span className="text-xs text-gray-600 px-2 py-1 rounded-full flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          SomaFM
        </span>
      )}
    </button>
  );
}
