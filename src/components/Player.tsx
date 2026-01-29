import React, { useEffect } from "react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import type { Song } from "../types";
import { Controls } from "./Controls";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { Playlist } from "./Playlist";
import { Heart } from "lucide-react";

interface PlayerProps {
  songs: Song[]; // Array of songs to play
}

export const Player: React.FC<PlayerProps> = ({ songs }) => {
  // Use our custom hook to get all player state and functions
  const {
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
  } = useAudioPlayer(songs);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault(); // Prevent scrolling
          togglePlay();
          break;
        case "ArrowRight":
          e.preventDefault();
          handleSeek(Math.min(currentTime + 5, duration));
          break;
        case "ArrowLeft":
          e.preventDefault();
          handleSeek(Math.max(currentTime - 5, 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          handleVolumeChange(Math.min(volume + 0.1, 1));
          break;
        case "ArrowDown":
          e.preventDefault();
          handleVolumeChange(Math.max(volume - 0.1, 0));
          break;
        case "KeyM":
          toggleMute();
          break;
        case "KeyL": // Added bonus: Like toggle shortcut
          toggleFavorite(currentSong.id);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    togglePlay, 
    currentTime, 
    duration, 
    handleSeek, 
    volume, 
    handleVolumeChange, 
    toggleMute, 
    toggleFavorite, 
    currentSong.id
  ]);

  const isCurrentFavorite = isFavorite(currentSong.id);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main Player Card - Glassmorphism Effect */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* ===== ALBUM ART & SONG INFO ===== */}
          <div className="flex flex-col items-center mb-8">
            {/* Album Art with Hover Effect */}
            <div className="relative group mb-6">
              <img
                src={currentSong.cover}
                alt={`${currentSong.title} album cover`}
                className="w-64 h-64 rounded-2xl shadow-2xl object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Song Title & Favorites Button */}
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-white text-center">
                {currentSong.title}
              </h2>
              <button
                onClick={() => toggleFavorite(currentSong.id)}
                className={`transition-colors ${
                  isCurrentFavorite ? "text-pink-500" : "text-white/30 hover:text-white/50"
                }`}
                aria-label="Toggle favorite"
              >
                <Heart size={24} fill={isCurrentFavorite ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Artist Name */}
            <p className="text-lg text-purple-200">{currentSong.artist}</p>
          </div>

          {/* ===== PROGRESS BAR ===== */}
          <div className="mb-6">
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />
          </div>

          {/* ===== PLAYBACK CONTROLS ===== */}
          <div className="mb-6">
            <Controls
              isPlaying={isPlaying}
              isShuffling={isShuffling}
              repeatMode={repeatMode}
              onTogglePlay={togglePlay}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onToggleShuffle={toggleShuffle}
              onToggleRepeat={toggleRepeat}
            />
          </div>

          {/* ===== VOLUME CONTROL ===== */}
          <div className="mb-8">
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={handleVolumeChange}
              onToggleMute={toggleMute}
            />
          </div>

          {/* ===== PLAYLIST ===== */}
          <Playlist
            songs={songs}
            currentSongIndex={currentSongIndex}
            onSelectSong={selectSong}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </div>

        {/* Attribution Footer */}
        <p className="text-center text-white/50 text-sm mt-4">
          Demo music from SoundHelix
        </p>
      </div>
    </div>
  );
};
