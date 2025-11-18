import type { Song } from "../types";

// Sample playlist - using free demo music from SoundHelix
export const sampleSongs: Song[] = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "Synthwave Collective",
    duration: 225, // 3:45 in seconds
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Midnight Drive",
    artist: "Electronic Pulse",
    duration: 198, // 3:18
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Ocean Waves",
    artist: "Ambient Flow",
    duration: 312, // 5:12
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Urban Sunset",
    artist: "City Beats",
    duration: 267, // 4:27
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
  },
];
