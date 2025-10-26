/**
 * Writing Inspiration Component
 * ML-powered prompts and insights to motivate journaling
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, TrendingDown, Clock, Heart, Brain, ChevronRight, RefreshCw, Lightbulb } from 'lucide-react';
import useMLInsights from '../hooks/useMLInsights';

/**
 * Writing Inspiration Component
 */
const WritingInspiration = ({ onPromptSelect }) => {
  const { insights, prompts, patterns, loading, analyzeEntries } = useMLInsights();
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [showInsights, setShowInsights] = useState(false);

  /**
   * Handle prompt selection
   */
  const handleSelectPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    if (onPromptSelect) {
      onPromptSelect(prompt);
    }
  };

  /**
   * Get trend icon
   */
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing':
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'decreasing':
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      default:
        return <Heart className="w-4 h-4 text-sage-600 dark:text-sage-400" />;
    }
  };

  /**
   * Get sentiment color
   */
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'negative':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'text-sage-600 dark:text-sage-400 bg-sage-50 dark:bg-sage-900/20';
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-8 h-8 text-sage-600 dark:text-sage-400" />
          </motion.div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Analyzing your entries...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Card */}
      {insights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                AI Insights from Your Garden
              </h3>
            </div>
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              {showInsights ? 'Hide' : 'Show'} Details
            </button>
          </div>

          <AnimatePresence>
            {showInsights && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"
              >
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Entries Analyzed</div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {insights.totalEntries}
                  </div>
                </div>

                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Words</div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {insights.avgWordCount}
                  </div>
                </div>

                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Mood Trend</div>
                  <div className="flex items-center">
                    {getTrendIcon(insights.emotionalTrend)}
                    <span className="ml-1 text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {insights.emotionalTrend}
                    </span>
                  </div>
                </div>

                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Writing Time</div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-1" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {patterns?.preferredTime}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`rounded-lg p-3 ${getSentimentColor(insights.dominantSentiment)}`}>
            <div className="flex items-start">
              <Sparkles className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium mb-1">Your Emotional Landscape</div>
                <p className="text-sm opacity-90">
                  {insights.dominantSentiment === 'positive' && 
                    `Your entries radiate positivity! With ${insights.totalEntries} entries averaging ${insights.avgWordCount} words, your garden is blooming with optimism. Keep nurturing this beautiful energy! `}
                  {insights.dominantSentiment === 'negative' && 
                    `I notice you're processing some challenging emotions across your ${insights.totalEntries} entries. Remember, even difficult reflections help your garden grow deeper roots. You're doing important work. `}
                  {insights.dominantSentiment === 'neutral' && (
                    insights.totalEntries > 20 
                      ? `Your ${insights.totalEntries} entries show thoughtful reflection. You're building a rich inner garden with an average of ${insights.avgWordCount} words per entry. This consistent practice is powerful! `
                      : `Your entries show balanced reflection. You're observing life with clarity and mindfulness. This steady approach helps your garden grow strong. `
                  )}
                  {insights.emotionalTrend === 'improving' && "Things are looking up! ✨"}
                  {insights.emotionalTrend === 'declining' && "Be gentle with yourself during this time. 🤗"}
                  {insights.writingTrend === 'increasing' && "Your entries are getting longer and more detailed! 📝"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={analyzeEntries}
            className="mt-3 w-full btn-secondary flex items-center justify-center text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Analysis
          </button>
        </motion.div>
      )}

      {/* Writing Prompts */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Lightbulb className="w-6 h-6 text-sage-600 dark:text-sage-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Writing Inspiration
          </h3>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {insights 
            ? "Based on your writing patterns, here are prompts chosen just for you:"
            : "Start your journaling journey with these thoughtful prompts:"}
        </p>

        <div className="space-y-3">
          {prompts.map((prompt, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-4 rounded-lg border-2 transition-all cursor-pointer
                ${selectedPrompt?.title === prompt.title
                  ? 'border-sage-500 dark:border-sage-400 bg-sage-50 dark:bg-sage-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-sage-300 dark:hover:border-sage-600 bg-white dark:bg-gray-800'
                }
              `}
              onClick={() => handleSelectPrompt(prompt)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{prompt.emoji}</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {prompt.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {prompt.type} prompt
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 transition-transform ${
                  selectedPrompt?.title === prompt.title ? 'rotate-90' : ''
                } text-gray-400`} />
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 italic">
                "{prompt.prompt}"
              </p>

              <div className="text-xs text-sage-600 dark:text-sage-400 bg-sage-50 dark:bg-sage-900/20 rounded p-2">
                💚 {prompt.motivation}
              </div>

              {selectedPrompt?.title === prompt.title && (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 w-full btn-primary text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Scroll to journal entry form
                    document.getElementById('journal-entry-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Start Writing
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Daily Motivation */}
      {patterns && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-br from-sage-50 to-earth-50 dark:from-sage-900/20 dark:to-earth-900/20 border-sage-200 dark:border-sage-800"
        >
          <div className="flex items-center mb-3">
            <Heart className="w-5 h-5 text-sage-600 dark:text-sage-400 mr-2" />
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Today's Motivation</h4>
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {patterns.writingTrend === 'increasing' && 
              "You've been writing more deeply lately! Your dedication to self-reflection is helping your garden flourish beautifully. 🌟"}
            {patterns.writingTrend === 'decreasing' && 
              "Even short entries count! Remember, every word you write waters your inner garden. Small seeds grow into mighty trees. 🌱"}
            {patterns.writingTrend === 'stable' && 
              "Your consistent journaling habit is remarkable! Like steady sunlight, your regular reflection helps your garden grow strong and resilient. ✨"}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default WritingInspiration;
