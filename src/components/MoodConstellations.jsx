/**
 * Mood Constellations Component
 * Stars form patterns based on entry connections and moods
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Sparkles, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

/**
 * Mood colors for stars
 */
const MOOD_COLORS = {
  '😊': '#fbbf24', // amber
  '😢': '#60a5fa', // blue
  '😤': '#f87171', // red
  '😴': '#a78bfa', // violet
  '😰': '#fb923c', // orange
  '😌': '#34d399', // emerald
  'default': '#e2e8f0' // gray
};

/**
 * Generate constellation positions from entries
 */
const generateConstellation = (entries, width, height) => {
  if (!entries.length) return { stars: [], connections: [] };
  
  const padding = 50;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  
  // Create stars from entries
  const stars = entries.slice(0, 50).map((entry, index) => {
    // Position based on date (x) and mood sentiment (y)
    const date = entry.createdAt?.toDate?.() || new Date(entry.createdAt);
    const timeSpan = Date.now() - date.getTime();
    const maxTimeSpan = 30 * 24 * 60 * 60 * 1000; // 30 days
    
    // X position based on time (recent = right)
    const x = padding + usableWidth * (1 - Math.min(timeSpan / maxTimeSpan, 1));
    
    // Y position based on mood + some randomness
    const moodY = {
      '😊': 0.2,
      '😌': 0.3,
      '😴': 0.5,
      '😢': 0.7,
      '😰': 0.75,
      '😤': 0.8
    };
    const baseY = moodY[entry.mood] || 0.5;
    const y = padding + usableHeight * (baseY + (Math.random() - 0.5) * 0.3);
    
    // Star size based on word count
    const wordCount = entry.content?.split(/\s+/).length || 0;
    const size = Math.min(Math.max(wordCount / 20, 3), 12);
    
    return {
      id: entry.id,
      x,
      y,
      size,
      mood: entry.mood,
      color: MOOD_COLORS[entry.mood] || MOOD_COLORS.default,
      date,
      wordCount,
      content: entry.content?.substring(0, 100),
      brightness: Math.random() * 0.5 + 0.5
    };
  });
  
  // Create connections between nearby stars with same mood
  const connections = [];
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const star1 = stars[i];
      const star2 = stars[j];
      
      // Calculate distance
      const dx = star2.x - star1.x;
      const dy = star2.y - star1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Connect if same mood and close enough
      if (star1.mood === star2.mood && distance < 150) {
        connections.push({
          id: `${star1.id}-${star2.id}`,
          x1: star1.x,
          y1: star1.y,
          x2: star2.x,
          y2: star2.y,
          color: star1.color,
          opacity: Math.max(0.1, 1 - distance / 150)
        });
      }
    }
  }
  
  return { stars, connections };
};

/**
 * Individual Star Component
 */
const StarPoint = ({ star, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <g>
      {/* Glow effect */}
      <motion.circle
        cx={star.x}
        cy={star.y}
        r={star.size + 8}
        fill={star.color}
        opacity={isHovered || isSelected ? 0.3 : 0}
        animate={{
          opacity: isHovered || isSelected ? [0.3, 0.5, 0.3] : 0
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Main star */}
      <motion.circle
        cx={star.x}
        cy={star.y}
        r={star.size}
        fill={star.color}
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSelect(star)}
        animate={{
          opacity: [star.brightness, star.brightness + 0.2, star.brightness],
          scale: isHovered ? 1.3 : 1
        }}
        transition={{
          opacity: { duration: 2 + Math.random() * 2, repeat: Infinity },
          scale: { duration: 0.2 }
        }}
      />
      
      {/* Star sparkle */}
      <motion.path
        d={`M${star.x},${star.y - star.size - 2} L${star.x},${star.y - star.size - 6}
            M${star.x},${star.y + star.size + 2} L${star.x},${star.y + star.size + 6}
            M${star.x - star.size - 2},${star.y} L${star.x - star.size - 6},${star.y}
            M${star.x + star.size + 2},${star.y} L${star.x + star.size + 6},${star.y}`}
        stroke={star.color}
        strokeWidth={1}
        opacity={isHovered ? 0.8 : 0}
      />
    </g>
  );
};

/**
 * Star Details Panel
 */
const StarDetails = ({ star, onClose }) => {
  if (!star) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-4 left-4 right-4 p-4 bg-deep-800/95 backdrop-blur border border-deep-600 rounded-xl"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{star.mood}</span>
          <div>
            <div className="text-sm text-cream-400">
              {star.date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <div className="text-xs text-cream-600">
              {star.wordCount >= 300 ? 'Deep reflection' : star.wordCount >= 100 ? 'Thoughtful entry' : 'Quick thought'}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-cream-500 hover:text-cream-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm text-cream-300 line-clamp-2">
        {star.content}...
      </p>
    </motion.div>
  );
};

/**
 * Constellation Stats
 */
const ConstellationStats = ({ stars }) => {
  const stats = useMemo(() => {
    const moodCounts = {};
    stars.forEach(star => {
      moodCounts[star.mood] = (moodCounts[star.mood] || 0) + 1;
    });
    
    return {
      totalStars: stars.length,
      moodCounts,
      brightestMood: Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0]
    };
  }, [stars]);
  
  return (
    <div className="absolute top-4 left-4 p-3 bg-deep-800/80 backdrop-blur rounded-xl border border-deep-600">
      <div className="flex items-center gap-2 mb-2">
        <Star className="w-4 h-4 text-amber-400" />
        <span className="text-sm text-cream-200">
          {stats.totalStars < 5 ? 'A few stars' : 
           stats.totalStars < 15 ? 'Growing constellation' : 
           stats.totalStars < 30 ? 'Bright sky' : 'Starry night'}
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {Object.entries(stats.moodCounts).map(([mood]) => (
          <span
            key={mood}
            className="px-2 py-0.5 rounded-full text-xs"
            style={{ backgroundColor: MOOD_COLORS[mood] + '30', color: MOOD_COLORS[mood] }}
          >
            {mood}
          </span>
        ))}
      </div>
    </div>
  );
};

/**
 * Main Mood Constellations Component
 */
const MoodConstellations = ({ isOpen, onClose, entries = [] }) => {
  const [selectedStar, setSelectedStar] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  const dimensions = { width: 800, height: 600 };
  
  const constellation = useMemo(() => 
    generateConstellation(entries, dimensions.width, dimensions.height),
    [entries]
  );
  
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'circle') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedStar(null);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bento-item max-w-4xl w-full my-8 p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-cream-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Mood Constellations</h2>
                <p className="text-sm text-cream-200">Your emotional universe</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Canvas */}
        <div 
          ref={containerRef}
          className="relative bg-gradient-to-b from-deep-900 via-indigo-950 to-deep-900 overflow-hidden"
          style={{ height: '500px' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Background stars */}
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.1,
                  animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`
                }}
              />
            ))}
          </div>
          
          {/* Constellation SVG */}
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
          >
            {/* Connections */}
            {constellation.connections.map(conn => (
              <motion.line
                key={conn.id}
                x1={conn.x1}
                y1={conn.y1}
                x2={conn.x2}
                y2={conn.y2}
                stroke={conn.color}
                strokeWidth={1}
                opacity={conn.opacity}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: Math.random() * 0.5 }}
              />
            ))}
            
            {/* Stars */}
            {constellation.stars.map(star => (
              <StarPoint
                key={star.id}
                star={star}
                isSelected={selectedStar?.id === star.id}
                onSelect={setSelectedStar}
              />
            ))}
          </svg>
          
          {/* Stats */}
          <ConstellationStats stars={constellation.stars} />
          
          {/* Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
              className="p-2 bg-deep-800/80 backdrop-blur rounded-xl border border-deep-600 text-cream-300 hover:text-cream-100"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
              className="p-2 bg-deep-800/80 backdrop-blur rounded-xl border border-deep-600 text-cream-300 hover:text-cream-100"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={resetView}
              className="p-2 bg-deep-800/80 backdrop-blur rounded-xl border border-deep-600 text-cream-300 hover:text-cream-100"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-4 right-4 p-3 bg-deep-800/80 backdrop-blur rounded-xl border border-deep-600">
            <div className="text-xs text-cream-400 mb-2">Mood Colors</div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(MOOD_COLORS).filter(([k]) => k !== 'default').map(([mood, color]) => (
                <div key={mood} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sm">{mood}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Selected Star Details */}
          <AnimatePresence>
            {selectedStar && (
              <StarDetails star={selectedStar} onClose={() => setSelectedStar(null)} />
            )}
          </AnimatePresence>
        </div>
        
        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </motion.div>
    </div>
  );
};

export default MoodConstellations;
