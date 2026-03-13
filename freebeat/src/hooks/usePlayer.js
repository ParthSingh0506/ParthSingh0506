import { useState, useRef, useEffect, useCallback } from 'react';
import { getStreamUrl } from '../services/audius';

export function usePlayer() {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none' | 'all' | 'one'
  const [isLoading, setIsLoading] = useState(false);

  const audio = audioRef.current;

  useEffect(() => {
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    audio.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDuration = () => setDuration(audio.duration || 0);
    const onEnded = () => handleTrackEnd();
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onDuration);
    audio.addEventListener('durationchange', onDuration);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onDuration);
      audio.removeEventListener('durationchange', onDuration);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [queue, queueIndex, isShuffle, repeatMode]);

  const handleTrackEnd = useCallback(() => {
    if (repeatMode === 'one') {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else if (repeatMode === 'all' || queueIndex < queue.length - 1) {
      skipNext();
    } else {
      setIsPlaying(false);
    }
  }, [queue, queueIndex, repeatMode, isShuffle]);

  const loadAndPlay = useCallback(async (track) => {
    try {
      setIsLoading(true);
      setCurrentTrack(track);
      const url = await getStreamUrl(track.id);
      audio.src = url;
      audio.load();
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Playback error:', err);
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, []);

  const playTrack = useCallback(async (track, tracks = null) => {
    if (tracks) {
      setQueue(tracks);
      const idx = tracks.findIndex(t => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    }
    await loadAndPlay(track);
  }, [loadAndPlay]);

  const togglePlay = useCallback(async () => {
    if (!currentTrack) return;
    if (isPlaying) {
      audio.pause();
    } else {
      await audio.play().catch(() => {});
    }
  }, [currentTrack, isPlaying]);

  const skipNext = useCallback(async () => {
    if (queue.length === 0) return;
    let nextIdx;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = (queueIndex + 1) % queue.length;
    }
    setQueueIndex(nextIdx);
    await loadAndPlay(queue[nextIdx]);
  }, [queue, queueIndex, isShuffle, loadAndPlay]);

  const skipPrev = useCallback(async () => {
    if (queue.length === 0) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    let prevIdx;
    if (isShuffle) {
      prevIdx = Math.floor(Math.random() * queue.length);
    } else {
      prevIdx = (queueIndex - 1 + queue.length) % queue.length;
    }
    setQueueIndex(prevIdx);
    await loadAndPlay(queue[prevIdx]);
  }, [queue, queueIndex, isShuffle, loadAndPlay]);

  const seek = useCallback((time) => {
    audio.currentTime = time;
    setProgress(time);
  }, []);

  const toggleMute = useCallback(() => setIsMuted(m => !m), []);
  const toggleShuffle = useCallback(() => setIsShuffle(s => !s), []);
  const cycleRepeat = useCallback(() => {
    setRepeatMode(m => m === 'none' ? 'all' : m === 'all' ? 'one' : 'none');
  }, []);

  return {
    currentTrack,
    queue,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isLoading,
    playTrack,
    togglePlay,
    skipNext,
    skipPrev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
  };
}
