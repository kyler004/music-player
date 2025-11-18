import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;         // Current volume (0 to 1)
  isMuted: boolean;       // Is audio muted?
  onVolumeChange: (volume: number) => void;  // Volume change handler
  onToggleMute: () => void;  // Mute toggle handler
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute
}) => {
  // Calculate percentage for visual display
  const volumePercentage = isMuted ? 0 : volume * 100;

  // Handle slider change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Mute/Unmute Button */}
      <button 
        onClick={onToggleMute}
        className="text-white hover:text-pink-400 transition-colors"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted || volume === 0 ? (
          <VolumeX size={20} />
        ) : (
          <Volume2 size={20} />
        )}
      </button>

      {/* Volume Slider */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"  // Allow fine-grained control
        value={isMuted ? 0 : volume}
        onChange={handleChange}
        className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${volumePercentage}%, rgba(255,255,255,0.2) ${volumePercentage}%, rgba(255,255,255,0.2) 100%)`
        }}
        aria-label="Volume"
      />
    </div>
  );
};