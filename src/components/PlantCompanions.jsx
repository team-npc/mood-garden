/**
 * Plant Companions Component
 * Unlock companion plants (mushrooms, flowers) as milestones
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Check, Sparkles, Award } from 'lucide-react';

/**
 * Companion definitions with unlock conditions
 */
export const COMPANIONS = {
  // Tier 1 - Easy to unlock
  sprout: {
    id: 'sprout',
    name: 'Little Sprout',
    emoji: '🌱',
    description: 'A tiny plant friend',
    tier: 1,
    unlockCondition: { type: 'entries', value: 5 },
    unlockText: 'Write 5 journal entries',
    position: { x: '15%', y: '75%' }
  },
  mushroom: {
    id: 'mushroom',
    name: 'Friendly Mushroom',
    emoji: '🍄',
    description: 'Grows in the shade',
    tier: 1,
    unlockCondition: { type: 'streak', value: 3 },
    unlockText: '3-day journaling streak',
    position: { x: '80%', y: '78%' }
  },
  tulip: {
    id: 'tulip',
    name: 'Happy Tulip',
    emoji: '🌷',
    description: 'Blooms with positivity',
    tier: 1,
    unlockCondition: { type: 'mood', mood: '😊', value: 5 },
    unlockText: '5 happy mood entries',
    position: { x: '25%', y: '70%' }
  },
  
  // Tier 2 - Medium difficulty
  sunflower: {
    id: 'sunflower',
    name: 'Sunny Sunflower',
    emoji: '🌻',
    description: 'Always faces the light',
    tier: 2,
    unlockCondition: { type: 'entries', value: 25 },
    unlockText: 'Write 25 journal entries',
    position: { x: '70%', y: '65%' }
  },
  clover: {
    id: 'clover',
    name: 'Lucky Clover',
    emoji: '🍀',
    description: 'Four leaves of fortune',
    tier: 2,
    unlockCondition: { type: 'streak', value: 7 },
    unlockText: '7-day journaling streak',
    position: { x: '10%', y: '80%' }
  },
  cactus: {
    id: 'cactus',
    name: 'Resilient Cactus',
    emoji: '🌵',
    description: 'Thrives through tough times',
    tier: 2,
    unlockCondition: { type: 'recovery', value: 3 },
    unlockText: '3 recovery patterns (sad → happy)',
    position: { x: '85%', y: '72%' }
  },
  
  // Tier 3 - Hard
  rose: {
    id: 'rose',
    name: 'Beautiful Rose',
    emoji: '🌹',
    description: 'Symbol of self-love',
    tier: 3,
    unlockCondition: { type: 'words', value: 10000 },
    unlockText: 'Write 10,000 words total',
    position: { x: '30%', y: '65%' }
  },
  bamboo: {
    id: 'bamboo',
    name: 'Zen Bamboo',
    emoji: '🎋',
    description: 'Brings inner peace',
    tier: 3,
    unlockCondition: { type: 'mood', mood: '😌', value: 20 },
    unlockText: '20 calm mood entries',
    position: { x: '75%', y: '60%' }
  },
  bonsai: {
    id: 'bonsai',
    name: 'Ancient Bonsai',
    emoji: '🌳',
    description: 'Wisdom through patience',
    tier: 3,
    unlockCondition: { type: 'streak', value: 30 },
    unlockText: '30-day journaling streak',
    position: { x: '50%', y: '85%' }
  },
  
  // Tier 4 - Legendary
  crystal: {
    id: 'crystal',
    name: 'Crystal Flower',
    emoji: '💎',
    description: 'Rare and precious',
    tier: 4,
    unlockCondition: { type: 'entries', value: 100 },
    unlockText: 'Write 100 journal entries',
    position: { x: '20%', y: '60%' }
  },
  rainbow: {
    id: 'rainbow',
    name: 'Rainbow Orchid',
    emoji: '🌈',
    description: 'All moods are beautiful',
    tier: 4,
    unlockCondition: { type: 'moodVariety', value: 50 },
    unlockText: 'Use each mood 50+ times',
    position: { x: '60%', y: '55%' }
  },
  phoenix: {
    id: 'phoenix',
    name: 'Phoenix Flower',
    emoji: '🔥',
    description: 'Rises from challenges',
    tier: 4,
    unlockCondition: { type: 'streak', value: 100 },
    unlockText: '100-day journaling streak',
    position: { x: '40%', y: '58%' }
  }
};

const TIER_COLORS = {
  1: 'from-gray-400 to-gray-500',
  2: 'from-green-400 to-emerald-500',
  3: 'from-blue-400 to-purple-500',
  4: 'from-amber-400 to-orange-500'
};

const TIER_NAMES = {
  1: 'Common',
  2: 'Uncommon',
  3: 'Rare',
  4: 'Legendary'
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
      // Check if each mood has been used at least 'value' times
      const moods = ['😊', '😢', '😤', '😴', '😰', '😌'];
      return moods.every(m => (stats.moodCounts?.[m] || 0) >= value);
    default:
      return false;
  }
};

/**
 * Calculate progress toward unlocking
 */
const getUnlockProgress = (companion, stats) => {
  const { type, value, mood } = companion.unlockCondition;
  
  switch (type) {
    case 'entries':
      return Math.min(stats.totalEntries / value, 1);
    case 'streak':
      return Math.min(Math.max(stats.currentStreak, stats.longestStreak || 0) / value, 1);
    case 'mood':
      return Math.min((stats.moodCounts?.[mood] || 0) / value, 1);
    case 'words':
      return Math.min(stats.totalWords / value, 1);
    case 'recovery':
      return Math.min((stats.recoveryCount || 0) / value, 1);
    case 'moodVariety':
      const moods = ['😊', '😢', '😤', '😴', '😰', '😌'];
      const minCount = Math.min(...moods.map(m => stats.moodCounts?.[m] || 0));
      return Math.min(minCount / value, 1);
    default:
      return 0;
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
 * Companion Collection Modal
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
        <div className="bg-gradient-to-r from-earth-600 to-sage-600 p-6 text-cream-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Plant Companions</h2>
                <p className="text-sm text-cream-200">
                  {unlockedCompanions.length}/{companions.length} unlocked
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
          {/* Tiers */}
          {[4, 3, 2, 1].map(tier => {
            const tierCompanions = companions.filter(c => c.tier === tier);
            
            return (
              <div key={tier} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${TIER_COLORS[tier]} text-white text-sm font-medium`}>
                    {TIER_NAMES[tier]}
                  </div>
                  <span className="text-xs text-cream-500">
                    {tierCompanions.filter(c => isCompanionUnlocked(c, stats)).length}/{tierCompanions.length}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {tierCompanions.map(companion => {
                    const isUnlocked = isCompanionUnlocked(companion, stats);
                    const progress = getUnlockProgress(companion, stats);
                    
                    return (
                      <motion.button
                        key={companion.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedCompanion(companion)}
                        className={`p-4 rounded-xl border transition-all ${
                          isUnlocked
                            ? 'bg-deep-600 border-deep-500'
                            : 'bg-deep-700/50 border-deep-600 opacity-70'
                        }`}
                      >
                        <span className="text-3xl block mb-2">
                          {isUnlocked ? companion.emoji : '❓'}
                        </span>
                        <div className="text-xs text-cream-300 truncate">
                          {isUnlocked ? companion.name : '???'}
                        </div>
                        
                        {!isUnlocked && (
                          <div className="mt-2 h-1 bg-deep-600 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${TIER_COLORS[tier]}`}
                              style={{ width: `${progress * 100}%` }}
                            />
                          </div>
                        )}
                        
                        {isUnlocked && (
                          <div className="absolute top-1 right-1">
                            <Check className="w-4 h-4 text-green-400" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Selected Companion Detail */}
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
                      : '???'}
                  </h3>
                  
                  <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${TIER_COLORS[selectedCompanion.tier]} text-white text-sm font-medium mb-3`}>
                    {TIER_NAMES[selectedCompanion.tier]}
                  </div>
                  
                  <p className="text-cream-400 text-sm mb-4">
                    {selectedCompanion.description}
                  </p>
                  
                  {isCompanionUnlocked(selectedCompanion, stats) ? (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <Sparkles className="w-5 h-5" />
                      <span>Unlocked!</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm text-cream-500">
                        {selectedCompanion.unlockText}
                      </div>
                      <div className="h-2 bg-deep-600 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${TIER_COLORS[selectedCompanion.tier]}`}
                          style={{ width: `${getUnlockProgress(selectedCompanion, stats) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-cream-600">
                        {Math.round(getUnlockProgress(selectedCompanion, stats) * 100)}% complete
                      </div>
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
