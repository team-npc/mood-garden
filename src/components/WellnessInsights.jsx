/**
 * Wellness Insights Component
 * Displays mood trends, patterns, and recommendations
 */

import React from 'react';
import { X, TrendingUp, Sparkles, Target, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WellnessInsights = ({ wellnessSummary, isOpen, onClose }) => {
  if (!isOpen || !wellnessSummary) return null;

  const { score, status, trends, patterns, recommendations, message } = wellnessSummary;

  const getScoreColor = (s) => {
    if (s >= 70) return 'text-leaf-500';
    if (s >= 40) return 'text-amber-500';
    return 'text-earth-500';
  };

  const getScoreGradient = (s) => {
    if (s >= 70) return 'from-leaf-400 to-leaf-600';
    if (s >= 40) return 'from-amber-400 to-amber-600';
    return 'from-earth-400 to-earth-600';
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-deep-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden"
        >
          {/* Header with Score */}
          <div className="relative p-8 text-center bg-gradient-to-br from-sage-50 to-leaf-50 dark:from-deep-700 dark:to-deep-800">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-earth-500 dark:text-cream-400" />
            </button>
            
            {/* Big Score Circle */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-earth-200 dark:text-deep-600"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 352} 352`}
                  className={getScoreColor(score)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
                  {Math.round(score)}
                </span>
                <span className="text-xs text-earth-500 dark:text-cream-500">of 100</span>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-earth-800 dark:text-cream-100 mb-1">
              Wellness Score
            </h2>
            <p className="text-sm text-earth-600 dark:text-cream-400">
              {message}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="p-6 space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-sage-50 dark:bg-deep-700/50">
                <div className="text-2xl font-bold text-earth-800 dark:text-cream-100">
                  {trends.totalEntries}
                </div>
                <div className="text-xs text-earth-500 dark:text-cream-500">Entries</div>
              </div>
              <div className="p-3 rounded-2xl bg-leaf-50 dark:bg-deep-700/50">
                <div className="text-2xl font-bold text-earth-800 dark:text-cream-100">
                  {trends.moodVariety}
                </div>
                <div className="text-xs text-earth-500 dark:text-cream-500">Moods</div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-deep-700/50">
                <div className="text-2xl">
                  {trends.dominantMood || '—'}
                </div>
                <div className="text-xs text-earth-500 dark:text-cream-500">Top Mood</div>
              </div>
            </div>

            {/* Mood Distribution */}
            {trends.moodDistribution.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-earth-700 dark:text-cream-300 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Mood Distribution
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trends.moodDistribution.slice(0, 5).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-2 bg-sage-50 dark:bg-deep-700/50 rounded-full"
                    >
                      <span className="text-xl">{item.mood}</span>
                      <span className="text-sm font-medium text-earth-600 dark:text-cream-400">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Diversity Score */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-leaf-50 to-sage-50 dark:from-leaf-900/20 dark:to-sage-900/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-earth-700 dark:text-cream-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-leaf-500" />
                  Emotional Diversity
                </span>
                <span className="text-lg font-bold text-leaf-600 dark:text-leaf-400">
                  {recommendations.lastMoodsDiversityScore.toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-earth-200 dark:bg-deep-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getScoreGradient(recommendations.lastMoodsDiversityScore)} transition-all duration-500`}
                  style={{ width: `${recommendations.lastMoodsDiversityScore}%` }}
                />
              </div>
              <p className="text-xs text-earth-500 dark:text-cream-500 mt-2">
                {recommendations.lastMoodsDiversityScore > 70
                  ? '✨ Rich emotional spectrum!'
                  : recommendations.lastMoodsDiversityScore > 40
                  ? '🌱 Keep exploring emotions'
                  : '🎯 Try documenting more moods'}
              </p>
            </div>

            {/* Explore Moods */}
            {recommendations.hasMissingMoods && recommendations.missingMoods.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-earth-700 dark:text-cream-300 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Moods to Explore
                </h3>
                <div className="flex gap-2">
                  {recommendations.missingMoods.slice(0, 6).map((mood, idx) => (
                    <span
                      key={idx}
                      className="text-2xl p-2 rounded-xl bg-sage-100 dark:bg-deep-700 hover:scale-110 transition-transform cursor-pointer"
                    >
                      {mood}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Insights */}
            {patterns.hasPattern && patterns.insights.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30">
                <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">
                  💡 Insights
                </h3>
                {patterns.insights.slice(0, 2).map((insight, idx) => (
                  <p key={idx} className="text-sm text-amber-600 dark:text-amber-300">
                    {insight}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-earth-100 dark:border-deep-700">
            <button
              onClick={onClose}
              className="w-full py-3 bg-leaf-500 hover:bg-leaf-600 text-white font-medium rounded-xl transition-colors"
            >
              Got it!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WellnessInsights;
