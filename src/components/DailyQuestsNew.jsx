/**
 * Daily Quests Component
 * Gamification with daily/weekly challenges and XP rewards
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  X, 
  Star, 
  Zap, 
  Trophy,
  CheckCircle,
  Clock,
  Flame,
  Calendar,
  Gift,
  ChevronRight
} from 'lucide-react';

const QUESTS_KEY = 'mood-garden-quests';
const LAST_RESET_KEY = 'mood-garden-quests-reset';

/**
 * Quest definitions
 */
const DAILY_QUESTS = [
  {
    id: 'write-entry',
    name: 'Plant a Thought',
    description: 'Write at least one journal entry today',
    xp: 50,
    type: 'daily',
    checkCondition: (stats) => stats.todayEntries >= 1,
    icon: '📝'
  },
  {
    id: 'write-long',
    name: 'Deep Reflection',
    description: 'Write an entry with 100+ words',
    xp: 75,
    type: 'daily',
    checkCondition: (stats) => stats.longestEntryToday >= 100,
    icon: '📖'
  },
  {
    id: 'use-tag',
    name: 'Organizer',
    description: 'Add a tag to your entry',
    xp: 25,
    type: 'daily',
    checkCondition: (stats) => stats.entriesWithTagsToday >= 1,
    icon: '🏷️'
  },
  {
    id: 'morning-writer',
    name: 'Early Bird',
    description: 'Write an entry before 10 AM',
    xp: 100,
    type: 'daily',
    checkCondition: (stats) => stats.morningEntryToday,
    icon: '🌅'
  },
  {
    id: 'evening-writer',
    name: 'Night Owl',
    description: 'Write an entry after 8 PM',
    xp: 75,
    type: 'daily',
    checkCondition: (stats) => stats.eveningEntryToday,
    icon: '🌙'
  },
  {
    id: 'use-prompt',
    name: 'Inspired',
    description: 'Write using a writing prompt',
    xp: 50,
    type: 'daily',
    checkCondition: (stats) => stats.usedPromptToday,
    icon: '💡'
  },
  {
    id: 'gratitude',
    name: 'Grateful Heart',
    description: 'Complete daily gratitude',
    xp: 75,
    type: 'daily',
    checkCondition: (stats) => stats.gratitudeToday,
    icon: '💖'
  }
];

const WEEKLY_QUESTS = [
  {
    id: 'streak-3',
    name: '3-Day Warrior',
    description: 'Maintain a 3-day streak',
    xp: 150,
    type: 'weekly',
    checkCondition: (stats) => stats.currentStreak >= 3,
    icon: '🔥'
  },
  {
    id: 'streak-7',
    name: 'Week Champion',
    description: 'Maintain a 7-day streak',
    xp: 500,
    type: 'weekly',
    checkCondition: (stats) => stats.currentStreak >= 7,
    icon: '👑'
  },
  {
    id: 'entries-5',
    name: 'Dedicated Writer',
    description: 'Write 5 entries this week',
    xp: 200,
    type: 'weekly',
    checkCondition: (stats) => stats.weekEntries >= 5,
    icon: '✨'
  },
  {
    id: 'words-1000',
    name: 'Wordsmith',
    description: 'Write 1000 words this week',
    xp: 300,
    type: 'weekly',
    checkCondition: (stats) => stats.weekWords >= 1000,
    icon: '📚'
  },
  {
    id: 'mood-variety',
    name: 'Emotional Range',
    description: 'Log 4 different moods this week',
    xp: 250,
    type: 'weekly',
    checkCondition: (stats) => stats.uniqueMoodsThisWeek >= 4,
    icon: '🎭'
  },
  {
    id: 'weekend-writer',
    name: 'Weekend Reflector',
    description: 'Write entries on both Saturday and Sunday',
    xp: 200,
    type: 'weekly',
    checkCondition: (stats) => stats.saturdayEntry && stats.sundayEntry,
    icon: '🌴'
  }
];

/**
 * XP level thresholds
 */
const LEVELS = [
  { level: 1, xpRequired: 0, title: 'Seedling' },
  { level: 2, xpRequired: 100, title: 'Sprout' },
  { level: 3, xpRequired: 300, title: 'Sapling' },
  { level: 4, xpRequired: 600, title: 'Growing Plant' },
  { level: 5, xpRequired: 1000, title: 'Flourishing' },
  { level: 6, xpRequired: 1500, title: 'Blooming' },
  { level: 7, xpRequired: 2200, title: 'Thriving' },
  { level: 8, xpRequired: 3000, title: 'Mature Plant' },
  { level: 9, xpRequired: 4000, title: 'Wise Oak' },
  { level: 10, xpRequired: 5500, title: 'Garden Master' },
  { level: 11, xpRequired: 7500, title: 'Nature Spirit' },
  { level: 12, xpRequired: 10000, title: 'Legendary Gardener' }
];

/**
 * Get level from XP
 */
const getLevel = (xp) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
};

/**
 * Get next level info
 */
const getNextLevel = (xp) => {
  const currentLevel = getLevel(xp);
  const nextLevelIndex = LEVELS.findIndex(l => l.level === currentLevel.level + 1);
  return nextLevelIndex >= 0 ? LEVELS[nextLevelIndex] : null;
};

/**
 * Calculate stats from entries for quest checking
 */
const calculateQuestStats = (entries, savedData) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  
  const todayEntries = entries.filter(e => {
    const date = e.createdAt?.toDate?.() || new Date(e.createdAt);
    return date.toISOString().split('T')[0] === today;
  });
  
  const weekEntries = entries.filter(e => {
    const date = e.createdAt?.toDate?.() || new Date(e.createdAt);
    return date >= startOfWeek;
  });
  
  return {
    todayEntries: todayEntries.length,
    longestEntryToday: Math.max(...todayEntries.map(e => e.content?.split(/\s+/).length || 0), 0),
    entriesWithTagsToday: todayEntries.filter(e => e.tags?.length > 0).length,
    morningEntryToday: todayEntries.some(e => {
      const date = e.createdAt?.toDate?.() || new Date(e.createdAt);
      return date.getHours() < 10;
    }),
    eveningEntryToday: todayEntries.some(e => {
      const date = e.createdAt?.toDate?.() || new Date(e.createdAt);
      return date.getHours() >= 20;
    }),
    usedPromptToday: savedData?.usedPromptToday || false,
    gratitudeToday: savedData?.gratitudeToday || false,
    currentStreak: savedData?.currentStreak || 0,
    weekEntries: weekEntries.length,
    weekWords: weekEntries.reduce((sum, e) => sum + (e.content?.split(/\s+/).length || 0), 0),
    uniqueMoodsThisWeek: new Set(weekEntries.map(e => e.mood).filter(Boolean)).size,
    saturdayEntry: weekEntries.some(e => {
      const date = e.createdAt?.toDate?.() || new Date(e.createdAt);
      return date.getDay() === 6;
    }),
    sundayEntry: weekEntries.some(e => {
      const date = e.createdAt?.toDate?.() || new Date(e.createdAt);
      return date.getDay() === 0;
    })
  };
};

/**
 * Quest Card Component
 */
const QuestCard = ({ quest, isCompleted, stats }) => {
  const progress = quest.checkCondition(stats) ? 100 : 0;
  
  return (
    <motion.div
      layout
      className={`p-4 rounded-xl border transition-all ${
        isCompleted
          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30'
          : 'bg-deep-700 border-deep-600'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          isCompleted ? 'bg-green-500/30' : 'bg-deep-600'
        }`}>
          {isCompleted ? '✅' : quest.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-cream-100">{quest.name}</span>
            {isCompleted && (
              <CheckCircle className="w-4 h-4 text-green-400" />
            )}
          </div>
          <p className="text-xs text-cream-500">{quest.description}</p>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 text-amber-400">
            <Zap className="w-4 h-4" />
            <span className="font-bold">{quest.xp}</span>
          </div>
          <span className="text-xs text-cream-600">XP</span>
        </div>
      </div>
      
      {!isCompleted && (
        <div className="mt-3 h-1.5 bg-deep-600 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  );
};

/**
 * Level Progress Component
 */
const LevelProgress = ({ totalXP }) => {
  const currentLevel = getLevel(totalXP);
  const nextLevel = getNextLevel(totalXP);
  
  const progress = nextLevel 
    ? ((totalXP - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100
    : 100;
  
  return (
    <div className="p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-cream-100">Level {currentLevel.level}</span>
          <span className="text-cream-400">- {currentLevel.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-amber-400">{totalXP} XP</span>
        </div>
      </div>
      
      <div className="h-3 bg-deep-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      {nextLevel && (
        <div className="flex justify-between text-xs text-cream-500 mt-1">
          <span>{totalXP - currentLevel.xpRequired} / {nextLevel.xpRequired - currentLevel.xpRequired}</span>
          <span>Next: Level {nextLevel.level} - {nextLevel.title}</span>
        </div>
      )}
    </div>
  );
};

/**
 * Main Daily Quests Component
 */
const DailyQuests = ({ isOpen, onClose, entries = [], plantData = {} }) => {
  const [questData, setQuestData] = useState({
    totalXP: 0,
    completedQuests: [],
    lastDailyReset: null,
    lastWeeklyReset: null
  });
  
  // Load saved quest data
  useEffect(() => {
    const saved = localStorage.getItem(QUESTS_KEY);
    if (saved) {
      try {
        setQuestData(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading quest data:', e);
      }
    }
  }, []);
  
  // Check for resets
  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentWeek = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
    
    let updated = false;
    let newData = { ...questData };
    
    // Daily reset
    if (questData.lastDailyReset !== today) {
      newData = {
        ...newData,
        completedQuests: newData.completedQuests.filter(id => 
          WEEKLY_QUESTS.some(q => q.id === id)
        ),
        lastDailyReset: today
      };
      updated = true;
    }
    
    // Weekly reset (Sunday)
    if (now.getDay() === 0 && questData.lastWeeklyReset !== currentWeek) {
      newData = {
        ...newData,
        completedQuests: [],
        lastWeeklyReset: currentWeek
      };
      updated = true;
    }
    
    if (updated) {
      setQuestData(newData);
      localStorage.setItem(QUESTS_KEY, JSON.stringify(newData));
    }
  }, [questData]);
  
  // Calculate quest stats
  const stats = useMemo(() => calculateQuestStats(entries, {
    currentStreak: plantData?.currentStreak || 0,
    usedPromptToday: false, // Would need to track this
    gratitudeToday: false // Would need to track this
  }), [entries, plantData]);
  
  // Check for newly completed quests
  useEffect(() => {
    const allQuests = [...DAILY_QUESTS, ...WEEKLY_QUESTS];
    let xpGained = 0;
    const newCompletions = [];
    
    allQuests.forEach(quest => {
      if (!questData.completedQuests.includes(quest.id) && quest.checkCondition(stats)) {
        newCompletions.push(quest.id);
        xpGained += quest.xp;
      }
    });
    
    if (newCompletions.length > 0) {
      const newData = {
        ...questData,
        totalXP: questData.totalXP + xpGained,
        completedQuests: [...questData.completedQuests, ...newCompletions]
      };
      setQuestData(newData);
      localStorage.setItem(QUESTS_KEY, JSON.stringify(newData));
    }
  }, [stats, questData]);
  
  // Get time until reset
  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  const completedDaily = DAILY_QUESTS.filter(q => questData.completedQuests.includes(q.id)).length;
  const completedWeekly = WEEKLY_QUESTS.filter(q => questData.completedQuests.includes(q.id)).length;
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bento-item max-w-lg w-full my-8 p-0 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-cream-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Daily Quests</h2>
                <p className="text-sm text-cream-200 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Resets in {getTimeUntilReset()}
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
        
        <div className="p-6 overflow-y-auto flex-1">
          {/* Level Progress */}
          <LevelProgress totalXP={questData.totalXP} />
          
          {/* Daily Quests */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-cream-100 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                Daily Quests
              </h3>
              <span className="text-sm text-cream-500">
                {completedDaily}/{DAILY_QUESTS.length}
              </span>
            </div>
            <div className="space-y-3">
              {DAILY_QUESTS.map(quest => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  isCompleted={questData.completedQuests.includes(quest.id)}
                  stats={stats}
                />
              ))}
            </div>
          </div>
          
          {/* Weekly Quests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-cream-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Weekly Quests
              </h3>
              <span className="text-sm text-cream-500">
                {completedWeekly}/{WEEKLY_QUESTS.length}
              </span>
            </div>
            <div className="space-y-3">
              {WEEKLY_QUESTS.map(quest => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  isCompleted={questData.completedQuests.includes(quest.id)}
                  stats={stats}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DailyQuests;
