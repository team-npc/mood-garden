/**
 * Gamification 2.0 - Discoveries & Milestones (No Quantification Philosophy)
 * Celebrates achievements without anxiety-inducing numbers
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trophy,
  Award,
  Star,
  Sparkles,
  Heart,
  Check
} from 'lucide-react';

/**
 * Achievement Definitions - Reframed as discoveries without numerical pressure
 * Descriptions focus on the journey, not the numbers
 */
const ACHIEVEMENTS = [
  // Journey Milestones (replacing streaks)
  { id: 'rhythm-found', title: 'Finding Your Rhythm', desc: 'You\'re building a writing habit', icon: '🌱', category: 'journey' },
  { id: 'steady-growth', title: 'Steady Growth', desc: 'Your practice is taking root', icon: '🌿', category: 'journey' },
  { id: 'flourishing', title: 'Flourishing', desc: 'Writing has become part of your life', icon: '🌳', category: 'journey' },
  
  // Writing Celebrations (replacing word counts)
  { id: 'first-thoughts', title: 'First Thoughts', desc: 'You planted your first seed', icon: '✨', category: 'writing' },
  { id: 'growing-voice', title: 'Growing Voice', desc: 'Your writing voice is developing', icon: '📝', category: 'writing' },
  { id: 'storyteller', title: 'Storyteller', desc: 'You have stories to tell', icon: '📖', category: 'writing' },
  
  // Emotional Discoveries
  { id: 'emotional-range', title: 'Emotional Range', desc: 'Exploring your full emotional spectrum', icon: '🎭', category: 'emotional' },
  { id: 'gratitude-practice', title: 'Gratitude Practice', desc: 'Finding things to be thankful for', icon: '🙏', category: 'emotional' },
  { id: 'deep-thinker', title: 'Deep Thinker', desc: 'Reflecting meaningfully', icon: '🧘', category: 'emotional' },
  
  // Special Discoveries
  { id: 'early-light', title: 'Early Light', desc: 'Morning reflections', icon: '🌅', category: 'special' },
  { id: 'stargazer', title: 'Stargazer', desc: 'Late night thoughts', icon: '🌙', category: 'special' },
  { id: 'comeback', title: 'Comeback', desc: 'Returning after time away', icon: '🔄', category: 'special' }
];

/**
 * Category colors for visual distinction (no rarity hierarchy)
 */
const CATEGORY_STYLES = {
  journey: { bg: 'bg-leaf-500/20', text: 'text-leaf-300', border: 'border-leaf-500' },
  writing: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500' },
  emotional: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500' },
  special: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500' }
};

const CATEGORY_LABELS = {
  journey: 'Your Journey',
  writing: 'Writing',
  emotional: 'Emotional Growth',
  special: 'Special Moments'
};

/**
 * Achievement Card Component - No progress bars or percentages
 */
const AchievementCard = ({ achievement, isUnlocked }) => {
  const style = CATEGORY_STYLES[achievement.category];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative rounded-xl p-4 border-2 ${style.bg} ${
        isUnlocked ? style.border : 'border-deep-600'
      } ${!isUnlocked && 'opacity-40'}`}
    >
      {/* Badge Icon */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl">{isUnlocked ? achievement.icon : '❓'}</div>
        {isUnlocked && (
          <div className="p-1.5 bg-green-500 rounded-full">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      
      {/* Info - Hidden until unlocked */}
      <h3 className={`font-medium mb-1 ${style.text}`}>
        {isUnlocked ? achievement.title : 'Keep growing...'}
      </h3>
      <p className="text-xs text-cream-500">
        {isUnlocked ? achievement.desc : 'Discovery awaits'}
      </p>
      
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
 * Community Celebration - Replaces competitive leaderboard
 */
const CommunityView = () => {
  const celebrations = [
    { name: 'Sarah', message: 'Found their voice today', icon: '✨' },
    { name: 'Mike', message: 'Celebrated a breakthrough', icon: '🌟' },
    { name: 'Emma', message: 'Shared gratitude', icon: '💝' },
    { name: 'You', message: 'Are part of this community', icon: '🌱', isCurrentUser: true },
    { name: 'Alex', message: 'Started their journey', icon: '🌸' }
  ];
  
  return (
    <div className="space-y-3">
      <p className="text-center text-cream-400 text-sm mb-4">
        Everyone grows at their own pace 🌿
      </p>
      {celebrations.map((user, i) => (
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
          <div className="text-2xl">{user.icon}</div>
          <div className="flex-1">
            <div className="font-medium text-cream-200">{user.name}</div>
            <div className="text-xs text-cream-500">{user.message}</div>
          </div>
          <Heart className="w-5 h-5 text-rose-400" />
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Main Gamification Component - Reframed without anxiety-inducing metrics
 */
const Gamification = ({ isOpen, onClose, userStats }) => {
  const [activeTab, setActiveTab] = useState('discoveries');
  const [filterCategory, setFilterCategory] = useState('all');
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('unlockedAchievements');
    if (saved) setUnlockedAchievements(JSON.parse(saved));
  }, []);
  
  const isUnlocked = (achievementId) => {
    return unlockedAchievements.includes(achievementId);
  };
  
  if (!isOpen) return null;
  
  const filteredAchievements = filterCategory === 'all'
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter(a => a.category === filterCategory);
  
  const unlockedCount = ACHIEVEMENTS.filter(a => isUnlocked(a.id)).length;
  
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
        className="bg-deep-800 rounded-2xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header - No XP or numbers */}
        <div className="bg-gradient-to-r from-sage-600 to-leaf-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-xl font-bold text-white">Your Garden Journey</h2>
                <p className="text-sm text-sage-200">
                  {unlockedCount > 0 
                    ? 'Discoveries await' 
                    : 'Begin your journey'}
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
            { id: 'discoveries', icon: Award, label: 'Discoveries' },
            { id: 'community', icon: Heart, label: 'Community' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors ${
                activeTab === tab.id
                  ? 'bg-sage-500/20 text-sage-400 border-b-2 border-sage-500'
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
          {activeTab === 'discoveries' && (
            <>
              {/* Sidebar Filter by Category */}
              <div className="w-48 bg-deep-900 border-r border-deep-700 p-4">
                <h3 className="text-xs text-cream-600 uppercase mb-2">Categories</h3>
                <div className="space-y-1">
                  {['all', ...Object.keys(CATEGORY_LABELS)].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                        filterCategory === cat
                          ? 'bg-sage-500/20 text-sage-400'
                          : 'text-cream-500 hover:text-cream-300 hover:bg-deep-700/30'
                      }`}
                    >
                      {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Achievement Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-3 gap-4">
                  {filteredAchievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      isUnlocked={isUnlocked(achievement.id)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'community' && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-xl mx-auto">
                <CommunityView />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Gamification;
export { ACHIEVEMENTS, CATEGORY_STYLES };
