import React from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
} from "lucide-react";

interface ControlsProps {
  isPlaying: boolean;
  isShuffling: boolean;
  repeatMode: "off" | "all" | "one";
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  isShuffling,
  repeatMode,
  onTogglePlay,
  onNext,
  onPrevious,
  onToggleShuffle,
  onToggleRepeat,
}) => {
  return (
    <div className="flex items-center justify-between">
      {/* Shuffle Button */}
      <button
        onClick={onToggleShuffle}
        className={`p-3 rounded-full transition-all ${
          isShuffling
            ? "bg-pink-500 text-white"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
        aria-label="Toggle shuffle"
        title={isShuffling ? "Shuffle on" : "Shuffle off"}
      >
        <Shuffle size={20} />
      </button>

      {/* Main Playback Controls */}
      <div className="flex items-center gap-4">
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white"
          aria-label="Previous track"
        >
          <SkipBack size={24} />
        </button>

        {/* Play/Pause Button - Larger and more prominent */}
        <button
          onClick={onTogglePlay}
          className="p-5 bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-full transition-all shadow-lg text-white"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={32} fill="white" />
          ) : (
            <Play
              size={32}
              fill="white"
              className="ml-1" /* Slight offset for visual centering */
            />
          )}
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white"
          aria-label="Next track"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* Repeat Button */}
      <button
        onClick={onToggleRepeat}
        className={`p-3 rounded-full transition-all relative ${
          repeatMode !== "off"
            ? "bg-pink-500 text-white"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
        aria-label={`Repeat: ${repeatMode}`}
        title={`Repeat: ${repeatMode}`}
      >
        <Repeat size={20} />
        {/* Show "1" badge when repeat one is active */}
        {repeatMode === "one" && (
          <span className="absolute -top-1 -right-1 text-xs font-bold bg-white text-pink-500 rounded-full w-4 h-4 flex items-center justify-center">
            1
          </span>
        )}
      </button>
    </div>
  );
};
