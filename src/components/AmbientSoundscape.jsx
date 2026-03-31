/**
 * Ambient Soundscape Component
 * Provides immersive nature sounds during journaling
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Trees, 
  Waves, 
  Wind,
  Coffee,
  Flame,
  Bird,
  Moon,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const SOUNDSCAPES = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    icon: CloudRain,
    description: 'Soft rainfall on leaves',
    color: 'from-blue-400 to-blue-600',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
    visualColor: '#60a5fa'
  },
  {
    id: 'forest',
    name: 'Forest',
    icon: Trees,
    description: 'Peaceful woodland ambiance',
    color: 'from-green-400 to-green-600',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2526/2526-preview.mp3',
    visualColor: '#4ade80'
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    icon: Waves,
    description: 'Calming sea sounds',
    color: 'from-cyan-400 to-cyan-600',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2516/2516-preview.mp3',
    visualColor: '#22d3ee'
  },
  {
    id: 'wind',
    name: 'Wind',
    icon: Wind,
    description: 'Gentle breeze through meadows',
    color: 'from-gray-400 to-gray-600',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2517/2517-preview.mp3',
    visualColor: '#9ca3af'
  },
  {
    id: 'cafe',
    name: 'Café',
    icon: Coffee,
    description: 'Cozy coffee shop ambiance',
    color: 'from-amber-400 to-amber-600',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2518/2518-preview.mp3',
    visualColor: '#fbbf24'
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    icon: Flame,
    description: 'Crackling warmth',
    color: 'from-orange-400 to-red-500',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2527/2527-preview.mp3',
    visualColor: '#f97316'
  },
  {
    id: 'birds',
    name: 'Birdsong',
    icon: Bird,
    description: 'Morning songbirds',
    color: 'from-yellow-400 to-yellow-600',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2519/2519-preview.mp3',
    visualColor: '#facc15'
  },
  {
    id: 'night',
    name: 'Night',
    icon: Moon,
    description: 'Peaceful crickets and owls',
    color: 'from-indigo-400 to-purple-600',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2521/2521-preview.mp3',
    visualColor: '#818cf8'
  }
];

const AmbientSoundscape = ({ onSoundChange, minimal = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioVisualization, setAudioVisualization] = useState([]);
  const audioRef = useRef(null);
  const analyzerRef = useRef(null);
  const animationRef = useRef(null);

  // Load saved preferences
  useEffect(() => {
    const savedSound = localStorage.getItem('moodGarden_ambientSound');
    const savedVolume = localStorage.getItem('moodGarden_ambientVolume');
    
    if (savedVolume) {
      setVolume(parseFloat(savedVolume));
    }
    
    if (savedSound) {
      const sound = SOUNDSCAPES.find(s => s.id === savedSound);
      if (sound) {
        setCurrentSound(sound);
      }
    }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('moodGarden_ambientVolume', volume.toString());
    if (currentSound) {
      localStorage.setItem('moodGarden_ambientSound', currentSound.id);
    }
  }, [volume, currentSound]);

  // Audio visualization
  const updateVisualization = useCallback(() => {
    if (analyzerRef.current && isPlaying) {
      const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
      analyzerRef.current.getByteFrequencyData(dataArray);
      
      // Sample 8 frequencies for visualization
      const samples = [];
      const sampleSize = Math.floor(dataArray.length / 8);
      for (let i = 0; i < 8; i++) {
        const start = i * sampleSize;
        let sum = 0;
        for (let j = start; j < start + sampleSize; j++) {
          sum += dataArray[j];
        }
        samples.push(sum / sampleSize / 255);
      }
      setAudioVisualization(samples);
      animationRef.current = requestAnimationFrame(updateVisualization);
    }
  }, [isPlaying]);

  // Play/pause sound
  const toggleSound = async (sound) => {
    if (currentSound?.id === sound.id && isPlaying) {
      // Pause current sound
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      cancelAnimationFrame(animationRef.current);
    } else {
      // Play new sound
      setIsLoading(true);
      setCurrentSound(sound);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }

      try {
        // Create new audio context for visualization
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audio = new Audio(sound.audioUrl);
        audio.crossOrigin = 'anonymous';
        audio.loop = true;
        audio.volume = volume;
        
        const source = audioContext.createMediaElementSource(audio);
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 256;
        
        source.connect(analyzer);
        analyzer.connect(audioContext.destination);
        
        audioRef.current = audio;
        analyzerRef.current = analyzer;
        
        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
        updateVisualization();
        
        if (onSoundChange) {
          onSoundChange(sound);
        }
      } catch (error) {
        console.error('Error playing sound:', error);
        setIsLoading(false);
        // Fallback without visualization
        const audio = new Audio(sound.audioUrl);
        audio.loop = true;
        audio.volume = volume;
        audioRef.current = audio;
        
        try {
          await audio.play();
          setIsPlaying(true);
        } catch {
          console.error('Audio playback failed');
        }
      }
    }
  };

  // Volume change handler
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Stop all sounds
  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    cancelAnimationFrame(animationRef.current);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  if (minimal) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            btn-icon p-3 rounded-xl
            ${isPlaying ? 'bg-sage-100 dark:bg-sage-900/50 ring-2 ring-sage-400' : ''}
            transition-all duration-300
          `}
          title="Ambient Sounds"
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 text-sage-600 dark:text-sage-400" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-72 card-glass p-4 z-50"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Ambient Sounds
                </h4>
                <button onClick={() => setIsExpanded(false)}>
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mb-4">
                {SOUNDSCAPES.map((sound) => {
                  const Icon = sound.icon;
                  const isActive = currentSound?.id === sound.id && isPlaying;
                  return (
                    <button
                      key={sound.id}
                      onClick={() => toggleSound(sound)}
                      className={`
                        p-2 rounded-lg transition-all duration-200
                        ${isActive 
                          ? `bg-gradient-to-br ${sound.color} text-white shadow-md scale-105` 
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }
                      `}
                      title={sound.name}
                    >
                      <Icon className="w-5 h-5 mx-auto" />
                    </button>
                  );
                })}
              </div>
              
              {/* Volume Slider */}
              <div className="flex items-center gap-3">
                <VolumeX className="w-4 h-4 text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1"
                />
                <Volume2 className="w-4 h-4 text-gray-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass p-6"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`
            p-3 rounded-xl transition-all duration-300
            ${isPlaying 
              ? 'bg-sage-100 dark:bg-sage-900/50' 
              : 'bg-gray-100 dark:bg-gray-700'
            }
          `}>
            {isPlaying ? (
              <Volume2 className="w-6 h-6 text-sage-600 dark:text-sage-400" />
            ) : (
              <VolumeX className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Ambient Soundscape
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentSound && isPlaying 
                ? `Playing: ${currentSound.name}` 
                : 'Choose a calming background'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Audio Visualizer */}
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-8 mr-2">
              {(audioVisualization.length > 0 ? audioVisualization : [0.3, 0.5, 0.7, 0.4, 0.6, 0.3, 0.5, 0.4]).map((value, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-sage-500 rounded-full"
                  animate={{ height: `${Math.max(4, value * 32)}px` }}
                  transition={{ duration: 0.1 }}
                  style={{ backgroundColor: currentSound?.visualColor }}
                />
              ))}
            </div>
          )}
          
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-6 space-y-6">
              {/* Sound Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SOUNDSCAPES.map((sound) => {
                  const Icon = sound.icon;
                  const isActive = currentSound?.id === sound.id && isPlaying;
                  
                  return (
                    <motion.button
                      key={sound.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleSound(sound)}
                      disabled={isLoading}
                      className={`
                        relative p-4 rounded-xl transition-all duration-300
                        ${isActive 
                          ? `bg-gradient-to-br ${sound.color} text-white shadow-lg` 
                          : 'bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                        }
                      `}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Icon className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />
                        <span className="text-sm font-medium">{sound.name}</span>
                      </div>
                      
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute inset-0 rounded-xl ring-2 ring-white/50"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Description */}
              {currentSound && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm text-gray-600 dark:text-gray-400 italic"
                >
                  {currentSound.description}
                </motion.p>
              )}

              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Volume</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <VolumeX className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="flex-1"
                  />
                  <Volume2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </div>

              {/* Stop Button */}
              {isPlaying && (
                <button
                  onClick={stopSound}
                  className="w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  Stop Sound
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AmbientSoundscape;
