/**
 * Mood Music Playlist Component
 * Generate Spotify-style playlists based on mood history
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Music, 
  Play,
  Pause,
  SkipForward,
  Volume2,
  Heart,
  Shuffle,
  Repeat,
  ExternalLink,
  Sparkles
} from 'lucide-react';

/**
 * Song database by mood
 */
const MOOD_SONGS = {
  '😊': {
    mood: 'Happy',
    color: 'amber',
    songs: [
      { title: 'Happy', artist: 'Pharrell Williams', duration: '3:53', energy: 0.9 },
      { title: 'Walking on Sunshine', artist: 'Katrina & The Waves', duration: '3:58', energy: 0.95 },
      { title: 'Good as Hell', artist: 'Lizzo', duration: '2:39', energy: 0.88 },
      { title: 'Uptown Funk', artist: 'Bruno Mars', duration: '4:30', energy: 0.92 },
      { title: 'Can\'t Stop the Feeling', artist: 'Justin Timberlake', duration: '3:56', energy: 0.87 },
      { title: 'Don\'t Worry Be Happy', artist: 'Bobby McFerrin', duration: '4:51', energy: 0.75 },
      { title: 'Best Day of My Life', artist: 'American Authors', duration: '3:14', energy: 0.85 },
      { title: 'I Gotta Feeling', artist: 'Black Eyed Peas', duration: '4:52', energy: 0.9 }
    ]
  },
  '😢': {
    mood: 'Sad',
    color: 'blue',
    songs: [
      { title: 'Someone Like You', artist: 'Adele', duration: '4:45', energy: 0.3 },
      { title: 'Fix You', artist: 'Coldplay', duration: '4:54', energy: 0.35 },
      { title: 'The Night We Met', artist: 'Lord Huron', duration: '3:28', energy: 0.25 },
      { title: 'Skinny Love', artist: 'Bon Iver', duration: '3:58', energy: 0.28 },
      { title: 'All I Want', artist: 'Kodaline', duration: '5:05', energy: 0.32 },
      { title: 'Let It Be', artist: 'The Beatles', duration: '4:03', energy: 0.4 },
      { title: 'Tears in Heaven', artist: 'Eric Clapton', duration: '4:36', energy: 0.25 },
      { title: 'Hurt', artist: 'Johnny Cash', duration: '3:36', energy: 0.2 }
    ]
  },
  '😤': {
    mood: 'Angry',
    color: 'red',
    songs: [
      { title: 'Killing in the Name', artist: 'Rage Against the Machine', duration: '5:13', energy: 0.95 },
      { title: 'Break Stuff', artist: 'Limp Bizkit', duration: '2:46', energy: 0.98 },
      { title: 'Bodies', artist: 'Drowning Pool', duration: '3:24', energy: 0.97 },
      { title: 'Given Up', artist: 'Linkin Park', duration: '3:09', energy: 0.93 },
      { title: 'Chop Suey!', artist: 'System of a Down', duration: '3:30', energy: 0.92 },
      { title: 'Down with the Sickness', artist: 'Disturbed', duration: '4:38', energy: 0.94 },
      { title: 'Headstrong', artist: 'Trapt', duration: '3:26', energy: 0.88 },
      { title: 'My Own Worst Enemy', artist: 'Lit', duration: '2:49', energy: 0.85 }
    ]
  },
  '😴': {
    mood: 'Tired',
    color: 'violet',
    songs: [
      { title: 'Weightless', artist: 'Marconi Union', duration: '8:09', energy: 0.1 },
      { title: 'Gymnopédie No.1', artist: 'Erik Satie', duration: '3:05', energy: 0.15 },
      { title: 'Clair de Lune', artist: 'Debussy', duration: '5:09', energy: 0.12 },
      { title: 'River Flows In You', artist: 'Yiruma', duration: '3:30', energy: 0.18 },
      { title: 'Breathe Me', artist: 'Sia', duration: '4:35', energy: 0.22 },
      { title: 'Sleep', artist: 'Eric Whitacre', duration: '4:24', energy: 0.08 },
      { title: 'Saturn', artist: 'Sleeping at Last', duration: '4:49', energy: 0.15 },
      { title: 'Holocene', artist: 'Bon Iver', duration: '5:36', energy: 0.2 }
    ]
  },
  '😰': {
    mood: 'Anxious',
    color: 'orange',
    songs: [
      { title: 'Breathe', artist: 'Télépopmusik', duration: '4:43', energy: 0.35 },
      { title: 'Pure Shores', artist: 'All Saints', duration: '4:25', energy: 0.4 },
      { title: 'Only Time', artist: 'Enya', duration: '3:37', energy: 0.25 },
      { title: 'Teardrop', artist: 'Massive Attack', duration: '5:29', energy: 0.3 },
      { title: 'Orinoco Flow', artist: 'Enya', duration: '4:26', energy: 0.35 },
      { title: 'Porcelain', artist: 'Moby', duration: '4:01', energy: 0.28 },
      { title: 'The Sound of Silence', artist: 'Simon & Garfunkel', duration: '3:05', energy: 0.2 },
      { title: 'Gravity', artist: 'John Mayer', duration: '4:05', energy: 0.38 }
    ]
  },
  '😌': {
    mood: 'Calm',
    color: 'teal',
    songs: [
      { title: 'Sunset Lover', artist: 'Petit Biscuit', duration: '3:28', energy: 0.45 },
      { title: 'Ocean Eyes', artist: 'Billie Eilish', duration: '3:20', energy: 0.35 },
      { title: 'Bloom', artist: 'The Paper Kites', duration: '3:28', energy: 0.4 },
      { title: 'Here Comes the Sun', artist: 'The Beatles', duration: '3:05', energy: 0.55 },
      { title: 'Budapest', artist: 'George Ezra', duration: '3:21', energy: 0.5 },
      { title: 'Put Your Records On', artist: 'Corinne Bailey Rae', duration: '3:35', energy: 0.52 },
      { title: 'Ho Hey', artist: 'The Lumineers', duration: '2:42', energy: 0.6 },
      { title: 'Better Together', artist: 'Jack Johnson', duration: '3:27', energy: 0.48 }
    ]
  }
};

/**
 * Song Row Component
 */
const SongRow = ({ song, index, isPlaying, onPlay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
      isPlaying ? 'bg-sage-500/20' : 'hover:bg-deep-600/50'
    }`}
  >
    <button
      onClick={() => onPlay(index)}
      className="w-8 h-8 flex items-center justify-center text-cream-400 hover:text-cream-200"
    >
      {isPlaying ? (
        <Pause className="w-4 h-4" />
      ) : (
        <span className="text-sm">{index + 1}</span>
      )}
    </button>
    
    <div className="flex-1 min-w-0">
      <p className={`font-medium truncate ${isPlaying ? 'text-sage-400' : 'text-cream-200'}`}>
        {song.title}
      </p>
      <p className="text-sm text-cream-500 truncate">{song.artist}</p>
    </div>
    
    <button className="p-1 text-cream-500 hover:text-pink-400 transition-colors">
      <Heart className="w-4 h-4" />
    </button>
    
    <span className="text-sm text-cream-500 w-12 text-right">{song.duration}</span>
  </motion.div>
);

/**
 * Energy Bar
 */
const EnergyBar = ({ energy }) => (
  <div className="h-1 bg-deep-600 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${energy * 100}%` }}
      className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500"
    />
  </div>
);

/**
 * Main Mood Music Playlist Component
 */
const MoodMusicPlaylist = ({ isOpen, onClose, entries = [] }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  
  // Analyze mood history
  const moodAnalysis = useMemo(() => {
    const moodCounts = {};
    entries.forEach(entry => {
      if (entry.mood) {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      }
    });
    
    // Get dominant mood
    const sortedMoods = Object.entries(moodCounts).sort(([,a], [,b]) => b - a);
    const dominantMood = sortedMoods[0]?.[0] || '😌';
    
    // Calculate mood distribution
    const total = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);
    const distribution = {};
    Object.entries(moodCounts).forEach(([mood, count]) => {
      distribution[mood] = Math.round((count / total) * 100);
    });
    
    return { dominantMood, distribution, moodCounts };
  }, [entries]);
  
  // Generate playlist based on mood
  const playlist = useMemo(() => {
    const { dominantMood, moodCounts } = moodAnalysis;
    let songs = [];
    
    // Add songs from each mood proportionally
    Object.entries(moodCounts).forEach(([mood, count]) => {
      const moodSongs = MOOD_SONGS[mood]?.songs || [];
      const proportion = count / Object.values(moodCounts).reduce((a, b) => a + b, 1);
      const numSongs = Math.max(1, Math.round(proportion * 10));
      songs.push(...moodSongs.slice(0, numSongs));
    });
    
    // If no entries, use calm/happy defaults
    if (songs.length === 0) {
      songs = [...MOOD_SONGS['😌'].songs.slice(0, 4), ...MOOD_SONGS['😊'].songs.slice(0, 4)];
    }
    
    // Remove duplicates
    const uniqueSongs = songs.filter((song, index, self) =>
      index === self.findIndex(s => s.title === song.title)
    );
    
    return isShuffled 
      ? uniqueSongs.sort(() => Math.random() - 0.5)
      : uniqueSongs;
  }, [moodAnalysis, isShuffled]);
  
  // Get playlist stats
  const playlistStats = useMemo(() => {
    const totalDuration = playlist.reduce((sum, song) => {
      const [min, sec] = song.duration.split(':').map(Number);
      return sum + min * 60 + sec;
    }, 0);
    
    const avgEnergy = playlist.reduce((sum, song) => sum + song.energy, 0) / playlist.length;
    
    return {
      totalSongs: playlist.length,
      duration: `${Math.floor(totalDuration / 60)}:${String(totalDuration % 60).padStart(2, '0')}`,
      avgEnergy
    };
  }, [playlist]);
  
  const moodData = MOOD_SONGS[moodAnalysis.dominantMood] || MOOD_SONGS['😌'];
  
  const handlePlay = (index) => {
    setCurrentSongIndex(currentSongIndex === index ? null : index);
  };
  
  const handleNext = () => {
    if (currentSongIndex === null) {
      setCurrentSongIndex(0);
    } else if (currentSongIndex < playlist.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else if (isRepeating) {
      setCurrentSongIndex(0);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-deep-800 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden"
        >
          {/* Header with gradient based on dominant mood */}
          <div className={`bg-gradient-to-r from-${moodData.color}-600 to-${moodData.color}-700 p-6`}>
            <div className="flex items-center justify-between mb-4">
              <Music className="w-8 h-8 text-white" />
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1">
              Your {moodData.mood} Mix
            </h2>
            <p className="text-white/70 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generated from your mood history
            </p>
            
            <div className="flex items-center gap-4 mt-4 text-white/80 text-sm">
              <span>{playlistStats.totalSongs} songs</span>
              <span>•</span>
              <span>{playlistStats.duration}</span>
            </div>
          </div>
          
          {/* Mood Distribution */}
          <div className="px-4 py-3 bg-deep-700/50 border-b border-deep-600">
            <p className="text-xs text-cream-500 mb-2">Your mood distribution:</p>
            <div className="flex gap-2">
              {Object.entries(moodAnalysis.distribution).map(([mood, percent]) => (
                <div key={mood} className="flex items-center gap-1">
                  <span className="text-lg">{mood}</span>
                  <span className="text-xs text-cream-400">{percent}%</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Playlist */}
          <div className="p-4 overflow-y-auto max-h-[40vh]">
            {playlist.map((song, index) => (
              <SongRow
                key={`${song.title}-${index}`}
                song={song}
                index={index}
                isPlaying={currentSongIndex === index}
                onPlay={handlePlay}
              />
            ))}
          </div>
          
          {/* Player Controls */}
          <div className="p-4 bg-deep-700/50 border-t border-deep-600">
            {/* Now Playing */}
            {currentSongIndex !== null && (
              <div className="mb-4">
                <p className="text-cream-200 font-medium">{playlist[currentSongIndex]?.title}</p>
                <p className="text-cream-500 text-sm">{playlist[currentSongIndex]?.artist}</p>
                <div className="mt-2">
                  <p className="text-xs text-cream-500 mb-1">Energy</p>
                  <EnergyBar energy={playlist[currentSongIndex]?.energy || 0.5} />
                </div>
              </div>
            )}
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`p-2 rounded-xl transition-colors ${
                  isShuffled ? 'text-sage-400' : 'text-cream-500 hover:text-cream-300'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePlay(currentSongIndex === null ? 0 : currentSongIndex)}
                className={`p-4 bg-${moodData.color}-500 hover:bg-${moodData.color}-400 text-white rounded-full`}
              >
                {currentSongIndex !== null ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </motion.button>
              
              <button
                onClick={handleNext}
                className="p-2 text-cream-500 hover:text-cream-300 rounded-xl transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsRepeating(!isRepeating)}
                className={`p-2 rounded-xl transition-colors ${
                  isRepeating ? 'text-sage-400' : 'text-cream-500 hover:text-cream-300'
                }`}
              >
                <Repeat className="w-5 h-5" />
              </button>
            </div>
            
            {/* Open in Spotify hint */}
            <div className="mt-4 text-center">
              <button className="text-xs text-cream-500 hover:text-cream-300 flex items-center justify-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Search these songs on your favorite music app
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MoodMusicPlaylist;
