/**
 * Wellness Insights Component
 * Displays mood insights and encouragement without numerical scores
 * Philosophy: No quantification - focus on growth narratives
 */

import React from 'react';
import { X, TrendingUp, Sparkles, Target, Heart, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WellnessInsights = ({ wellnessSummary, isOpen, onClose }) => {
  if (!isOpen || !wellnessSummary) return null;

  const { status, trends, patterns, recommendations, message } = wellnessSummary;

  // Map status to encouraging visual representation
  const getStatusVisual = (s) => {
    if (s === 'thriving' || recommendations?.lastMoodsDiversityScore >= 70) {
      return { emoji: '🌸', color: 'text-pink-400', bg: 'from-pink-400 to-rose-500', label: 'Flourishing' };
    }
    if (s === 'growing' || recommendations?.lastMoodsDiversityScore >= 40) {
      return { emoji: '🌿', color: 'text-leaf-400', bg: 'from-leaf-400 to-sage-500', label: 'Growing' };
    }
    return { emoji: '🌱', color: 'text-green-400', bg: 'from-green-400 to-emerald-500', label: 'Taking Root' };
  };

  const statusVisual = getStatusVisual(status);

  return (
    <AnimatePresence>
      <div className="modal-overlay flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-deep-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden"
        >
          {/* Header - Visual growth indicator instead of score */}
          <div className="relative p-8 text-center bg-gradient-to-br from-sage-50 to-leaf-50 dark:from-deep-700 dark:to-deep-800">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-earth-500 dark:text-cream-400" />
            </button>
            
            {/* Growth visual instead of numerical score */}
            <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-7xl"
              >
                {statusVisual.emoji}
              </motion.div>
            </div>
            
            <h2 className={`text-xl font-bold ${statusVisual.color} mb-1`}>
              {statusVisual.label}
            </h2>
            <p className="text-sm text-earth-600 dark:text-cream-400">
              {message}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Quick Insights - Visual, not numerical */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-sage-50 dark:bg-deep-700/50">
                <div className="text-2xl mb-1">📝</div>
                <div className="text-xs text-earth-500 dark:text-cream-500">
                  {trends.totalEntries > 0 ? 'Writing regularly' : 'Starting out'}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-leaf-50 dark:bg-deep-700/50">
                <div className="text-2xl mb-1">🎭</div>
                <div className="text-xs text-earth-500 dark:text-cream-500">
                  {trends.moodVariety > 3 ? 'Rich emotions' : 'Exploring feelings'}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-deep-700/50">
                <div className="text-2xl">
                  {trends.dominantMood || '💭'}
                </div>
                <div className="text-xs text-earth-500 dark:text-cream-500">Common feeling</div>
              </div>
            </div>

            {/* Mood Distribution - Visual only */}
            {trends.moodDistribution.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-earth-700 dark:text-cream-300 mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  Your Emotional Landscape
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trends.moodDistribution.slice(0, 5).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-2 bg-sage-50 dark:bg-deep-700/50 rounded-full"
                    >
                      <span className="text-xl">{item.mood}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Emotional Diversity - Visual indicator only */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-leaf-50 to-sage-50 dark:from-leaf-900/20 dark:to-sage-900/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-earth-700 dark:text-cream-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-leaf-500" />
                  Emotional Range
                </span>
                <Leaf className={`w-5 h-5 ${statusVisual.color}`} />
              </div>
              {/* Visual bars without percentages */}
              <div className="flex gap-1 h-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all ${
                      (recommendations?.lastMoodsDiversityScore || 0) >= i * 20
                        ? 'bg-leaf-500'
                        : 'bg-earth-200 dark:bg-deep-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-earth-500 dark:text-cream-500 mt-2">
                {recommendations?.lastMoodsDiversityScore > 70
                  ? '✨ A beautiful range of emotions!'
                  : recommendations?.lastMoodsDiversityScore > 40
                  ? '🌱 Your emotional awareness is growing'
                  : '💚 Every feeling matters'}
              </p>
            </div>

            {/* Moods to Explore */}
            {recommendations?.hasMissingMoods && recommendations.missingMoods?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-earth-700 dark:text-cream-300 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Feelings to Notice
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
            {patterns?.hasPattern && patterns.insights?.length > 0 && (
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
              Keep Growing 🌱
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WellnessInsights;
