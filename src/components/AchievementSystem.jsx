/**
 * Achievement System
 * Gamification with badges, streaks, and milestone celebrations
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Star, 
  Flame, 
  Trophy, 
  Heart, 
  Zap,
  Sun,
  Moon,
  Sparkles,
  Target,
  Crown,
  Gift,
  Feather,
  Book,
  Calendar,
  Clock,
  Leaf,
  X
} from 'lucide-react';

// Achievement definitions
const ACHIEVEMENTS = {
  // Entry Milestones
  'first-entry': {
    id: 'first-entry',
    name: 'First Seed',
    description: 'Write your first journal entry',
    icon: Leaf,
    color: 'from-green-400 to-green-600',
    rarity: 'common',
    requirement: { type: 'entries', count: 1 }
  },
  'entries-10': {
    id: 'entries-10',
    name: 'Growing Garden',
    description: 'Write 10 journal entries',
    icon: Sparkles,
    color: 'from-sage-400 to-sage-600',
    rarity: 'common',
    requirement: { type: 'entries', count: 10 }
  },
  'entries-25': {
    id: 'entries-25',
    name: 'Flourishing',
    description: 'Write 25 journal entries',
    icon: Star,
    color: 'from-sage-400 to-sage-600',
    rarity: 'uncommon',
    requirement: { type: 'entries', count: 25 }
  },
  'entries-50': {
    id: 'entries-50',
    name: 'Dedicated Writer',
    description: 'Write 50 journal entries',
    icon: Book,
    color: 'from-blue-400 to-blue-600',
    rarity: 'uncommon',
    requirement: { type: 'entries', count: 50 }
  },
  'entries-100': {
    id: 'entries-100',
    name: 'Century Gardener',
    description: 'Write 100 journal entries',
    icon: Trophy,
    color: 'from-sage-500 to-sage-700',
    rarity: 'rare',
    requirement: { type: 'entries', count: 100 }
  },
  'entries-365': {
    id: 'entries-365',
    name: 'Year of Reflection',
    description: 'Write 365 journal entries',
    icon: Crown,
    color: 'from-sage-400 to-sage-600',
    rarity: 'legendary',
    requirement: { type: 'entries', count: 365 }
  },
  
  // Streak Achievements
  'streak-3': {
    id: 'streak-3',
    name: 'Getting Started',
    description: 'Journal for 3 consecutive days',
    icon: Flame,
    color: 'from-sage-400 to-sage-600',
    rarity: 'common',
    requirement: { type: 'streak', count: 3 }
  },
  'streak-7': {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Journal for 7 consecutive days',
    icon: Flame,
    color: 'from-sage-500 to-earth-500',
    rarity: 'uncommon',
    requirement: { type: 'streak', count: 7 }
  },
  'streak-14': {
    id: 'streak-14',
    name: 'Fortnight Focus',
    description: 'Journal for 14 consecutive days',
    icon: Zap,
    color: 'from-sage-400 to-sage-500',
    rarity: 'uncommon',
    requirement: { type: 'streak', count: 14 }
  },
  'streak-30': {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Journal for 30 consecutive days',
    icon: Award,
    color: 'from-sage-500 to-sage-600',
    rarity: 'rare',
    requirement: { type: 'streak', count: 30 }
  },
  'streak-60': {
    id: 'streak-60',
    name: 'Steadfast Spirit',
    description: 'Journal for 60 consecutive days',
    icon: Trophy,
    color: 'from-sage-500 to-sage-700',
    rarity: 'rare',
    requirement: { type: 'streak', count: 60 }
  },
  'streak-100': {
    id: 'streak-100',
    name: 'Century Streak',
    description: 'Journal for 100 consecutive days',
    icon: Crown,
    color: 'from-sage-400 to-sage-600',
    rarity: 'epic',
    requirement: { type: 'streak', count: 100 }
  },
  'streak-365': {
    id: 'streak-365',
    name: 'Legendary Dedication',
    description: 'Journal for 365 consecutive days',
    icon: Crown,
    color: 'from-sage-300 via-sage-400 to-sage-500',
    rarity: 'legendary',
    requirement: { type: 'streak', count: 365 }
  },
  
  // Time-based Achievements
  'early-bird': {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Write an entry before 6 AM',
    icon: Sun,
    color: 'from-sage-300 to-sage-400',
    rarity: 'uncommon',
    requirement: { type: 'time', condition: 'before6am' }
  },
  'night-owl': {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Write an entry after 11 PM',
    icon: Moon,
    color: 'from-sage-600 to-sage-700',
    rarity: 'uncommon',
    requirement: { type: 'time', condition: 'after11pm' }
  },
  'weekend-writer': {
    id: 'weekend-writer',
    name: 'Weekend Writer',
    description: 'Write on 10 weekends',
    icon: Calendar,
    color: 'from-sage-400 to-earth-500',
    rarity: 'uncommon',
    requirement: { type: 'weekendEntries', count: 10 }
  },
  
  // Word Count Achievements
  'words-1000': {
    id: 'words-1000',
    name: 'Finding Your Voice',
    description: 'Write 1,000 total words',
    icon: Feather,
    color: 'from-sky-400 to-blue-500',
    rarity: 'common',
    requirement: { type: 'totalWords', count: 1000 }
  },
  'words-10000': {
    id: 'words-10000',
    name: 'Storyteller',
    description: 'Write 10,000 total words',
    icon: Book,
    color: 'from-sage-500 to-sage-700',
    rarity: 'uncommon',
    requirement: { type: 'totalWords', count: 10000 }
  },
  'words-50000': {
    id: 'words-50000',
    name: 'Novelist',
    description: 'Write 50,000 total words',
    icon: Trophy,
    color: 'from-sage-400 to-sage-500',
    rarity: 'rare',
    requirement: { type: 'totalWords', count: 50000 }
  },
  'long-entry': {
    id: 'long-entry',
    name: 'Deep Reflection',
    description: 'Write an entry with 500+ words',
    icon: Heart,
    color: 'from-sage-400 to-earth-500',
    rarity: 'uncommon',
    requirement: { type: 'singleEntryWords', count: 500 }
  },
  
  // Plant Growth Achievements
  'plant-sprout': {
    id: 'plant-sprout',
    name: 'First Sprout',
    description: 'Grow your plant to sprout stage',
    icon: Leaf,
    color: 'from-sage-400 to-sage-500',
    rarity: 'common',
    requirement: { type: 'plantStage', stage: 'sprout' }
  },
  'plant-blooming': {
    id: 'plant-blooming',
    name: 'First Bloom',
    description: 'Grow your plant to blooming stage',
    icon: Sparkles,
    color: 'from-sage-400 to-earth-400',
    rarity: 'uncommon',
    requirement: { type: 'plantStage', stage: 'blooming' }
  },
  'plant-tree': {
    id: 'plant-tree',
    name: 'Mighty Oak',
    description: 'Grow your plant to tree stage',
    icon: Award,
    color: 'from-sage-400 to-sage-600',
    rarity: 'rare',
    requirement: { type: 'plantStage', stage: 'tree' }
  },
  'plant-fruiting': {
    id: 'plant-fruiting',
    name: 'Harvest Master',
    description: 'Grow your plant to fruiting tree stage',
    icon: Crown,
    color: 'from-sage-400 to-sage-600',
    rarity: 'epic',
    requirement: { type: 'plantStage', stage: 'fruitingTree' }
  },
  
  // Special Achievements
  'comeback': {
    id: 'comeback',
    name: 'Comeback Kid',
    description: 'Return after 7+ days away',
    icon: Heart,
    color: 'from-sage-400 to-earth-500',
    rarity: 'uncommon',
    requirement: { type: 'special', condition: 'comeback' }
  },
  'consistent-mood': {
    id: 'consistent-mood',
    name: 'Emotional Explorer',
    description: 'Use 10 different mood emojis',
    icon: Star,
    color: 'from-sage-500 to-sage-600',
    rarity: 'uncommon',
    requirement: { type: 'uniqueMoods', count: 10 }
  },
  'first-flower': {
    id: 'first-flower',
    name: 'First Flower',
    description: 'Earn your first flower reward',
    icon: Gift,
    color: 'from-sage-300 to-earth-400',
    rarity: 'common',
    requirement: { type: 'flowers', count: 1 }
  },
  'first-fruit': {
    id: 'first-fruit',
    name: 'First Fruit',
    description: 'Earn your first fruit reward',
    icon: Gift,
    color: 'from-earth-400 to-sage-500',
    rarity: 'uncommon',
    requirement: { type: 'fruits', count: 1 }
  }
};

const RARITY_CONFIG = {
  common: { 
    label: 'Common', 
    bgColor: 'bg-gray-100 dark:bg-gray-700',
    borderColor: 'border-gray-300 dark:border-gray-600',
    textColor: 'text-gray-600 dark:text-gray-400'
  },
  uncommon: { 
    label: 'Uncommon', 
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    borderColor: 'border-green-300 dark:border-green-700',
    textColor: 'text-green-600 dark:text-green-400'
  },
  rare: { 
    label: 'Rare', 
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    borderColor: 'border-blue-300 dark:border-blue-700',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  epic: { 
    label: 'Epic', 
    bgColor: 'bg-sage-50 dark:bg-sage-900/30',
    borderColor: 'border-sage-300 dark:border-sage-700',
    textColor: 'text-sage-600 dark:text-sage-400'
  },
  legendary: { 
    label: 'Legendary', 
    bgColor: 'bg-gradient-to-br from-sage-50 to-earth-50 dark:from-sage-900/30 dark:to-earth-900/30',
    borderColor: 'border-sage-400 dark:border-sage-600',
    textColor: 'text-sage-600 dark:text-sage-400'
  }
};

// Achievement Badge Component
const AchievementBadge = ({ achievement, unlocked = false, showDetails = true, size = 'md' }) => {
  const Icon = achievement.icon;
  const rarity = RARITY_CONFIG[achievement.rarity];
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };
  
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={unlocked ? { scale: 1.05 } : {}}
      className={`
        relative flex flex-col items-center
        ${unlocked ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      {/* Badge Circle */}
      <div className={`
        ${sizeClasses[size]} rounded-full
        ${unlocked 
          ? `bg-gradient-to-br ${achievement.color} shadow-lg` 
          : 'bg-gray-200 dark:bg-gray-700'
        }
        flex items-center justify-center
        border-4 ${unlocked ? 'border-white/30' : 'border-gray-300 dark:border-gray-600'}
        transition-all duration-300
        ${unlocked ? 'animate-pulse-soft' : ''}
      `}>
        <Icon className={`
          ${iconSizes[size]}
          ${unlocked ? 'text-white' : 'text-gray-400 dark:text-gray-500'}
        `} />
        
        {/* Locked Overlay */}
        {!unlocked && (
          <div className="absolute inset-0 rounded-full bg-gray-900/20 flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>
        )}
      </div>
      
      {/* Badge Info */}
      {showDetails && (
        <div className="mt-2 text-center">
          <p className={`
            text-sm font-medium
            ${unlocked ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}
          `}>
            {achievement.name}
          </p>
          <span className={`text-xs ${rarity.textColor}`}>
            {rarity.label}
          </span>
        </div>
      )}
      
      {/* Shine Effect for unlocked */}
      {unlocked && (
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
        </div>
      )}
    </motion.div>
  );
};

// Achievement Unlock Notification
const AchievementNotification = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const Icon = achievement.icon;
  const rarity = RARITY_CONFIG[achievement.rarity];

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className={`
        fixed top-4 right-4 z-50
        max-w-sm w-full p-4
        bg-white dark:bg-gray-800
        rounded-2xl shadow-luxury-lg
        border-2 ${rarity.borderColor}
        backdrop-blur-xl
      `}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-center gap-4">
        {/* Badge */}
        <div className={`
          w-16 h-16 rounded-full
          bg-gradient-to-br ${achievement.color}
          flex items-center justify-center
          shadow-lg animate-bounce-gentle
        `}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <p className="text-xs text-sage-600 dark:text-sage-400 font-medium uppercase tracking-wide">
            Achievement Unlocked!
          </p>
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {achievement.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {achievement.description}
          </p>
          <span className={`text-xs ${rarity.textColor} font-medium`}>
            {rarity.label}
          </span>
        </div>
      </div>
      
      {/* Confetti effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: ['#fbbf24', '#f472b6', '#60a5fa', '#34d399'][i % 4],
              left: `${Math.random() * 100}%`,
              top: '-10px'
            }}
            animate={{
              y: [0, 300],
              x: [0, (Math.random() - 0.5) * 100],
              rotate: [0, 720],
              opacity: [1, 0]
            }}
            transition={{
              duration: 2,
              delay: Math.random() * 0.5,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Achievement Gallery Component
const AchievementGallery = ({ unlockedAchievements = [], onClose }) => {
  const [filter, setFilter] = useState('all');
  
  const filteredAchievements = Object.values(ACHIEVEMENTS).filter(achievement => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return unlockedAchievements.includes(achievement.id);
    if (filter === 'locked') return !unlockedAchievements.includes(achievement.id);
    return achievement.rarity === filter;
  });

  const stats = {
    total: Object.keys(ACHIEVEMENTS).length,
    unlocked: unlockedAchievements.length,
    percentage: Math.round((unlockedAchievements.length / Object.keys(ACHIEVEMENTS).length) * 100)
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-gray-800 rounded-3xl shadow-luxury-lg overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                🏆 Achievement Gallery
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {stats.unlocked} of {stats.total} achievements unlocked ({stats.percentage}%)
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.percentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-sage-400 via-sage-500 to-earth-400"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {['all', 'unlocked', 'locked', 'common', 'uncommon', 'rare', 'epic', 'legendary'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
                  transition-all duration-200
                  ${filter === f 
                    ? 'bg-sage-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Achievement Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredAchievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                unlocked={unlockedAchievements.includes(achievement.id)}
                size="md"
              />
            ))}
          </div>
          
          {filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No achievements found with this filter
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Hook for managing achievements
const useAchievements = (userId) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState(null);
  const [showGallery, setShowGallery] = useState(false);

  // Load achievements from localStorage
  useEffect(() => {
    if (userId) {
      const saved = localStorage.getItem(`moodGarden_achievements_${userId}`);
      if (saved) {
        setUnlockedAchievements(JSON.parse(saved));
      }
    }
  }, [userId]);

  // Save achievements
  const saveAchievements = useCallback((achievements) => {
    if (userId) {
      localStorage.setItem(`moodGarden_achievements_${userId}`, JSON.stringify(achievements));
    }
  }, [userId]);

  // Check and unlock achievement
  const checkAchievement = useCallback((achievementId) => {
    if (!unlockedAchievements.includes(achievementId)) {
      const achievement = ACHIEVEMENTS[achievementId];
      if (achievement) {
        const updated = [...unlockedAchievements, achievementId];
        setUnlockedAchievements(updated);
        saveAchievements(updated);
        setNewAchievement(achievement);
        return true;
      }
    }
    return false;
  }, [unlockedAchievements, saveAchievements]);

  // Check all achievements based on stats
  const checkAllAchievements = useCallback((stats) => {
    const newlyUnlocked = [];
    
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      if (unlockedAchievements.includes(achievement.id)) return;
      
      const { requirement } = achievement;
      let shouldUnlock = false;
      
      switch (requirement.type) {
        case 'entries':
          shouldUnlock = stats.totalEntries >= requirement.count;
          break;
        case 'streak':
          shouldUnlock = stats.currentStreak >= requirement.count || stats.longestStreak >= requirement.count;
          break;
        case 'totalWords':
          shouldUnlock = stats.totalWords >= requirement.count;
          break;
        case 'plantStage':
          shouldUnlock = stats.plantStage === requirement.stage;
          break;
        case 'flowers':
          shouldUnlock = stats.flowers >= requirement.count;
          break;
        case 'fruits':
          shouldUnlock = stats.fruits >= requirement.count;
          break;
        case 'uniqueMoods':
          shouldUnlock = stats.uniqueMoods >= requirement.count;
          break;
        // Add more cases as needed
      }
      
      if (shouldUnlock) {
        newlyUnlocked.push(achievement.id);
      }
    });
    
    if (newlyUnlocked.length > 0) {
      const updated = [...unlockedAchievements, ...newlyUnlocked];
      setUnlockedAchievements(updated);
      saveAchievements(updated);
      
      // Show first new achievement
      setNewAchievement(ACHIEVEMENTS[newlyUnlocked[0]]);
    }
    
    return newlyUnlocked;
  }, [unlockedAchievements, saveAchievements]);

  const dismissNotification = useCallback(() => {
    setNewAchievement(null);
  }, []);

  return {
    unlockedAchievements,
    newAchievement,
    showGallery,
    setShowGallery,
    checkAchievement,
    checkAllAchievements,
    dismissNotification,
    totalAchievements: Object.keys(ACHIEVEMENTS).length
  };
};

export { 
  ACHIEVEMENTS, 
  AchievementBadge, 
  AchievementNotification, 
  AchievementGallery,
  useAchievements 
};

export default AchievementGallery;
