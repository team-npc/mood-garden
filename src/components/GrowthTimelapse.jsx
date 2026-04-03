/**
 * Growth Timelapse Component
 * Animated visualization of plant growth over time
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Download,
  Calendar,
  Flower2,
  TreeDeciduous,
  Sprout,
  Leaf
} from 'lucide-react';

/**
 * Plant growth stages with SVG
 */
const PLANT_STAGES = [
  {
    stage: 0,
    name: 'Seed',
    icon: '🌱',
    svg: (color) => (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Soil */}
        <ellipse cx="50" cy="85" rx="30" ry="10" fill="#4a3728" />
        {/* Seed */}
        <ellipse cx="50" cy="75" rx="6" ry="4" fill="#8B4513">
          <animate attributeName="ry" values="4;5;4" dur="2s" repeatCount="indefinite" />
        </ellipse>
      </svg>
    )
  },
  {
    stage: 1,
    name: 'Sprout',
    icon: '🌿',
    svg: (color) => (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Soil */}
        <ellipse cx="50" cy="85" rx="30" ry="10" fill="#4a3728" />
        {/* Stem */}
        <path d="M50 85 Q50 70 50 60" stroke={color} strokeWidth="3" fill="none">
          <animate attributeName="d" values="M50 85 Q50 70 50 60;M50 85 Q52 70 50 60;M50 85 Q50 70 50 60" dur="3s" repeatCount="indefinite" />
        </path>
        {/* Small leaves */}
        <ellipse cx="45" cy="65" rx="6" ry="3" fill={color} transform="rotate(-30 45 65)">
          <animate attributeName="rx" values="6;7;6" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="55" cy="65" rx="6" ry="3" fill={color} transform="rotate(30 55 65)">
          <animate attributeName="rx" values="6;7;6" dur="2s" repeatCount="indefinite" delay="0.5s" />
        </ellipse>
      </svg>
    )
  },
  {
    stage: 2,
    name: 'Seedling',
    icon: '🪴',
    svg: (color) => (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Soil */}
        <ellipse cx="50" cy="85" rx="30" ry="10" fill="#4a3728" />
        {/* Stem */}
        <path d="M50 85 Q50 60 50 45" stroke={color} strokeWidth="4" fill="none" />
        {/* Leaves */}
        <ellipse cx="40" cy="55" rx="12" ry="5" fill={color} transform="rotate(-40 40 55)">
          <animate attributeName="transform" values="rotate(-40 40 55);rotate(-35 40 55);rotate(-40 40 55)" dur="4s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="60" cy="55" rx="12" ry="5" fill={color} transform="rotate(40 60 55)">
          <animate attributeName="transform" values="rotate(40 60 55);rotate(35 60 55);rotate(40 60 55)" dur="4s" repeatCount="indefinite" delay="1s" />
        </ellipse>
        <ellipse cx="45" cy="45" rx="10" ry="4" fill={color} transform="rotate(-30 45 45)" />
        <ellipse cx="55" cy="45" rx="10" ry="4" fill={color} transform="rotate(30 55 45)" />
      </svg>
    )
  },
  {
    stage: 3,
    name: 'Young Plant',
    icon: '🌳',
    svg: (color) => (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Soil */}
        <ellipse cx="50" cy="88" rx="32" ry="10" fill="#4a3728" />
        {/* Stem */}
        <path d="M50 88 Q50 55 50 35" stroke={color} strokeWidth="5" fill="none" />
        {/* Branches */}
        <path d="M50 60 Q35 50 30 45" stroke={color} strokeWidth="3" fill="none" />
        <path d="M50 60 Q65 50 70 45" stroke={color} strokeWidth="3" fill="none" />
        {/* Leaves */}
        <ellipse cx="30" cy="42" rx="12" ry="6" fill={color}>
          <animate attributeName="ry" values="6;7;6" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="70" cy="42" rx="12" ry="6" fill={color}>
          <animate attributeName="ry" values="6;7;6" dur="3s" repeatCount="indefinite" delay="1s" />
        </ellipse>
        <ellipse cx="45" cy="35" rx="14" ry="7" fill={color} transform="rotate(-15 45 35)" />
        <ellipse cx="55" cy="35" rx="14" ry="7" fill={color} transform="rotate(15 55 35)" />
        <ellipse cx="50" cy="28" rx="10" ry="5" fill={color} />
      </svg>
    )
  },
  {
    stage: 4,
    name: 'Mature Plant',
    icon: '🌲',
    svg: (color) => (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Soil */}
        <ellipse cx="50" cy="90" rx="35" ry="10" fill="#4a3728" />
        {/* Trunk */}
        <path d="M50 90 Q50 50 50 25" stroke="#8B4513" strokeWidth="6" fill="none" />
        {/* Main branches */}
        <path d="M50 65 Q30 55 20 50" stroke="#8B4513" strokeWidth="3" fill="none" />
        <path d="M50 65 Q70 55 80 50" stroke="#8B4513" strokeWidth="3" fill="none" />
        <path d="M50 45 Q35 35 25 32" stroke="#8B4513" strokeWidth="2" fill="none" />
        <path d="M50 45 Q65 35 75 32" stroke="#8B4513" strokeWidth="2" fill="none" />
        {/* Foliage */}
        <ellipse cx="20" cy="48" rx="15" ry="10" fill={color}>
          <animate attributeName="rx" values="15;16;15" dur="4s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="80" cy="48" rx="15" ry="10" fill={color}>
          <animate attributeName="rx" values="15;16;15" dur="4s" repeatCount="indefinite" delay="1s" />
        </ellipse>
        <ellipse cx="25" cy="32" rx="12" ry="8" fill={color} />
        <ellipse cx="75" cy="32" rx="12" ry="8" fill={color} />
        <ellipse cx="50" cy="20" rx="20" ry="12" fill={color}>
          <animate attributeName="ry" values="12;13;12" dur="3s" repeatCount="indefinite" />
        </ellipse>
        {/* Flowers */}
        <circle cx="35" cy="40" r="4" fill="#FFB7C5">
          <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="65" cy="38" r="4" fill="#FFB7C5">
          <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" delay="0.5s" />
        </circle>
        <circle cx="50" cy="15" r="5" fill="#FFD700">
          <animate attributeName="r" values="5;6;5" dur="2s" repeatCount="indefinite" delay="1s" />
        </circle>
      </svg>
    )
  }
];

/**
 * Generate mock history data
 */
const generateMockHistory = (entries = []) => {
  // Group entries by date
  const entriesByDate = {};
  entries.forEach(entry => {
    const date = new Date(entry.createdAt).toISOString().split('T')[0];
    if (!entriesByDate[date]) {
      entriesByDate[date] = [];
    }
    entriesByDate[date].push(entry);
  });
  
  // Create timeline
  const dates = Object.keys(entriesByDate).sort();
  let currentStreak = 0;
  let totalEntries = 0;
  
  return dates.map((date, index) => {
    const dayEntries = entriesByDate[date];
    totalEntries += dayEntries.length;
    currentStreak++;
    
    // Calculate stage based on progress
    let stage = 0;
    if (totalEntries >= 50) stage = 4;
    else if (totalEntries >= 25) stage = 3;
    else if (totalEntries >= 10) stage = 2;
    else if (totalEntries >= 3) stage = 1;
    
    return {
      date,
      stage,
      entries: dayEntries.length,
      totalEntries,
      streak: currentStreak,
      dominantMood: dayEntries[0]?.mood || '😊'
    };
  });
};

/**
 * Timeline Marker
 */
const TimelineMarker = ({ data, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.2 }}
    onClick={onClick}
    className={`w-3 h-3 rounded-full transition-all ${
      isActive
        ? 'bg-sage-400 ring-2 ring-sage-300'
        : 'bg-deep-500 hover:bg-deep-400'
    }`}
    title={data.date}
  />
);

/**
 * Main Growth Timelapse Component
 */
const GrowthTimelapse = ({ isOpen, onClose, entries = [], plant = null }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const intervalRef = useRef(null);
  
  // Generate history from entries
  const history = React.useMemo(() => generateMockHistory(entries), [entries]);
  
  // Get current frame data
  const currentData = history[currentFrame] || history[0] || {
    date: new Date().toISOString().split('T')[0],
    stage: plant?.stage || 0,
    entries: 0,
    totalEntries: entries.length,
    streak: 0,
    dominantMood: '😊'
  };
  
  // Plant color based on mood
  const getMoodColor = (mood) => {
    const colors = {
      '😊': '#84cc16', // lime
      '😢': '#3b82f6', // blue
      '😤': '#ef4444', // red
      '😴': '#8b5cf6', // violet
      '😰': '#f97316', // orange
      '😌': '#14b8a6'  // teal
    };
    return colors[mood] || '#84cc16';
  };
  
  const plantColor = getMoodColor(currentData.dominantMood);
  
  // Playback controls
  const play = useCallback(() => {
    if (history.length <= 1) return;
    setIsPlaying(true);
  }, [history.length]);
  
  const pause = () => {
    setIsPlaying(false);
  };
  
  const skipToStart = () => {
    setCurrentFrame(0);
    setIsPlaying(false);
  };
  
  const skipToEnd = () => {
    setCurrentFrame(history.length - 1);
    setIsPlaying(false);
  };
  
  // Animation loop
  useEffect(() => {
    if (isPlaying && history.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame(prev => {
          if (prev >= history.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, history.length]);

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
          className="bg-deep-800 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TreeDeciduous className="w-6 h-6 text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">Growth Timelapse</h2>
                  <p className="text-sm text-emerald-200">Watch your garden grow</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Plant Visualization */}
            <div className="bg-gradient-to-b from-sky-200 to-emerald-100 rounded-2xl p-8 relative overflow-hidden">
              {/* Sun */}
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-4 right-4 w-12 h-12 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"
              />
              
              {/* Clouds */}
              <motion.div
                animate={{ x: [-20, 20, -20] }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute top-8 left-8 text-4xl opacity-60"
              >
                ☁️
              </motion.div>
              
              {/* Plant */}
              <div className="w-48 h-48 mx-auto">
                {PLANT_STAGES[currentData.stage]?.svg(plantColor)}
              </div>
              
              {/* Stage Label */}
              <div className="text-center mt-4">
                <span className="text-2xl">{PLANT_STAGES[currentData.stage]?.icon}</span>
                <p className="text-deep-700 font-medium">{PLANT_STAGES[currentData.stage]?.name}</p>
              </div>
            </div>
            
            {/* Stats - Qualitative descriptions */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-deep-700/50 rounded-xl p-3 text-center">
                <Calendar className="w-4 h-4 text-cream-400 mx-auto mb-1" />
                <span className="text-sm text-cream-200 block">
                  {new Date(currentData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="bg-deep-700/50 rounded-xl p-3 text-center">
                <Leaf className="w-4 h-4 text-sage-400 mx-auto mb-1" />
                <span className="text-sm text-cream-200 block">
                  {currentData.totalEntries >= 30 ? 'Many entries' : currentData.totalEntries >= 10 ? 'Growing' : 'Starting'}
                </span>
              </div>
              <div className="bg-deep-700/50 rounded-xl p-3 text-center">
                <Flower2 className="w-4 h-4 text-pink-400 mx-auto mb-1" />
                <span className="text-sm text-cream-200 block">
                  {currentData.streak >= 14 ? 'Flowing' : currentData.streak >= 7 ? 'Building' : currentData.streak >= 3 ? 'Growing' : 'Fresh'}
                </span>
              </div>
              <div className="bg-deep-700/50 rounded-xl p-3 text-center">
                <span className="text-xl block mb-0.5">{currentData.dominantMood}</span>
                <span className="text-xs text-cream-400">Mood</span>
              </div>
            </div>
            
            {/* Timeline */}
            <div className="bg-deep-700/50 rounded-xl p-4">
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {history.map((data, index) => (
                  <TimelineMarker
                    key={data.date}
                    data={data}
                    isActive={index === currentFrame}
                    onClick={() => setCurrentFrame(index)}
                  />
                ))}
              </div>
              
              {/* Progress bar */}
              <div className="h-1 bg-deep-600 rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full bg-sage-500"
                  style={{ width: `${((currentFrame + 1) / history.length) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={skipToStart}
                className="p-2 hover:bg-deep-600 rounded-xl text-cream-400 transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={isPlaying ? pause : play}
                className="p-4 bg-sage-600 hover:bg-sage-500 text-white rounded-full"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </motion.button>
              
              <button
                onClick={skipToEnd}
                className="p-2 hover:bg-deep-600 rounded-xl text-cream-400 transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
            
            {/* Speed Control */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-cream-500">Speed:</span>
              {[0.5, 1, 2, 4].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-sage-600 text-white'
                      : 'bg-deep-600 text-cream-400 hover:bg-deep-500'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
            
            {/* Info */}
            {history.length === 0 && (
              <div className="text-center py-4">
                <Sprout className="w-12 h-12 text-cream-600 mx-auto mb-2" />
                <p className="text-cream-400 text-sm">
                  Start journaling to see your plant grow over time!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GrowthTimelapse;
