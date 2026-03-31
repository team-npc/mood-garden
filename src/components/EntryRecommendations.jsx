/**
 * Entry Recommendations Component
 * Suggests moods and topics user hasn't written about recently
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Clock, X, Lightbulb } from 'lucide-react';

/**
 * Analyze entries to generate recommendations
 */
const analyzeEntryPatterns = (entries = []) => {
  if (entries.length < 3) {
    return {
      missedMoods: [],
      suggestedTopics: [],
      writingPatterns: [],
      recommendations: []
    };
  }

  const now = new Date();
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // All moods ever used
  const allMoods = ['😊', '😢', '😡', '😴', '😱', '😌', '🥰', '😤', '🤔', '😎', '🤗', '😔'];
  
  // Recent moods (last 2 weeks)
  const recentEntries = entries.filter(e => new Date(e.createdAt) >= twoWeeksAgo);
  const recentMoods = new Set(recentEntries.filter(e => e.mood).map(e => e.mood));
  
  // Moods not used recently
  const moodsEverUsed = new Set(entries.filter(e => e.mood).map(e => e.mood));
  const missedMoods = allMoods.filter(mood => 
    moodsEverUsed.has(mood) && !recentMoods.has(mood)
  );

  // Tag analysis
  const allTags = {};
  const recentTags = new Set();
  
  entries.forEach(entry => {
    (entry.tags || []).forEach(tag => {
      if (!allTags[tag]) {
        allTags[tag] = { count: 0, lastUsed: null };
      }
      allTags[tag].count++;
      const entryDate = new Date(entry.createdAt);
      if (!allTags[tag].lastUsed || entryDate > allTags[tag].lastUsed) {
        allTags[tag].lastUsed = entryDate;
      }
      if (entryDate >= twoWeeksAgo) {
        recentTags.add(tag);
      }
    });
  });

  // Topics not written about recently (used frequently before but not recently)
  const suggestedTopics = Object.entries(allTags)
    .filter(([tag, data]) => data.count >= 2 && !recentTags.has(tag))
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([tag]) => tag);

  // Writing patterns
  const writingPatterns = [];
  
  // Check for time-of-day patterns
  const hourCounts = Array(24).fill(0);
  entries.forEach(entry => {
    const hour = new Date(entry.createdAt).getHours();
    hourCounts[hour]++;
  });
  const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
  if (Math.max(...hourCounts) >= 3) {
    const timeLabel = peakHour < 6 ? 'late night' : 
                      peakHour < 12 ? 'morning' : 
                      peakHour < 17 ? 'afternoon' : 
                      peakHour < 21 ? 'evening' : 'night';
    writingPatterns.push({
      type: 'time',
      message: `You often write in the ${timeLabel}`,
      icon: '⏰'
    });
  }

  // Check for day-of-week patterns
  const dayCounts = Array(7).fill(0);
  entries.forEach(entry => {
    const day = new Date(entry.createdAt).getDay();
    dayCounts[day]++;
  });
  const peakDay = dayCounts.indexOf(Math.max(...dayCounts));
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  if (Math.max(...dayCounts) >= 3) {
    writingPatterns.push({
      type: 'day',
      message: `${dayNames[peakDay]}s are your most active journaling days`,
      icon: '📅'
    });
  }

  // Generate recommendations
  const recommendations = [];

  if (missedMoods.length > 0) {
    recommendations.push({
      type: 'mood',
      title: 'Explore a different mood',
      message: `You haven't reflected on ${missedMoods[0]} moments recently`,
      mood: missedMoods[0],
      icon: missedMoods[0]
    });
  }

  if (suggestedTopics.length > 0) {
    recommendations.push({
      type: 'topic',
      title: 'Revisit a topic',
      message: `It's been a while since you wrote about #${suggestedTopics[0]}`,
      topic: suggestedTopics[0],
      icon: '💭'
    });
  }

  // Check streak encouragement
  const lastEntryDate = entries[0] ? new Date(entries[0].createdAt) : null;
  if (lastEntryDate) {
    const daysSinceLastEntry = Math.floor((now - lastEntryDate) / (1000 * 60 * 60 * 24));
    if (daysSinceLastEntry >= 2) {
      recommendations.push({
        type: 'streak',
        title: 'Keep your garden growing',
        message: `It's been ${daysSinceLastEntry} days since your last entry`,
        icon: '🌱'
      });
    }
  }

  // Word count encouragement
  const avgWordCount = entries.reduce((sum, e) => sum + (e.wordCount || 0), 0) / entries.length;
  const recentAvgWordCount = recentEntries.length > 0 
    ? recentEntries.reduce((sum, e) => sum + (e.wordCount || 0), 0) / recentEntries.length 
    : avgWordCount;
  
  if (recentAvgWordCount < avgWordCount * 0.7 && avgWordCount > 50) {
    recommendations.push({
      type: 'depth',
      title: 'Go deeper',
      message: 'Your recent entries have been shorter. Try expanding on your thoughts today.',
      icon: '📝'
    });
  }

  return {
    missedMoods,
    suggestedTopics,
    writingPatterns,
    recommendations
  };
};

/**
 * Entry Recommendations Widget
 */
const EntryRecommendations = ({ entries = [], onUseRecommendation, isOpen, onClose }) => {
  const analysis = useMemo(() => analyzeEntryPatterns(entries), [entries]);

  if (!isOpen) return null;

  const { recommendations, writingPatterns, missedMoods, suggestedTopics } = analysis;

  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bento-item max-w-lg w-full my-8 p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-cream-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Writing Recommendations</h2>
                <p className="text-sm text-cream-200">Personalized suggestions for you</p>
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

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Recommendations */}
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              <h3 className="font-semibold text-cream-100 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <span>Suggested for You</span>
              </h3>
              {recommendations.map((rec, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => onUseRecommendation && onUseRecommendation(rec)}
                  className="w-full p-4 bg-deep-700/50 hover:bg-deep-600/50 rounded-xl text-left transition-all border border-transparent hover:border-purple-500/30"
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{rec.icon}</span>
                    <div>
                      <div className="font-medium text-cream-100">{rec.title}</div>
                      <div className="text-sm text-cream-400">{rec.message}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 mx-auto text-cream-600 mb-4" />
              <h3 className="text-lg font-medium text-cream-300 mb-2">You're doing great!</h3>
              <p className="text-cream-500 text-sm">
                Keep journaling to unlock personalized recommendations.
              </p>
            </div>
          )}

          {/* Writing Patterns */}
          {writingPatterns.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-cream-100 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Your Writing Patterns</span>
              </h3>
              <div className="grid gap-2">
                {writingPatterns.map((pattern, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-deep-700/30 rounded-lg flex items-center space-x-2"
                  >
                    <span>{pattern.icon}</span>
                    <span className="text-sm text-cream-300">{pattern.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missed Moods Quick Access */}
          {missedMoods.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-cream-100 text-sm">
                Moods you haven't explored recently:
              </h3>
              <div className="flex flex-wrap gap-2">
                {missedMoods.slice(0, 6).map(mood => (
                  <button
                    key={mood}
                    onClick={() => onUseRecommendation && onUseRecommendation({ type: 'mood', mood })}
                    className="text-2xl p-2 bg-deep-700/50 hover:bg-deep-600/50 rounded-xl transition-all"
                    title={`Write about ${mood} moments`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Topics */}
          {suggestedTopics.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-cream-100 text-sm">
                Topics to revisit:
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map(topic => (
                  <button
                    key={topic}
                    onClick={() => onUseRecommendation && onUseRecommendation({ type: 'topic', topic })}
                    className="text-sm px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-full transition-all"
                  >
                    #{topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EntryRecommendations;
