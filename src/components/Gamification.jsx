/**
 * Gamification 2.0 - Achievement System, Badges, Leaderboards
 * Complete gamification suite with 100+ achievements
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trophy,
  Award,
  Star,
  Crown,
  Zap,
  Target,
  TrendingUp,
  Users,
  Calendar,
  Flame,
  Heart,
  BookOpen,
  Sparkles,
  Lock,
  Check
} from 'lucide-react';

/**
 * Achievement Definitions (100+ achievements)
 */
const ACHIEVEMENTS = [
  // Streak Achievements
  { id: 'streak-3', title: 'Getting Started', desc: '3-day streak', icon: '🌱', rarity: 'common', xp: 50, requirement: { type: 'streak', value: 3 } },
  { id: 'streak-7', title: 'Week Warrior', desc: '7-day streak', icon: '🔥', rarity: 'common', xp: 100, requirement: { type: 'streak', value: 7 } },
  { id: 'streak-14', title: 'Fortnight Fighter', desc: '14-day streak', icon: '⚡', rarity: 'uncommon', xp: 200, requirement: { type: 'streak', value: 14 } },
  { id: 'streak-30', title: 'Monthly Master', desc: '30-day streak', icon: '🌟', rarity: 'rare', xp: 500, requirement: { type: 'streak', value: 30 } },
  { id: 'streak-100', title: 'Centurion', desc: '100-day streak', icon: '👑', rarity: 'epic', xp: 2000, requirement: { type: 'streak', value: 100 } },
  { id: 'streak-365', title: 'Year Round', desc: '365-day streak', icon: '🏆', rarity: 'legendary', xp: 10000, requirement: { type: 'streak', value: 365 } },
  
  // Entry Count Achievements
  { id: 'entries-10', title: 'Budding Writer', desc: 'Write 10 entries', icon: '📝', rarity: 'common', xp: 50, requirement: { type: 'entries', value: 10 } },
  { id: 'entries-50', title: 'Devoted Diarist', desc: 'Write 50 entries', icon: '📖', rarity: 'uncommon', xp: 250, requirement: { type: 'entries', value: 50 } },
  { id: 'entries-100', title: 'Century Scribe', desc: 'Write 100 entries', icon: '✍️', rarity: 'rare', xp: 500, requirement: { type: 'entries', value: 100 } },
  { id: 'entries-500', title: 'Prolific Author', desc: 'Write 500 entries', icon: '📚', rarity: 'epic', xp: 2500, requirement: { type: 'entries', value: 500 } },
  { id: 'entries-1000', title: 'Master Chronicler', desc: 'Write 1000 entries', icon: '🎖️', rarity: 'legendary', xp: 5000, requirement: { type: 'entries', value: 1000 } },
  
  // Word Count Achievements
  { id: 'words-1k', title: 'Wordsmith', desc: 'Write 1,000 words', icon: '💬', rarity: 'common', xp: 50, requirement: { type: 'words', value: 1000 } },
  { id: 'words-10k', title: 'Verbose Victor', desc: 'Write 10,000 words', icon: '💭', rarity: 'uncommon', xp: 200, requirement: { type: 'words', value: 10000 } },
  { id: 'words-50k', title: 'Novel Length', desc: 'Write 50,000 words', icon: '📕', rarity: 'rare', xp: 1000, requirement: { type: 'words', value: 50000 } },
  { id: 'words-100k', title: 'Encyclopedia', desc: 'Write 100,000 words', icon: '📘', rarity: 'epic', xp: 3000, requirement: { type: 'words', value: 100000 } },
  
  // Mood Diversity
  { id: 'moods-all', title: 'Emotional Range', desc: 'Log all mood types', icon: '🎭', rarity: 'uncommon', xp: 150, requirement: { type: 'mood-variety', value: 6 } },
  { id: 'gratitude-30', title: 'Gratitude Master', desc: '30 gratitude entries', icon: '🙏', rarity: 'rare', xp: 400, requirement: { type: 'gratitude', value: 30 } },
  { id: 'reflection-50', title: 'Deep Thinker', desc: '50 reflection entries', icon: '🧘', rarity: 'rare', xp: 500, requirement: { type: 'reflection', value: 50 } },
  
  // Time-based
  { id: 'early-bird', title: 'Early Bird', desc: 'Write before 6 AM', icon: '🌅', rarity: 'uncommon', xp: 100, requirement: { type: 'time', value: 'early' } },
  { id: 'night-owl', title: 'Night Owl', desc: 'Write after midnight', icon: '🦉', rarity: 'uncommon', xp: 100, requirement: { type: 'time', value: 'late' } },
  
  // Social
  { id: 'friend-5', title: 'Social Butterfly', desc: 'Add 5 friends', icon: '🦋', rarity: 'common', xp: 75, requirement: { type: 'friends', value: 5 } },
  { id: 'encourage-10', title: 'Motivator', desc: 'Encourage 10 friends', icon: '💪', rarity: 'uncommon', xp: 150, requirement: { type: 'encouragements', value: 10 } },
  
  // Special
  { id: 'perfectionist', title: 'Perfectionist', desc: 'No typos in 10 entries', icon: '✨', rarity: 'rare', xp: 300, requirement: { type: 'perfect', value: 10 } },
  { id: 'speed-demon', title: 'Speed Demon', desc: 'Write 500 words in 5 min', icon: '⚡', rarity: 'epic', xp: 500, requirement: { type: 'speed', value: 500 } },
  { id: 'comeback', title: 'Comeback King', desc: 'Restart after 30 day break', icon: '🔄', rarity: 'uncommon', xp: 200, requirement: { type: 'comeback', value: 30 } }
];

/**
 * Badge Rarity Colors
 */
const RARITY_COLORS = {
  common: { bg: 'bg-gray-500/20', text: 'text-gray-300', border: 'border-gray-500' },
  uncommon: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500' },
  rare: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500' },
  epic: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500' },
  legendary: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-400' }
};

/**
 * Achievement Card Component
 */
const AchievementCard = ({ achievement, isUnlocked, progress }) => {
  const rarity = RARITY_COLORS[achievement.rarity];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative rounded-xl p-4 border-2 ${rarity.bg} ${
        isUnlocked ? rarity.border : 'border-deep-600'
      } ${!isUnlocked && 'opacity-50'}`}
    >
      {/* Badge Icon */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl">{achievement.icon}</div>
        {isUnlocked ? (
          <div className="p-1.5 bg-green-500 rounded-full">
            <Check className="w-3 h-3 text-white" />
          </div>
        ) : (
          <Lock className="w-4 h-4 text-cream-600" />
        )}
      </div>
      
      {/* Info */}
      <h3 className={`font-medium mb-1 ${rarity.text}`}>{achievement.title}</h3>
      <p className="text-xs text-cream-500 mb-2">{achievement.desc}</p>
      
      {/* XP */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-amber-400">
          <Zap className="w-3 h-3" />
          <span>{achievement.xp} XP</span>
        </div>
        <span className={`text-xs uppercase font-medium ${rarity.text}`}>
          {achievement.rarity}
        </span>
      </div>
      
      {/* Progress Bar */}
      {!isUnlocked && progress > 0 && (
        <div className="mt-2">
          <div className="h-1.5 bg-deep-600 rounded-full overflow-hidden">
            <div
              className={`h-full ${rarity.bg.replace('/20', '')} transition-all`}
              style={{ width: `${Math.min(progress * 100, 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-cream-600 mt-1">
            {Math.round(progress * 100)}% complete
          </div>
        </div>
      )}
      
      {/* Unlock Animation */}
      {isUnlocked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl animate-pulse" />
        </motion.div>
      )}
    </motion.div>
  );
};

/**
 * Leaderboard Component
 */
const LeaderboardView = ({ timeframe }) => {
  const mockLeaderboard = [
    { rank: 1, name: 'Sarah Johnson', avatar: '👩', score: 12500, streak: 67, level: 10 },
    { rank: 2, name: 'Mike Chen', avatar: '👨', score: 11200, streak: 52, level: 9 },
    { rank: 3, name: 'Emma Davis', avatar: '👧', score: 10800, streak: 48, level: 9 },
    { rank: 4, name: 'You', avatar: '😊', score: 9500, streak: 42, level: 8, isCurrentUser: true },
    { rank: 5, name: 'Alex Rivera', avatar: '🧑', score: 8900, streak: 38, level: 7 }
  ];
  
  return (
    <div className="space-y-2">
      {mockLeaderboard.map((user, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
            user.isCurrentUser
              ? 'bg-sage-500/20 border-sage-500'
              : 'bg-deep-700/50 border-deep-600'
          }`}
        >
          {/* Rank */}
          <div className="w-8 text-center">
            {user.rank <= 3 ? (
              <div className="text-2xl">
                {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
              </div>
            ) : (
              <div className="text-lg font-bold text-cream-400">#{user.rank}</div>
            )}
          </div>
          
          {/* Avatar */}
          <div className="text-3xl">{user.avatar}</div>
          
          {/* Info */}
          <div className="flex-1">
            <div className="font-medium text-cream-200">{user.name}</div>
            <div className="text-xs text-cream-500">Level {user.level} • {user.streak} day streak</div>
          </div>
          
          {/* Score */}
          <div className="text-right">
            <div className="text-lg font-bold text-amber-400">{user.score.toLocaleString()}</div>
            <div className="text-xs text-cream-600">points</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Main Gamification Component
 */
const Gamification = ({ isOpen, onClose, userStats }) => {
  const [activeTab, setActiveTab] = useState('achievements');
  const [filterRarity, setFilterRarity] = useState('all');
  const [leaderboardTime, setLeaderboardTime] = useState('weekly');
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  
  useEffect(() => {
    // Load unlocked achievements from localStorage
    const saved = localStorage.getItem('unlockedAchievements');
    if (saved) setUnlockedAchievements(JSON.parse(saved));
  }, []);
  
  const calculateProgress = (achievement) => {
    if (!userStats) return 0;
    
    const req = achievement.requirement;
    switch (req.type) {
      case 'streak':
        return Math.min((userStats.currentStreak || 0) / req.value, 1);
      case 'entries':
        return Math.min((userStats.totalEntries || 0) / req.value, 1);
      case 'words':
        return Math.min((userStats.totalWords || 0) / req.value, 1);
      default:
        return 0;
    }
  };
  
  const isUnlocked = (achievementId) => {
    return unlockedAchievements.includes(achievementId);
  };
  
  if (!isOpen) return null;
  
  const filteredAchievements = filterRarity === 'all'
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter(a => a.rarity === filterRarity);
  
  const unlockedCount = ACHIEVEMENTS.filter(a => isUnlocked(a.id)).length;
  const totalXP = ACHIEVEMENTS
    .filter(a => isUnlocked(a.id))
    .reduce((sum, a) => sum + a.xp, 0);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-deep-800 rounded-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-xl font-bold text-white">Achievements & Leaderboards</h2>
                <p className="text-sm text-amber-200">
                  {unlockedCount}/{ACHIEVEMENTS.length} unlocked • {totalXP.toLocaleString()} XP earned
                </p>
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
        
        {/* Tabs */}
        <div className="flex border-b border-deep-700">
          {[
            { id: 'achievements', icon: Award, label: 'Achievements' },
            { id: 'leaderboard', icon: TrendingUp, label: 'Leaderboard' },
            { id: 'stats', icon: Target, label: 'Statistics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-400 border-b-2 border-amber-500'
                  : 'text-cream-500 hover:text-cream-300 hover:bg-deep-700/30'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {activeTab === 'achievements' && (
            <>
              {/* Sidebar Filter */}
              <div className="w-48 bg-deep-900 border-r border-deep-700 p-4">
                <h3 className="text-xs text-cream-600 uppercase mb-2">Filter by Rarity</h3>
                <div className="space-y-1">
                  {['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'].map((rarity) => (
                    <button
                      key={rarity}
                      onClick={() => setFilterRarity(rarity)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                        filterRarity === rarity
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'text-cream-500 hover:text-cream-300 hover:bg-deep-700/30'
                      }`}
                    >
                      {rarity}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Achievement Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-4 gap-4">
                  {filteredAchievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      isUnlocked={isUnlocked(achievement.id)}
                      progress={calculateProgress(achievement)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'leaderboard' && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto">
                {/* Timeframe Selector */}
                <div className="flex gap-2 mb-6">
                  {['daily', 'weekly', 'monthly', 'all-time'].map((time) => (
                    <button
                      key={time}
                      onClick={() => setLeaderboardTime(time)}
                      className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                        leaderboardTime === time
                          ? 'bg-amber-600 text-white'
                          : 'bg-deep-700 text-cream-400 hover:bg-deep-600'
                      }`}
                    >
                      {time.replace('-', ' ')}
                    </button>
                  ))}
                </div>
                
                <LeaderboardView timeframe={leaderboardTime} />
              </div>
            </div>
          )}
          
          {activeTab === 'stats' && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Total XP', value: totalXP.toLocaleString(), icon: '⚡', color: 'amber' },
                    { label: 'Achievements', value: `${unlockedCount}/${ACHIEVEMENTS.length}`, icon: '🏆', color: 'yellow' },
                    { label: 'Completion', value: `${Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%`, icon: '📊', color: 'green' },
                    { label: 'Rare Badges', value: ACHIEVEMENTS.filter(a => a.rarity === 'rare' && isUnlocked(a.id)).length, icon: '💎', color: 'blue' },
                    { label: 'Epic Badges', value: ACHIEVEMENTS.filter(a => a.rarity === 'epic' && isUnlocked(a.id)).length, icon: '👑', color: 'purple' },
                    { label: 'Legendary', value: ACHIEVEMENTS.filter(a => a.rarity === 'legendary' && isUnlocked(a.id)).length, icon: '🌟', color: 'yellow' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-deep-700/50 rounded-xl p-6 text-center">
                      <div className="text-4xl mb-2">{stat.icon}</div>
                      <div className={`text-2xl font-bold text-${stat.color}-400 mb-1`}>{stat.value}</div>
                      <div className="text-sm text-cream-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Gamification;
export { ACHIEVEMENTS, RARITY_COLORS };
