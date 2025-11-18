import { useState, useRef, useEffect, useCallback } from "react";
import type { Song } from "../types";

export const useAudioPlayer = (songs: Song[]) => {
  // ===== STATE MANAGEMENT =====
  // Track which song is currently selected
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // Track if audio is playing or paused
  const [isPlaying, setIsPlaying] = useState(false);

  // Track current playback position in seconds
  const [currentTime, setCurrentTime] = useState(0);

  // Track total song length in seconds
  const [duration, setDuration] = useState(0);

  // Track volume level (0.0 to 1.0)
  const [volume, setVolume] = useState(0.7);

  // Track if audio is muted
  const [isMuted, setIsMuted] = useState(false);

  // Track if shuffle mode is enabled
  const [isShuffling, setIsShuffling] = useState(false);

  // Track repeat mode: 'off', 'all', or 'one'
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");

  // ===== REF FOR AUDIO ELEMENT =====
  // useRef creates a reference that persists across renders
  // We use it to access the HTML5 Audio element directly
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get the current song object
  const currentSong = songs[currentSongIndex];

  // ===== PLAYBACK CONTROL FUNCTIONS - DEFINED EARLY FOR DEPENDENCIES =====

  // Skip to next song
  const handleNext = useCallback(() => {
    let nextIndex;

    if (isShuffling) {
      // Random song (but not the current one)
      do {
        nextIndex = Math.floor(Math.random() * songs.length);
      } while (nextIndex === currentSongIndex && songs.length > 1);
    } else {
      // Next song in order
      nextIndex = (currentSongIndex + 1) % songs.length;
    }

    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
  }, [currentSongIndex, isShuffling, songs.length]);

  // Go to previous song
  const handlePrevious = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // If more than 3 seconds in, restart current song
    if (currentTime > 3) {
      audio.currentTime = 0;
    } else {
      // Otherwise go to previous song
      const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      setCurrentSongIndex(prevIndex);
      setIsPlaying(true);
    }
  }, [currentSongIndex, currentTime, songs.length]);

  // ===== INITIALIZE AUDIO ELEMENT =====
  useEffect(() => {
    // Create a new Audio element when hook first runs
    audioRef.current = new Audio();

    // Cleanup function - runs when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []); // Empty array = run once on mount

  // ===== LOAD NEW SONG WHEN INDEX CHANGES =====
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set the audio source to the new song's URL
    audio.src = currentSong.url;

    // Load the audio file
    audio.load();

    // If we were playing before, continue playing
    if (isPlaying) {
      audio.play().catch((err) => {
        console.error("Playback failed:", err);
        setIsPlaying(false);
      });
    }
  }, [currentSongIndex, currentSong.url, isPlaying]); // Run when song changes

  // ===== AUDIO EVENT LISTENERS =====
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Update current time as audio plays
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    // Update duration when audio metadata loads
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    // Handle when song ends
    const handleEnded = () => {
      if (repeatMode === "one") {
        // Repeat same song
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === "all" || currentSongIndex < songs.length - 1) {
        // Go to next song
        handleNext();
      } else {
        // Stop at end of playlist
        setIsPlaying(false);
      }
    };

    // Attach event listeners
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    // Cleanup function - remove listeners when effect re-runs or unmounts
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [repeatMode, currentSongIndex, songs.length, handleNext]); // Re-run when these change

  // ===== VOLUME CONTROL =====
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set audio element's volume (0.0 to 1.0)
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ===== REMAINING PLAYBACK CONTROL FUNCTIONS =====

  // Toggle between play and pause
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((err) => {
        console.error("Playback failed:", err);
      });
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Seek to specific time in song
  const handleSeek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  // Change volume level
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(false);
  }, []);

  // Toggle mute on/off
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Toggle shuffle mode
  const toggleShuffle = useCallback(() => {
    setIsShuffling((prev) => !prev);
  }, []);

  // Cycle through repeat modes
  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      const modes: Array<"off" | "all" | "one"> = ["off", "all", "one"];
      const currentIndex = modes.indexOf(prev);
      return modes[(currentIndex + 1) % modes.length];
    });
  }, []);

  // Select a specific song from playlist
  const selectSong = useCallback((index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  }, []);

  // ===== RETURN VALUES =====
  // Everything we return can be used by components
  return {
    // Current state
    currentSong,
    currentSongIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffling,
    repeatMode,

    // Control functions
    togglePlay,
    handleNext,
    handlePrevious,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    selectSong,
  };
};
