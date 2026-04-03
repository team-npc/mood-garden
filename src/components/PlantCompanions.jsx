/**
 * Plant Companions Component
 * Discover companion plants as your practice grows
 * Philosophy: No quantification - companions appear as delightful surprises
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Award, Heart } from 'lucide-react';

/**
 * Companion definitions - unlock conditions hidden from user
 */
export const COMPANIONS = {
  // Early companions - appear naturally as you begin
  sprout: {
    id: 'sprout',
    name: 'Little Sprout',
    emoji: '🌱',
    description: 'A tiny friend who appears when you begin your journey',
    tier: 1,
    unlockCondition: { type: 'entries', value: 5 },
    position: { x: '15%', y: '75%' }
  },
  mushroom: {
    id: 'mushroom',
    name: 'Friendly Mushroom',
    emoji: '🍄',
    description: 'Grows in the shade of consistent practice',
    tier: 1,
    unlockCondition: { type: 'streak', value: 3 },
    position: { x: '80%', y: '78%' }
  },
  tulip: {
    id: 'tulip',
    name: 'Happy Tulip',
    emoji: '🌷',
    description: 'Blooms alongside your joy',
    tier: 1,
    unlockCondition: { type: 'mood', mood: '😊', value: 5 },
    position: { x: '25%', y: '70%' }
  },
  
  // Growing companions - appear as your practice develops
  sunflower: {
    id: 'sunflower',
    name: 'Sunny Sunflower',
    emoji: '🌻',
    description: 'Always faces the light of your dedication',
    tier: 2,
    unlockCondition: { type: 'entries', value: 25 },
    position: { x: '70%', y: '65%' }
  },
  clover: {
    id: 'clover',
    name: 'Lucky Clover',
    emoji: '🍀',
    description: 'Four leaves of fortune found through practice',
    tier: 2,
    unlockCondition: { type: 'streak', value: 7 },
    position: { x: '10%', y: '80%' }
  },
  cactus: {
    id: 'cactus',
    name: 'Resilient Cactus',
    emoji: '🌵',
    description: 'Thrives through all seasons of emotion',
    tier: 2,
    unlockCondition: { type: 'recovery', value: 3 },
    position: { x: '85%', y: '72%' }
  },
  
  // Deeper companions - discovered through continued practice
  rose: {
    id: 'rose',
    name: 'Beautiful Rose',
    emoji: '🌹',
    description: 'Symbol of self-love cultivated over time',
    tier: 3,
    unlockCondition: { type: 'words', value: 10000 },
    position: { x: '30%', y: '65%' }
  },
  bamboo: {
    id: 'bamboo',
    name: 'Zen Bamboo',
    emoji: '🎋',
    description: 'Brings inner peace through reflection',
    tier: 3,
    unlockCondition: { type: 'mood', mood: '😌', value: 20 },
    position: { x: '75%', y: '60%' }
  },
  bonsai: {
    id: 'bonsai',
    name: 'Ancient Bonsai',
    emoji: '🌳',
    description: 'Wisdom grows through patience',
    tier: 3,
    unlockCondition: { type: 'streak', value: 30 },
    position: { x: '50%', y: '85%' }
  },
  
  // Rare companions - special discoveries
  crystal: {
    id: 'crystal',
    name: 'Crystal Flower',
    emoji: '💎',
    description: 'A rare and precious friend',
    tier: 4,
    unlockCondition: { type: 'entries', value: 100 },
    position: { x: '20%', y: '60%' }
  },
  rainbow: {
    id: 'rainbow',
    name: 'Rainbow Orchid',
    emoji: '🌈',
    description: 'Celebrates all moods equally',
    tier: 4,
    unlockCondition: { type: 'moodVariety', value: 50 },
    position: { x: '60%', y: '55%' }
  },
  phoenix: {
    id: 'phoenix',
    name: 'Phoenix Flower',
    emoji: '🔥',
    description: 'Rises from every challenge',
    tier: 4,
    unlockCondition: { type: 'streak', value: 100 },
    position: { x: '40%', y: '58%' }
  }
};

// Gentle tier descriptions (no hierarchy emphasis)
const TIER_STYLES = {
  1: { bg: 'from-sage-400 to-sage-500', label: 'Garden Friends' },
  2: { bg: 'from-leaf-400 to-sage-500', label: 'Growing Together' },
  3: { bg: 'from-teal-400 to-leaf-500', label: 'Deep Roots' },
  4: { bg: 'from-amber-400 to-orange-500', label: 'Special Discoveries' }
};

/**
 * Check if a companion is unlocked
 */
const isCompanionUnlocked = (companion, stats) => {
  const { type, value, mood } = companion.unlockCondition;
  
  switch (type) {
    case 'entries':
      return stats.totalEntries >= value;
    case 'streak':
      return stats.currentStreak >= value || stats.longestStreak >= value;
    case 'mood':
      return (stats.moodCounts?.[mood] || 0) >= value;
    case 'words':
      return stats.totalWords >= value;
    case 'recovery':
      return stats.recoveryCount >= value;
    case 'moodVariety':
      const moods = ['😊', '😢', '😤', '😴', '😰', '😌'];
      return moods.every(m => (stats.moodCounts?.[m] || 0) >= value);
    default:
      return false;
  }
};

/**
 * Companion Display in Garden
 */
export const GardenCompanion = ({ companion, isUnlocked, onClick }) => {
  if (!isUnlocked) return null;
  
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onClick(companion)}
      className="absolute cursor-pointer"
      style={{ left: companion.position.x, bottom: companion.position.y }}
    >
      <motion.span
        className="text-3xl drop-shadow-lg block"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {companion.emoji}
      </motion.span>
    </motion.button>
  );
};

/**
 * Companion Collection Modal - No progress bars or percentages
 */
const PlantCompanions = ({ isOpen, onClose, stats }) => {
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  
  const companions = Object.values(COMPANIONS);
  const unlockedCompanions = useMemo(() => 
    companions.filter(c => isCompanionUnlocked(c, stats)),
    [stats]
  );
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bento-item max-w-2xl w-full my-8 p-0 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sage-600 to-leaf-600 p-6 text-cream-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Garden Friends</h2>
                <p className="text-sm text-sage-200">
                  {unlockedCompanions.length > 0 
                    ? 'Friends have joined your garden' 
                    : 'Friends will appear as you grow'}
                </p>
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
        
        <div className="p-6 overflow-y-auto">
          {/* Message about discovery */}
          <div className="mb-6 p-4 bg-deep-700/30 rounded-xl text-center">
            <p className="text-cream-400 text-sm">
              Garden friends appear naturally as you write and grow. 🌱<br/>
              <span className="text-cream-500">Each one finds you when the time is right.</span>
            </p>
          </div>
          
          {/* Discovered Companions */}
          {unlockedCompanions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-cream-100 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Friends in Your Garden
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {unlockedCompanions.map(companion => (
                  <motion.button
                    key={companion.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCompanion(companion)}
                    className="p-4 rounded-xl bg-leaf-500/20 border border-leaf-500/30 hover:border-leaf-400"
                  >
                    <span className="text-3xl block mb-2">{companion.emoji}</span>
                    <div className="text-xs text-cream-300 truncate">{companion.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          
          {/* Waiting to be discovered - Show as mystery */}
          {companions.length > unlockedCompanions.length && (
            <div>
              <h3 className="text-lg font-semibold text-cream-100 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-cream-500" />
                Waiting to be Discovered
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {companions
                  .filter(c => !isCompanionUnlocked(c, stats))
                  .map(companion => (
                    <motion.button
                      key={companion.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedCompanion(companion)}
                      className="p-4 rounded-xl bg-deep-700/50 border border-deep-600 opacity-60"
                    >
                      <span className="text-3xl block mb-2">❓</span>
                      <div className="text-xs text-cream-500">???</div>
                    </motion.button>
                  ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Selected Companion Detail - No progress shown */}
        <AnimatePresence>
          {selectedCompanion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedCompanion(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-deep-800 border border-deep-600 rounded-2xl p-6 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <motion.span
                    className="text-6xl block mb-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {isCompanionUnlocked(selectedCompanion, stats) 
                      ? selectedCompanion.emoji 
                      : '❓'}
                  </motion.span>
                  
                  <h3 className="text-xl font-bold text-cream-100 mb-1">
                    {isCompanionUnlocked(selectedCompanion, stats) 
                      ? selectedCompanion.name 
                      : 'Mystery Friend'}
                  </h3>
                  
                  <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${TIER_STYLES[selectedCompanion.tier].bg} text-white text-sm font-medium mb-3`}>
                    {TIER_STYLES[selectedCompanion.tier].label}
                  </div>
                  
                  <p className="text-cream-400 text-sm mb-4">
                    {isCompanionUnlocked(selectedCompanion, stats) 
                      ? selectedCompanion.description
                      : 'Keep growing and this friend may find you...'}
                  </p>
                  
                  {isCompanionUnlocked(selectedCompanion, stats) ? (
                    <div className="flex items-center justify-center gap-2 text-leaf-400">
                      <Sparkles className="w-5 h-5" />
                      <span>In your garden!</span>
                    </div>
                  ) : (
                    <div className="text-cream-500 text-sm">
                      🌱 This friend appears through your writing journey
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PlantCompanions;
