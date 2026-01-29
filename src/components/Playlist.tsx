import React, { useState, useMemo } from "react";
import type { Song } from "../types";
import { Search, Heart } from "lucide-react";

interface PlaylistProps {
  songs: Song[];
  currentSongIndex: number;
  onSelectSong: (index: number) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
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
  favorites,
  onToggleFavorite,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Filter songs based on search and favorites
  const filteredSongs = useMemo(() => {
    return songs.map((song, originalIndex) => ({ ...song, originalIndex }))
      .filter((song) => {
        const matchesSearch =
          song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFavorites = showFavoritesOnly ? favorites.includes(song.id) : true;
        return matchesSearch && matchesFavorites;
      });
  }, [songs, searchTerm, showFavoritesOnly, favorites]);

  return (
    <div className="bg-black/20 rounded-2xl p-4">
      {/* Header with Search and Filter */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">Playlist</h3>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`text-xs px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              showFavoritesOnly
                ? "bg-pink-500 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            <Heart size={12} fill={showFavoritesOnly ? "currentColor" : "none"} />
            <span>Favorites</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input
            type="text"
            placeholder="Search songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 text-sm transition-all"
          />
        </div>
      </div>

      {/* Scrollable Song List */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        {filteredSongs.length === 0 ? (
          <div className="text-center py-8 text-white/30 text-sm">
            No songs found
          </div>
        ) : (
          filteredSongs.map((song) => {
            const isFavorite = favorites.includes(song.id);
            return (
              <div
                key={song.id}
                className={`group flex items-center gap-3 p-3 rounded-xl cursor-default transition-all ${
                  song.originalIndex === currentSongIndex
                    ? "bg-linear-to-r from-pink-500/30 to-purple-500/30 border border-pink-400/50"
                    : "hover:bg-white/10"
                }`}
              >
                {/* Clickable Area for Selection */}
                <div 
                  className="flex-1 flex items-center gap-3 min-w-0 cursor-pointer"
                  onClick={() => onSelectSong(song.originalIndex)}
                >
                  {/* Album Cover Thumbnail */}
                  <img
                    src={song.cover}
                    alt={`${song.title} cover`}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${
                      song.originalIndex === currentSongIndex ? 'text-pink-200' : 'text-white'
                    }`}>
                      {song.title}
                    </p>
                    <p className="text-purple-200 text-sm truncate">{song.artist}</p>
                  </div>
                </div>

                {/* Duration & Favorite Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-purple-300 text-sm">
                    {formatDuration(song.duration)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(song.id);
                    }}
                    className={`p-1.5 rounded-full transition-all ${
                      isFavorite 
                        ? "text-pink-500 hover:bg-pink-500/10" 
                        : "text-white/30 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
