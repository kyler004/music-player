import React from "react";
import type { Song } from "../types";

interface PlaylistProps {
  songs: Song[];
  currentSongIndex: number;
  onSelectSong: (index: number) => void;
}

// Helper function to format duration
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export const Playlist: React.FC<PlaylistProps> = ({
  songs,
  currentSongIndex,
  onSelectSong,
}) => {
  return (
    <div className="bg-black/20 rounded-2xl p-4">
      {/* Header */}
      <h3 className="text-white font-semibold mb-3 text-lg">Playlist</h3>

      {/* Scrollable Song List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {songs.map((song, index) => (
          <div
            key={song.id}
            onClick={() => onSelectSong(index)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              index === currentSongIndex
                ? "bg-linear-to-r from-pink-500/30 to-purple-500/30 border border-pink-400/50"
                : "hover:bg-white/10"
            }`}
          >
            {/* Album Cover Thumbnail */}
            <img
              src={song.cover}
              alt={`${song.title} cover`}
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />{" "}
            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{song.title}</p>
              <p className="text-purple-200 text-sm truncate">{song.artist}</p>
            </div>
            {/* Duration */}
            <span className="text-purple-300 text-sm shrink-0">
              {formatDuration(song.duration)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
