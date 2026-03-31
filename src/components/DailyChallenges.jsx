/**
 * Daily Challenges System
 * Gamified writing challenges with rewards
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Trophy, 
  Flame, 
  Star, 
  Gift,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  X
} from 'lucide-react';

// Challenge Types
const CHALLENGE_TYPES = {
  wordCount: {
    icon: '📝',
    color: 'from-blue-400 to-blue-600',
    verify: (entries, target) => {
      const todayWords = entries
        .filter(e => isToday(e.createdAt))
        .reduce((sum, e) => sum + (e.content?.split(/\s+/).length || 0), 0);
      return todayWords >= target;
    }
  },
  entries: {
    icon: '📖',
    color: 'from-green-400 to-green-600',
    verify: (entries, target) => {
      const todayEntries = entries.filter(e => isToday(e.createdAt)).length;
      return todayEntries >= target;
    }
  },
  mood: {
    icon: '😊',
    color: 'from-yellow-400 to-orange-500',
    verify: (entries, target, details) => {
      const todayMoods = entries
        .filter(e => isToday(e.createdAt))
        .map(e => e.mood);
      return details.requiredMood 
        ? todayMoods.includes(details.requiredMood)
        : todayMoods.length >= target;
    }
  },
  streak: {
    icon: '🔥',
    color: 'from-orange-400 to-red-500',
    verify: (entries, target, details, userData) => {
      return (userData?.streak || 0) >= target;
    }
  },
  gratitude: {
    icon: '🙏',
    color: 'from-pink-400 to-rose-500',
    verify: (entries, target) => {
      const gratitudeEntries = entries
        .filter(e => isToday(e.createdAt))
        .filter(e => 
          e.content?.toLowerCase().includes('grateful') ||
          e.content?.toLowerCase().includes('thankful') ||
          e.content?.toLowerCase().includes('appreciate') ||
          e.tags?.includes('gratitude')
        );
      return gratitudeEntries.length >= target;
    }
  },
  reflection: {
    icon: '🪞',
    color: 'from-purple-400 to-indigo-500',
    verify: (entries, target) => {
      const reflectionEntries = entries
        .filter(e => isToday(e.createdAt))
        .filter(e => (e.content?.split(/\s+/).length || 0) >= 100);
      return reflectionEntries.length >= target;
    }
  },
  emotion: {
    icon: '💭',
    color: 'from-teal-400 to-cyan-500',
    verify: (entries, target) => {
      const uniqueMoods = new Set(
        entries.filter(e => isToday(e.createdAt)).map(e => e.mood).filter(Boolean)
      );
      return uniqueMoods.size >= target;
    }
  }
};

// Challenge Pool - Daily challenges are randomly selected from this pool
const CHALLENGE_POOL = [
  // Word Count Challenges
  { 
    id: 'words-100',
    type: 'wordCount',
    title: 'Quick Thoughts',
    description: 'Write at least 100 words today',
    target: 100,
    reward: 10,
    difficulty: 'easy'
  },
  { 
    id: 'words-300',
    type: 'wordCount',
    title: 'Deep Dive',
    description: 'Write at least 300 words in a single entry',
    target: 300,
    reward: 25,
    difficulty: 'medium'
  },
  { 
    id: 'words-500',
    type: 'wordCount',
    title: 'Storyteller',
    description: 'Write 500 words or more today',
    target: 500,
    reward: 50,
    difficulty: 'hard'
  },

  // Entry Challenges
  { 
    id: 'entries-2',
    type: 'entries',
    title: 'Double Down',
    description: 'Write 2 journal entries today',
    target: 2,
    reward: 20,
    difficulty: 'easy'
  },
  { 
    id: 'entries-3',
    type: 'entries',
    title: 'Triple Treat',
    description: 'Write 3 journal entries today',
    target: 3,
    reward: 40,
    difficulty: 'medium'
  },

  // Mood Challenges
  { 
    id: 'mood-positive',
    type: 'mood',
    title: 'Positive Vibes',
    description: 'Log a happy or grateful mood',
    target: 1,
    details: { requiredMood: '😊' },
    reward: 15,
    difficulty: 'easy'
  },
  { 
    id: 'mood-variety',
    type: 'emotion',
    title: 'Emotional Range',
    description: 'Express 3 different emotions today',
    target: 3,
    reward: 30,
    difficulty: 'medium'
  },

  // Gratitude Challenges
  { 
    id: 'gratitude-1',
    type: 'gratitude',
    title: 'Grateful Heart',
    description: 'Write about something you\'re grateful for',
    target: 1,
    reward: 20,
    difficulty: 'easy'
  },
  { 
    id: 'gratitude-3',
    type: 'gratitude',
    title: 'Abundance Mindset',
    description: 'Write about 3 things you\'re grateful for',
    target: 3,
    reward: 35,
    difficulty: 'medium'
  },

  // Reflection Challenges
  { 
    id: 'reflection-deep',
    type: 'reflection',
    title: 'Deep Reflection',
    description: 'Write a thoughtful entry with 100+ words',
    target: 1,
    reward: 25,
    difficulty: 'medium'
  },

  // Streak Challenges
  { 
    id: 'streak-3',
    type: 'streak',
    title: 'Consistency',
    description: 'Maintain a 3-day writing streak',
    target: 3,
    reward: 30,
    difficulty: 'medium'
  },
  { 
    id: 'streak-7',
    type: 'streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day writing streak',
    target: 7,
    reward: 75,
    difficulty: 'hard'
  }
];

// Helper function to check if date is today
const isToday = (dateValue) => {
  if (!dateValue) return false;
  const date = dateValue.seconds 
    ? new Date(dateValue.seconds * 1000) 
    : new Date(dateValue);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Get daily seed based on date
const getDailySeed = () => {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
};

// Seeded random for consistent daily selection
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Select daily challenges
const selectDailyChallenges = (count = 3) => {
  const seed = getDailySeed();
  const shuffled = [...CHALLENGE_POOL].sort((a, b) => {
    return seededRandom(seed + CHALLENGE_POOL.indexOf(a)) - 
           seededRandom(seed + CHALLENGE_POOL.indexOf(b));
  });
  
  // Ensure variety in difficulty
  const easy = shuffled.filter(c => c.difficulty === 'easy');
  const medium = shuffled.filter(c => c.difficulty === 'medium');
  const hard = shuffled.filter(c => c.difficulty === 'hard');
  
  return [
    easy[0] || shuffled[0],
    medium[0] || shuffled[1],
    (hard[0] || medium[1] || shuffled[2])
  ].filter(Boolean).slice(0, count);
};

// Challenge Context
const ChallengeContext = createContext(null);

export const ChallengeProvider = ({ children }) => {
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [challengeStreak, setChallengeStreak] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);

  // Load challenges and progress
  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('mood-garden-challenges');
    if (saved) {
      const { 
        date, 
        completed, 
        streak, 
        rewards,
        lastCompleteDate 
      } = JSON.parse(saved);
      
      const today = new Date().toDateString();
      
      // Check if it's a new day
      if (date === today) {
        setCompletedChallenges(completed || []);
      } else {
        // New day - reset completed challenges
        setCompletedChallenges([]);
        
        // Check streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastCompleteDate === yesterday.toDateString()) {
          setChallengeStreak(streak || 0);
        } else if (lastCompleteDate !== today) {
          setChallengeStreak(0);
        }
      }
      
      setTotalRewards(rewards || 0);
    }
    
    // Select today's challenges
    setDailyChallenges(selectDailyChallenges(3));
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem('mood-garden-challenges', JSON.stringify({
      date: new Date().toDateString(),
      completed: completedChallenges,
      streak: challengeStreak,
      rewards: totalRewards,
      lastCompleteDate: completedChallenges.length === 3 
        ? new Date().toDateString() 
        : localStorage.getItem('mood-garden-challenges')
          ? JSON.parse(localStorage.getItem('mood-garden-challenges')).lastCompleteDate
          : null
    }));
  }, [completedChallenges, challengeStreak, totalRewards]);

  // Check challenge completion
  const checkChallenges = (entries, userData = {}) => {
    const newCompleted = [];
    
    dailyChallenges.forEach(challenge => {
      if (completedChallenges.includes(challenge.id)) return;
      
      const config = CHALLENGE_TYPES[challenge.type];
      if (config.verify(entries, challenge.target, challenge.details, userData)) {
        newCompleted.push(challenge.id);
      }
    });

    if (newCompleted.length > 0) {
      const newRewards = dailyChallenges
        .filter(c => newCompleted.includes(c.id))
        .reduce((sum, c) => sum + c.reward, 0);
      
      setCompletedChallenges(prev => [...prev, ...newCompleted]);
      setTotalRewards(prev => prev + newRewards);

      // Check if all challenges completed
      if (completedChallenges.length + newCompleted.length >= dailyChallenges.length) {
        setChallengeStreak(prev => prev + 1);
      }

      return newCompleted.map(id => dailyChallenges.find(c => c.id === id));
    }

    return [];
  };

  // Get challenge progress
  const getChallengeProgress = (challenge, entries, userData = {}) => {
    const todayEntries = entries.filter(e => isToday(e.createdAt));
    
    switch (challenge.type) {
      case 'wordCount':
        return todayEntries.reduce((sum, e) => 
          sum + (e.content?.split(/\s+/).length || 0), 0);
      case 'entries':
        return todayEntries.length;
      case 'mood':
      case 'gratitude':
      case 'reflection':
        return completedChallenges.includes(challenge.id) ? challenge.target : 0;
      case 'streak':
        return userData?.streak || 0;
      case 'emotion':
        return new Set(todayEntries.map(e => e.mood).filter(Boolean)).size;
      default:
        return 0;
    }
  };

  return (
    <ChallengeContext.Provider value={{
      dailyChallenges,
      completedChallenges,
      challengeStreak,
      totalRewards,
      checkChallenges,
      getChallengeProgress,
      allCompleted: completedChallenges.length >= dailyChallenges.length
    }}>
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenges = () => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error('useChallenges must be used within a ChallengeProvider');
  }
  return context;
};

// Challenge Card Component
const ChallengeCard = ({ challenge, entries = [], userData = {}, compact = false }) => {
  const { completedChallenges, getChallengeProgress } = useChallenges();
  const isCompleted = completedChallenges.includes(challenge.id);
  const progress = getChallengeProgress(challenge, entries, userData);
  const progressPercent = Math.min((progress / challenge.target) * 100, 100);
  const config = CHALLENGE_TYPES[challenge.type];

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`
          p-3 rounded-xl flex items-center gap-3 transition-all
          ${isCompleted 
            ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          }
        `}
      >
        <span className="text-2xl">{config.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {challenge.title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {progress}/{challenge.target}
          </p>
        </div>
        {isCompleted ? (
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
        ) : (
          <span className="text-xs font-medium text-sage-600 dark:text-sage-400">
            +{challenge.reward}
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative overflow-hidden rounded-2xl p-5 transition-all
        ${isCompleted 
          ? 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40' 
          : 'bg-white dark:bg-gray-800'
        }
        border ${isCompleted 
          ? 'border-green-300 dark:border-green-700' 
          : 'border-gray-200 dark:border-gray-700'
        }
        shadow-sm
      `}
    >
      {/* Completion Badge */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute top-3 right-3"
        >
          <div className="p-2 bg-green-500 rounded-full shadow-lg">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        </motion.div>
      )}

      {/* Challenge Info */}
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${config.color}`}>
          <span className="text-2xl">{config.icon}</span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {challenge.title}
            </h3>
            <span className={`
              text-xs px-2 py-0.5 rounded-full
              ${challenge.difficulty === 'easy' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                : challenge.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
              }
            `}>
              {challenge.difficulty}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {challenge.description}
          </p>

          {/* Progress Bar */}
          {!isCompleted && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">{progress} / {challenge.target}</span>
                <span className="text-gray-500">{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className={`h-full rounded-full bg-gradient-to-r ${config.color}`}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reward */}
      <div className={`
        mt-4 pt-4 border-t flex items-center justify-between
        ${isCompleted 
          ? 'border-green-200 dark:border-green-800' 
          : 'border-gray-100 dark:border-gray-700'
        }
      `}>
        <div className="flex items-center gap-2">
          <Gift className={`w-4 h-4 ${isCompleted ? 'text-green-500' : 'text-gray-400'}`} />
          <span className={`text-sm ${isCompleted ? 'text-green-600 dark:text-green-400 line-through' : 'text-gray-600 dark:text-gray-400'}`}>
            +{challenge.reward} points
          </span>
        </div>
        
        {isCompleted && (
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            Completed! ✓
          </span>
        )}
      </div>
    </motion.div>
  );
};

// Daily Challenges Panel
const DailyChallengesPanel = ({ entries = [], userData = {}, isOpen, onClose }) => {
  const { 
    dailyChallenges, 
    completedChallenges, 
    challengeStreak, 
    totalRewards,
    allCompleted 
  } = useChallenges();

  // Calculate time remaining
  const [timeRemaining, setTimeRemaining] = useState('');
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${hours}h ${minutes}m`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

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
        className="relative w-full max-w-lg max-h-[85vh] bg-white dark:bg-gray-800 rounded-3xl shadow-luxury-lg overflow-hidden"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-br from-sage-500 to-green-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6" />
              Daily Challenges
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 opacity-80" />
              <span className="text-sm opacity-90">Resets in {timeRemaining}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 opacity-80" />
              <span className="text-sm opacity-90">{challengeStreak} day streak</span>
            </div>
          </div>

          {/* Completion Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{completedChallenges.length}/{dailyChallenges.length} completed</span>
              <span>{totalRewards} total points</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedChallenges.length / dailyChallenges.length) * 100}%` }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)] space-y-4">
          {allCompleted && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-2xl text-center"
            >
              <Trophy className="w-12 h-12 mx-auto text-yellow-500 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                All Challenges Complete! 🎉
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Come back tomorrow for new challenges
              </p>
            </motion.div>
          )}

          {dailyChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ChallengeCard
                challenge={challenge}
                entries={entries}
                userData={userData}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer Tip */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-sage-500" />
            Complete all challenges to earn bonus points!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Mini Challenges Widget for Dashboard
const ChallengesWidget = ({ entries = [], userData = {}, onOpenFull }) => {
  const { dailyChallenges, completedChallenges } = useChallenges();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Target className="w-5 h-5 text-sage-500" />
          Today's Challenges
        </h3>
        <button
          onClick={onOpenFull}
          className="text-sm text-sage-600 hover:text-sage-700 dark:text-sage-400 flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {dailyChallenges.slice(0, 3).map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            entries={entries}
            userData={userData}
            compact
          />
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        {completedChallenges.length}/{dailyChallenges.length} completed
      </div>
    </div>
  );
};

export { 
  CHALLENGE_POOL, 
  ChallengeCard, 
  DailyChallengesPanel, 
  ChallengesWidget 
};
export default DailyChallengesPanel;
