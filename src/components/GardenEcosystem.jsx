/**
 * Garden Ecosystem Component
 * Animated creatures that visit the garden based on mood variety and journaling activity
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Creature definitions with unlock conditions
 */
const CREATURES = {
  butterfly: {
    id: 'butterfly',
    name: 'Butterfly',
    emoji: '🦋',
    description: 'Visits gardens with mood variety',
    unlockCondition: (stats) => stats.uniqueMoods >= 3,
    rarity: 'common',
    color: '#a855f7'
  },
  bee: {
    id: 'bee',
    name: 'Busy Bee',
    emoji: '🐝',
    description: 'Loves active journalers',
    unlockCondition: (stats) => stats.entriesThisWeek >= 5,
    rarity: 'common',
    color: '#fbbf24'
  },
  ladybug: {
    id: 'ladybug',
    name: 'Lucky Ladybug',
    emoji: '🐞',
    description: 'Appears on happy days',
    unlockCondition: (stats) => stats.happyEntries >= 3,
    rarity: 'common',
    color: '#ef4444'
  },
  bluebird: {
    id: 'bluebird',
    name: 'Bluebird',
    emoji: '🐦',
    description: 'Sings for consistent journalers',
    unlockCondition: (stats) => stats.currentStreak >= 3,
    rarity: 'uncommon',
    color: '#3b82f6'
  },
  bunny: {
    id: 'bunny',
    name: 'Garden Bunny',
    emoji: '🐰',
    description: 'Hops by for morning writers',
    unlockCondition: (stats) => stats.morningEntries >= 5,
    rarity: 'uncommon',
    color: '#f9a8d4'
  },
  squirrel: {
    id: 'squirrel',
    name: 'Curious Squirrel',
    emoji: '🐿️',
    description: 'Collects words from long entries',
    unlockCondition: (stats) => stats.totalWords >= 5000,
    rarity: 'uncommon',
    color: '#92400e'
  },
  owl: {
    id: 'owl',
    name: 'Wise Owl',
    emoji: '🦉',
    description: 'Watches over night writers',
    unlockCondition: (stats) => stats.nightEntries >= 10,
    rarity: 'rare',
    color: '#6b7280'
  },
  deer: {
    id: 'deer',
    name: 'Gentle Deer',
    emoji: '🦌',
    description: 'Visits peaceful gardens',
    unlockCondition: (stats) => stats.calmEntries >= 10,
    rarity: 'rare',
    color: '#d97706'
  },
  fox: {
    id: 'fox',
    name: 'Clever Fox',
    emoji: '🦊',
    description: 'Drawn to reflective writers',
    unlockCondition: (stats) => stats.totalEntries >= 50,
    rarity: 'rare',
    color: '#ea580c'
  },
  unicorn: {
    id: 'unicorn',
    name: 'Magical Unicorn',
    emoji: '🦄',
    description: 'Appears in legendary gardens',
    unlockCondition: (stats) => stats.currentStreak >= 30,
    rarity: 'legendary',
    color: '#ec4899'
  },
  dragon: {
    id: 'dragon',
    name: 'Garden Dragon',
    emoji: '🐉',
    description: 'Guards gardens of the devoted',
    unlockCondition: (stats) => stats.totalEntries >= 365,
    rarity: 'legendary',
    color: '#10b981'
  },
  phoenix: {
    id: 'phoenix',
    name: 'Phoenix',
    emoji: '🔥',
    description: 'Rises with those who overcome challenges',
    unlockCondition: (stats) => stats.recoveryEntries >= 5, // entries after sad with happy
    rarity: 'legendary',
    color: '#f97316'
  }
};

const RARITY_COLORS = {
  common: 'from-gray-500 to-gray-600',
  uncommon: 'from-green-500 to-green-600',
  rare: 'from-blue-500 to-purple-500',
  legendary: 'from-amber-400 to-orange-500'
};

/**
 * Calculate garden statistics from entries
 */
const calculateGardenStats = (entries, plantData) => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const stats = {
    totalEntries: entries.length,
    uniqueMoods: new Set(entries.map(e => e.mood).filter(Boolean)).size,
    entriesThisWeek: entries.filter(e => {
      const date = e.createdAt?.toDate?.() || new Date(e.createdAt);
      return date >= oneWeekAgo;
    }).length,
    happyEntries: entries.filter(e => e.mood === '😊').length,
    calmEntries: entries.filter(e => e.mood === '😌').length,
    morningEntries: entries.filter(e => {
      const date = e.createdAt?.toDate?.() || new Date(e.createdAt);
      const hours = date.getHours();
      return hours >= 5 && hours < 10;
    }).length,
    nightEntries: entries.filter(e => {
      const date = e.createdAt?.toDate?.() || new Date(e.createdAt);
      const hours = date.getHours();
      return hours >= 22 || hours < 5;
    }).length,
    totalWords: entries.reduce((sum, e) => sum + (e.content?.split(/\s+/).length || 0), 0),
    currentStreak: plantData?.currentStreak || 0,
    recoveryEntries: calculateRecoveryEntries(entries)
  };
  
  return stats;
};

/**
 * Count recovery patterns (sad entry followed by happy entry)
 */
const calculateRecoveryEntries = (entries) => {
  let count = 0;
  const sorted = [...entries].sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
    return dateA - dateB;
  });
  
  for (let i = 1; i < sorted.length; i++) {
    const prevMood = sorted[i - 1].mood;
    const currMood = sorted[i].mood;
    if ((prevMood === '😢' || prevMood === '😰') && currMood === '😊') {
      count++;
    }
  }
  
  return count;
};

/**
 * Animated Creature Component
 */
const AnimatedCreature = ({ creature, position, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const animations = {
    butterfly: {
      animate: {
        y: [0, -10, 0, -5, 0],
        x: [0, 5, -5, 3, 0],
        rotate: [0, 5, -5, 3, 0]
      },
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    bee: {
      animate: {
        y: [0, -5, 0, -3, 0],
        x: [0, 8, -8, 4, 0]
      },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    bluebird: {
      animate: {
        y: [0, -3, 0],
        rotate: [0, -5, 0, 5, 0]
      },
      transition: { duration: 2.5, repeat: Infinity }
    },
    default: {
      animate: {
        y: [0, -3, 0],
        scale: [1, 1.05, 1]
      },
      transition: { duration: 2, repeat: Infinity }
    }
  };
  
  const anim = animations[creature.id] || animations.default;
  
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: position.x, top: position.y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1, ...anim.animate }}
      transition={{ ...anim.transition }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(creature)}
    >
      <span className="text-3xl drop-shadow-lg">{creature.emoji}</span>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50"
          >
            <div className="bg-deep-800 border border-deep-600 rounded-xl px-3 py-2 whitespace-nowrap shadow-xl">
              <div className="text-sm font-medium text-cream-100">{creature.name}</div>
              <div className={`text-xs bg-gradient-to-r ${RARITY_COLORS[creature.rarity]} bg-clip-text text-transparent`}>
                {creature.rarity.charAt(0).toUpperCase() + creature.rarity.slice(1)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * Creature Details Modal
 */
const CreatureModal = ({ creature, isOpen, onClose, isUnlocked }) => {
  if (!isOpen || !creature) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-deep-800 border border-deep-600 rounded-2xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <motion.span 
            className="text-6xl block mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isUnlocked ? creature.emoji : '❓'}
          </motion.span>
          
          <h3 className="text-xl font-bold text-cream-100 mb-2">
            {isUnlocked ? creature.name : '???'}
          </h3>
          
          <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${RARITY_COLORS[creature.rarity]} text-white text-sm font-medium mb-4`}>
            {creature.rarity.charAt(0).toUpperCase() + creature.rarity.slice(1)}
          </div>
          
          <p className="text-cream-400 text-sm mb-6">
            {creature.description}
          </p>
          
          {isUnlocked ? (
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <span>✓</span>
              <span className="text-sm">Visiting your garden!</span>
            </div>
          ) : (
            <div className="text-cream-500 text-sm">
              Keep journaling to unlock!
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Garden Ecosystem Main Component
 */
const GardenEcosystem = ({ entries = [], plantData = {}, isVisible = true }) => {
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [creaturePositions, setCreaturePositions] = useState({});
  
  // Calculate stats and unlocked creatures
  const stats = useMemo(() => calculateGardenStats(entries, plantData), [entries, plantData]);
  
  const unlockedCreatures = useMemo(() => {
    return Object.values(CREATURES).filter(c => c.unlockCondition(stats));
  }, [stats]);
  
  // Generate random positions for creatures
  useEffect(() => {
    const positions = {};
    unlockedCreatures.forEach((creature, index) => {
      positions[creature.id] = {
        x: `${15 + (index * 20) % 70}%`,
        y: `${10 + Math.random() * 30}%`
      };
    });
    setCreaturePositions(positions);
  }, [unlockedCreatures.length]);
  
  if (!isVisible) return null;
  
  return (
    <div className="relative w-full h-full pointer-events-none">
      {/* Creatures */}
      <div className="pointer-events-auto">
        {unlockedCreatures.map((creature) => (
          <AnimatedCreature
            key={creature.id}
            creature={creature}
            position={creaturePositions[creature.id] || { x: '50%', y: '20%' }}
            onClick={setSelectedCreature}
          />
        ))}
      </div>
      
      {/* Creature Details Modal */}
      <CreatureModal
        creature={selectedCreature}
        isOpen={!!selectedCreature}
        onClose={() => setSelectedCreature(null)}
        isUnlocked={true}
      />
    </div>
  );
};

/**
 * Creature Collection/Bestiary Component
 */
export const CreatureCollection = ({ entries = [], plantData = {}, isOpen, onClose }) => {
  const stats = useMemo(() => calculateGardenStats(entries, plantData), [entries, plantData]);
  const [selectedCreature, setSelectedCreature] = useState(null);
  
  const creatures = Object.values(CREATURES);
  const unlockedIds = new Set(creatures.filter(c => c.unlockCondition(stats)).map(c => c.id));
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bento-item max-w-2xl w-full my-8 p-0 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-cream-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Garden Creatures</h2>
              <p className="text-sm text-cream-200">
                {unlockedIds.size === 0 ? 'Begin discovering' : 
                 unlockedIds.size < 5 ? 'A few friends found' : 
                 unlockedIds.size < 10 ? 'Growing community' : 'Thriving ecosystem'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Creature Grid */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {creatures.map((creature) => {
              const isUnlocked = unlockedIds.has(creature.id);
              
              return (
                <motion.button
                  key={creature.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCreature(creature)}
                  className={`p-4 rounded-2xl border transition-all ${
                    isUnlocked
                      ? 'bg-deep-600 border-deep-500 hover:border-deep-400'
                      : 'bg-deep-700/50 border-deep-600 opacity-60'
                  }`}
                >
                  <span className="text-3xl block mb-2">
                    {isUnlocked ? creature.emoji : '❓'}
                  </span>
                  <div className="text-xs text-cream-400 truncate">
                    {isUnlocked ? creature.name : '???'}
                  </div>
                  <div className={`text-xs mt-1 bg-gradient-to-r ${RARITY_COLORS[creature.rarity]} bg-clip-text text-transparent`}>
                    {creature.rarity}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
        
        {/* Selected Creature Modal */}
        <CreatureModal
          creature={selectedCreature}
          isOpen={!!selectedCreature}
          onClose={() => setSelectedCreature(null)}
          isUnlocked={selectedCreature ? unlockedIds.has(selectedCreature.id) : false}
        />
      </motion.div>
    </div>
  );
};

export default GardenEcosystem;
