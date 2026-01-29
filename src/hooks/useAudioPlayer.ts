import { useState, useRef, useEffect, useCallback } from "react";
import type { Song } from "../types";

const STORAGE_KEY = "music-player-settings";

interface SavedSettings {
  volume: number;
  isShuffling: boolean;
  repeatMode: "off" | "all" | "one";
  lastSongIndex: number;
  favorites: number[];
}

export const useAudioPlayer = (songs: Song[]) => {
  // ===== STATE MANAGEMENT =====
  
  // Initialize state from local storage or defaults
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  
  // Favorites state
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load settings on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: SavedSettings = JSON.parse(saved);
        setVolume(parsed.volume ?? 0.7);
        setIsShuffling(parsed.isShuffling ?? false);
        setRepeatMode(parsed.repeatMode ?? "off");
        setFavorites(parsed.favorites ?? []);
        
        // Only valid index
        if (parsed.lastSongIndex >= 0 && parsed.lastSongIndex < songs.length) {
          setCurrentSongIndex(parsed.lastSongIndex);
        }
      }
    } catch (e) {
      console.warn("Failed to load settings from local storage:", e);
    }
  }, [songs.length]);

  // Save settings when they change
  useEffect(() => {
    const settings: SavedSettings = {
      volume,
      isShuffling,
      repeatMode,
      lastSongIndex: currentSongIndex,
      favorites,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [volume, isShuffling, repeatMode, currentSongIndex, favorites]);

  // ===== REF FOR AUDIO ELEMENT =====
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get the current song object
  const currentSong = songs[currentSongIndex];

  // ===== PLAYBACK CONTROL FUNCTIONS =====

  const handleNext = useCallback(() => {
    let nextIndex;

    if (isShuffling) {
      do {
        nextIndex = Math.floor(Math.random() * songs.length);
      } while (nextIndex === currentSongIndex && songs.length > 1);
    } else {
      nextIndex = (currentSongIndex + 1) % songs.length;
    }

    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
  }, [currentSongIndex, isShuffling, songs.length]);

  const handlePrevious = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTime > 3) {
      audio.currentTime = 0;
    } else {
      const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      setCurrentSongIndex(prevIndex);
      setIsPlaying(true);
    }
  }, [currentSongIndex, currentTime, songs.length]);

  // ===== INITIALIZE AUDIO ELEMENT =====
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // ===== LOAD NEW SONG =====
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentSong.url;
    audio.load();

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error("Playback failed:", err);
        setIsPlaying(false);
      });
    }
  }, [currentSongIndex, currentSong.url, isPlaying]);

  // ===== AUDIO EVENT LISTENERS =====
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === "all" || currentSongIndex < songs.length - 1) {
        handleNext();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [repeatMode, currentSongIndex, songs.length, handleNext]);

  // ===== VOLUME CONTROL =====
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ===== CONTROLS =====
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((err) => console.error("Playback failed:", err));
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleSeek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => setIsMuted((prev) => !prev), []);
  const toggleShuffle = useCallback(() => setIsShuffling((prev) => !prev), []);
  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      const modes: Array<"off" | "all" | "one"> = ["off", "all", "one"];
      const currentIndex = modes.indexOf(prev);
      return modes[(currentIndex + 1) % modes.length];
    });
  }, []);

  const selectSong = useCallback((index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  }, []);

  // Use ID for favorites to be robust against reordering
  const toggleFavorite = useCallback((songId: number) => {
    setFavorites(prev => {
      if (prev.includes(songId)) {
        return prev.filter(id => id !== songId);
      }
      return [...prev, songId];
    });
  }, []);

  const isFavorite = useCallback((songId: number) => favorites.includes(songId), [favorites]);

  return {
    currentSong,
    currentSongIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffling,
    repeatMode,
    favorites, // New
    togglePlay,
    handleNext,
    handlePrevious,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    selectSong,
    toggleFavorite, // New
    isFavorite, // New
  };
};
