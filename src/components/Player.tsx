import React from "react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import type { Song } from "../types";
import { Controls } from "./Controls";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { Playlist } from "./Playlist";

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
    togglePlay,
    handleNext,
    handlePrevious,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    selectSong,
  } = useAudioPlayer(songs);

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

            {/* Song Title */}
            <h2 className="text-3xl font-bold text-white mb-2 text-center">
              {currentSong.title}
            </h2>

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
