// Song interface - defines the structure of a song object
export interface Song {
  id: number;           // Unique identifier
  title: string;        // Song name
  artist: string;       // Artist name
  duration: number;     // Length in seconds
  url: string;          // Audio file URL
  cover: string;        // Album art image URL
}

// Player state - tracks the current state of the audio player
export interface PlayerState {
  currentSongIndex: number;     // Which song is playing (array index)
  isPlaying: boolean;           // Is audio currently playing?
  currentTime: number;          // Current playback position (seconds)
  duration: number;             // Total song length (seconds)
  volume: number;               // Volume level (0 to 1)
  isMuted: boolean;             // Is audio muted?
  isShuffling: boolean;         // Is shuffle mode on?
  repeatMode: 'off' | 'all' | 'one';  // Repeat mode
}