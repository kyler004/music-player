import React from 'react';

interface ProgressBarProps {
  currentTime: number;    // Current playback position
  duration: number;       // Total song length
  onSeek: (time: number) => void;  // Function to call when user seeks
}

// Helper function to format seconds as MM:SS
const formatTime = (time: number): string => {
  if (isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentTime, 
  duration, 
  onSeek 
}) => {
  // Calculate percentage for progress indicator
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Handle slider change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    onSeek(newTime);
  };

  return (
    <div className="w-full">
      {/* Slider Input */}
      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={handleChange}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${progress}%, rgba(255,255,255,0.2) ${progress}%, rgba(255,255,255,0.2) 100%)`
        }}
      />
      
      {/* Time Display */}
      <div className="flex justify-between text-sm text-purple-200 mt-2">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};