/**
 * Mood Statistics Dashboard Component
 * Displays mood patterns and writing insights without anxiety-inducing numbers
 * Philosophy: No quantification - focus on growth narratives
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Flame, 
  Calendar, 
  Award,
  Clock,
  FileText,
  X,
  Sparkles,
  Heart
} from 'lucide-react';

/**
 * Calculate mood insights from entries - qualitative, not quantitative
 */
const calculateMoodInsights = (entries) => {
  if (!entries || entries.length === 0) {
    return {
      hasEntries: false,
      mostFrequentMood: null,
      moodDistribution: [],
      weeklyMoods: [],
      writingStatus: 'starting',
      recentActivity: 'none'
    };
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Count moods
  const moodCounts = {};
  let entriesThisWeek = 0;
  const weeklyMoods = Array(7).fill(null).map(() => ({}));

  entries.forEach(entry => {
    if (entry.mood) {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    }

    const entryDate = new Date(entry.createdAt);
    if (entryDate >= weekAgo) {
      entriesThisWeek++;
      const dayIndex = entryDate.getDay();
      if (entry.mood) {
        weeklyMoods[dayIndex][entry.mood] = (weeklyMoods[dayIndex][entry.mood] || 0) + 1;
      }
    }
  });

  // Mood distribution (without percentages)
  const totalMoods = Object.values(moodCounts).reduce((a, b) => a + b, 0);
  const moodDistribution = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([mood, count]) => ({
      mood,
      strength: totalMoods > 0 ? count / totalMoods : 0 // For visual bar only
    }));

  const mostFrequentMood = moodDistribution[0]?.mood || null;

  // Qualitative writing status
  let writingStatus = 'starting';
  if (entries.length > 50) writingStatus = 'flourishing';
  else if (entries.length > 20) writingStatus = 'growing';
  else if (entries.length > 5) writingStatus = 'developing';

  // Recent activity (qualitative)
  let recentActivity = 'none';
  if (entriesThisWeek >= 5) recentActivity = 'active';
  else if (entriesThisWeek >= 2) recentActivity = 'steady';
  else if (entriesThisWeek >= 1) recentActivity = 'present';

  return {
    hasEntries: true,
    mostFrequentMood,
    moodDistribution,
    weeklyMoods,
    writingStatus,
    recentActivity
  };
};

/**
 * Get mood color for visualization
 */
const getMoodColor = (mood) => {
  const colors = {
    '😊': 'bg-yellow-400',
    '😢': 'bg-blue-400',
    '😡': 'bg-red-400',
    '😴': 'bg-purple-400',
    '😱': 'bg-orange-400',
    '😌': 'bg-green-400',
    '🥰': 'bg-pink-400',
    '😤': 'bg-red-500',
    '🤔': 'bg-amber-400',
    '😎': 'bg-cyan-400',
    '🤗': 'bg-rose-400',
    '😔': 'bg-slate-400'
  };
  return colors[mood] || 'bg-leaf-400';
};

/**
 * Get status message based on writing status
 */
const getStatusMessage = (status) => {
  const messages = {
    'starting': { text: 'Beginning your journey', icon: '🌱', color: 'text-green-400' },
    'developing': { text: 'Finding your voice', icon: '🌿', color: 'text-emerald-400' },
    'growing': { text: 'Your practice is growing', icon: '🌳', color: 'text-leaf-400' },
    'flourishing': { text: 'Flourishing beautifully', icon: '🌸', color: 'text-pink-400' }
  };
  return messages[status] || messages['starting'];
};

/**
 * Get activity message
 */
const getActivityMessage = (activity) => {
  const messages = {
    'none': 'Ready when you are',
    'present': 'You showed up this week',
    'steady': 'Building momentum',
    'active': 'You\'re in a great rhythm'
  };
  return messages[activity] || messages['none'];
};

/**
 * Mood Statistics Dashboard Component
 */
const MoodStatsDashboard = ({ entries = [], plantData = {}, isOpen, onClose }) => {
  const insights = useMemo(() => calculateMoodInsights(entries), [entries]);
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const statusInfo = getStatusMessage(insights.writingStatus);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bento-item max-w-4xl w-full my-8 p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-leaf-600 to-sage-600 p-6 text-cream-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Your Journey</h2>
                <p className="text-cream-200 text-sm">Insights into your growth</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Journey Status - No numbers, just narrative */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Writing Journey */}
            <div className="bg-gradient-to-r from-leaf-500/20 to-sage-500/20 rounded-xl p-5 border border-leaf-500/30">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl">{statusInfo.icon}</span>
                <div>
                  <div className={`text-lg font-semibold ${statusInfo.color}`}>
                    {statusInfo.text}
                  </div>
                  <div className="text-sm text-cream-400">Your writing practice</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-deep-700/50 rounded-xl p-5">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="text-lg font-semibold text-cream-100">
                    {getActivityMessage(insights.recentActivity)}
                  </div>
                  <div className="text-sm text-cream-400">This week</div>
                </div>
              </div>
            </div>
          </div>

          {/* Most Frequent Mood */}
          {insights.mostFrequentMood && (
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-4 border border-amber-500/30">
              <div className="flex items-center space-x-3">
                <Award className="w-8 h-8 text-amber-400" />
                <div>
                  <div className="text-sm text-cream-400">Your most expressed feeling</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-3xl">{insights.mostFrequentMood}</span>
                    <span className="text-cream-200 font-medium">
                      A common theme in your reflections
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mood Distribution - Visual only, no percentages */}
          <div className="bg-deep-700/30 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-cream-100 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-leaf-400" />
              Emotional Landscape
            </h3>
            {insights.moodDistribution.length > 0 ? (
              <div className="space-y-3">
                {insights.moodDistribution.slice(0, 6).map(({ mood, strength }) => (
                  <div key={mood} className="flex items-center space-x-3">
                    <span className="text-2xl w-8">{mood}</span>
                    <div className="flex-1">
                      <div className="h-6 bg-deep-600 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${strength * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className={`h-full ${getMoodColor(mood)} rounded-full`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-cream-400 text-center py-4">
                Start journaling with moods to see your emotional landscape!
              </p>
            )}
          </div>

          {/* Weekly Mood Activity - Visual calendar */}
          <div className="bg-deep-700/30 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-cream-100 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-400" />
              This Week's Moods
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {dayNames.map((day, index) => {
                const dayMoods = insights.weeklyMoods[index] || {};
                const topMood = Object.entries(dayMoods).sort((a, b) => b[1] - a[1])[0]?.[0];
                const hasActivity = Object.keys(dayMoods).length > 0;
                
                return (
                  <div 
                    key={day} 
                    className={`text-center p-3 rounded-xl ${
                      hasActivity 
                        ? 'bg-leaf-600/30 border border-leaf-500/30' 
                        : 'bg-deep-600/50'
                    }`}
                  >
                    <div className="text-xs text-cream-400 mb-1">{day}</div>
                    <div className="text-xl h-7">
                      {topMood || '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Encouragement based on consistency */}
          {plantData.currentStreak > 0 && (
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/30">
              <div className="flex items-center space-x-3">
                <Flame className="w-8 h-8 text-orange-400" />
                <div>
                  <div className="text-lg font-bold text-cream-100">
                    You're in a good rhythm! 🔥
                  </div>
                  <div className="text-sm text-cream-400">
                    Keep nurturing your writing practice
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MoodStatsDashboard;
