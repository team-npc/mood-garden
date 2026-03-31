/**
 * Mood Statistics Dashboard Component
 * Displays mood frequency, distribution, streaks, and writing trends
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
  Sparkles
} from 'lucide-react';

/**
 * Calculate mood statistics from entries
 */
const calculateMoodStats = (entries) => {
  if (!entries || entries.length === 0) {
    return {
      totalEntries: 0,
      moodCounts: {},
      mostFrequentMood: null,
      moodDistribution: [],
      weeklyMoods: [],
      averageWordCount: 0,
      totalWords: 0,
      entriesThisWeek: 0,
      entriesThisMonth: 0,
      longestEntry: 0,
      writingTrend: 'stable'
    };
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Count moods
  const moodCounts = {};
  let totalWords = 0;
  let longestEntry = 0;
  let entriesThisWeek = 0;
  let entriesThisMonth = 0;
  const weeklyMoods = Array(7).fill(null).map(() => ({}));

  entries.forEach(entry => {
    // Count moods
    if (entry.mood) {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    }

    // Word count stats
    const wordCount = entry.wordCount || entry.content?.trim().split(/\s+/).length || 0;
    totalWords += wordCount;
    if (wordCount > longestEntry) longestEntry = wordCount;

    // Time-based stats
    const entryDate = new Date(entry.createdAt);
    if (entryDate >= weekAgo) {
      entriesThisWeek++;
      // Track mood by day of week
      const dayIndex = entryDate.getDay();
      if (entry.mood) {
        weeklyMoods[dayIndex][entry.mood] = (weeklyMoods[dayIndex][entry.mood] || 0) + 1;
      }
    }
    if (entryDate >= monthAgo) {
      entriesThisMonth++;
    }
  });

  // Calculate distribution
  const totalMoods = Object.values(moodCounts).reduce((a, b) => a + b, 0);
  const moodDistribution = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([mood, count]) => ({
      mood,
      count,
      percentage: totalMoods > 0 ? ((count / totalMoods) * 100).toFixed(1) : 0
    }));

  // Most frequent mood
  const mostFrequentMood = moodDistribution[0]?.mood || null;

  // Average word count
  const averageWordCount = entries.length > 0 
    ? Math.round(totalWords / entries.length) 
    : 0;

  // Writing trend (compare this week vs last week)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const entriesLastWeek = entries.filter(e => {
    const d = new Date(e.createdAt);
    return d >= twoWeeksAgo && d < weekAgo;
  }).length;

  let writingTrend = 'stable';
  if (entriesThisWeek > entriesLastWeek * 1.2) writingTrend = 'increasing';
  else if (entriesThisWeek < entriesLastWeek * 0.8) writingTrend = 'decreasing';

  return {
    totalEntries: entries.length,
    moodCounts,
    mostFrequentMood,
    moodDistribution,
    weeklyMoods,
    averageWordCount,
    totalWords,
    entriesThisWeek,
    entriesThisMonth,
    longestEntry,
    writingTrend
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
 * Mood Statistics Dashboard Component
 */
const MoodStatsDashboard = ({ entries = [], plantData = {}, isOpen, onClose }) => {
  const stats = useMemo(() => calculateMoodStats(entries), [entries]);
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
              <BarChart3 className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Mood Statistics</h2>
                <p className="text-cream-200 text-sm">Your journaling insights at a glance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              aria-label="Close statistics"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Entries */}
            <div className="bg-deep-700/50 rounded-xl p-4 text-center">
              <FileText className="w-6 h-6 mx-auto mb-2 text-leaf-400" />
              <div className="text-2xl font-bold text-cream-100">{stats.totalEntries}</div>
              <div className="text-sm text-cream-400">Total Entries</div>
            </div>

            {/* Current Streak */}
            <div className="bg-deep-700/50 rounded-xl p-4 text-center">
              <Flame className="w-6 h-6 mx-auto mb-2 text-orange-400" />
              <div className="text-2xl font-bold text-cream-100">{plantData.currentStreak || 0}</div>
              <div className="text-sm text-cream-400">Day Streak</div>
            </div>

            {/* This Week */}
            <div className="bg-deep-700/50 rounded-xl p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-cream-100">{stats.entriesThisWeek}</div>
              <div className="text-sm text-cream-400">This Week</div>
            </div>

            {/* Avg Words */}
            <div className="bg-deep-700/50 rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-cream-100">{stats.averageWordCount}</div>
              <div className="text-sm text-cream-400">Avg Words</div>
            </div>
          </div>

          {/* Most Frequent Mood Badge */}
          {stats.mostFrequentMood && (
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-4 border border-amber-500/30">
              <div className="flex items-center space-x-3">
                <Award className="w-8 h-8 text-amber-400" />
                <div>
                  <div className="text-sm text-cream-400">Most Frequent Mood This Month</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-3xl">{stats.mostFrequentMood}</span>
                    <span className="text-cream-200 font-medium">
                      {stats.moodDistribution[0]?.percentage}% of entries
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mood Distribution */}
          <div className="bg-deep-700/30 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-cream-100 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-leaf-400" />
              Mood Distribution
            </h3>
            {stats.moodDistribution.length > 0 ? (
              <div className="space-y-3">
                {stats.moodDistribution.slice(0, 6).map(({ mood, count, percentage }) => (
                  <div key={mood} className="flex items-center space-x-3">
                    <span className="text-2xl w-8">{mood}</span>
                    <div className="flex-1">
                      <div className="h-6 bg-deep-600 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className={`h-full ${getMoodColor(mood)} rounded-full`}
                        />
                      </div>
                    </div>
                    <span className="text-cream-300 w-16 text-right">
                      {count} ({percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-cream-400 text-center py-4">
                No mood data yet. Start journaling with moods to see your distribution!
              </p>
            )}
          </div>

          {/* Weekly Activity */}
          <div className="bg-deep-700/30 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-cream-100 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-400" />
              Weekly Mood Activity
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {dayNames.map((day, index) => {
                const dayMoods = stats.weeklyMoods[index] || {};
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

          {/* Writing Stats */}
          <div className="bg-deep-700/30 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-cream-100 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-400" />
              Writing Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-cream-100">{stats.totalWords.toLocaleString()}</div>
                <div className="text-sm text-cream-400">Total Words</div>
              </div>
              <div>
                <div className="text-xl font-bold text-cream-100">{stats.averageWordCount}</div>
                <div className="text-sm text-cream-400">Avg per Entry</div>
              </div>
              <div>
                <div className="text-xl font-bold text-cream-100">{stats.longestEntry}</div>
                <div className="text-sm text-cream-400">Longest Entry</div>
              </div>
              <div>
                <div className={`text-xl font-bold ${
                  stats.writingTrend === 'increasing' ? 'text-green-400' :
                  stats.writingTrend === 'decreasing' ? 'text-red-400' :
                  'text-cream-100'
                }`}>
                  {stats.writingTrend === 'increasing' ? '↑' : 
                   stats.writingTrend === 'decreasing' ? '↓' : '→'}
                </div>
                <div className="text-sm text-cream-400">Weekly Trend</div>
              </div>
            </div>
          </div>

          {/* Streak Info */}
          {plantData.longestStreak > 0 && (
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Flame className="w-8 h-8 text-orange-400" />
                  <div>
                    <div className="text-sm text-cream-400">Streak Record</div>
                    <div className="text-2xl font-bold text-cream-100">
                      {plantData.longestStreak} days
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-cream-400">Current</div>
                  <div className="text-xl font-bold text-orange-400">
                    {plantData.currentStreak || 0} days
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
