/**
 * Writing Inspiration Component
 * ML-powered prompts and insights to motivate journaling
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, RefreshCw, Lightbulb, Feather, MessageCircle, ListChecks, PenLine } from 'lucide-react';
import useMLInsights from '../hooks/useMLInsights';
import { GardenLoader } from './LazyLoading';

/**
 * Writing Inspiration Component
 */
const WritingInspiration = ({ onPromptSelect }) => {
  const { insights, prompts, patterns, loading, analyzeEntries } = useMLInsights();
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  const handleSelectPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    if (onPromptSelect) {
      onPromptSelect(prompt);
    }
  };

  const getPromptIcon = (type) => {
    switch (type) {
      case 'simple': return Feather;
      case 'feeling': return MessageCircle;
      case 'gratitude': return ListChecks;
      case 'open': return PenLine;
      default: return Lightbulb;
    }
  };

  const getPromptColor = (type) => {
    switch (type) {
      case 'simple': return 'bg-sage-100 dark:bg-sage-900/30 text-sage-600 dark:text-sage-400';
      case 'feeling': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'gratitude': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
      case 'open': return 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400';
      default: return 'bg-leaf-100 dark:bg-leaf-900/30 text-leaf-600 dark:text-leaf-400';
    }
  };

  if (loading) {
    return <GardenLoader message="Analyzing your entries..." size="small" />;
  }

  return (
    <div className="space-y-4">
      {/* Quick Insight Badge */}
      {insights && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-leaf-50 to-sage-50 dark:from-leaf-900/20 dark:to-sage-900/20"
        >
          <div className="p-2 rounded-xl bg-white dark:bg-deep-700">
            <Sparkles className="w-4 h-4 text-leaf-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-earth-700 dark:text-cream-300 truncate">
              {insights.dominantSentiment === 'positive' && "Your garden is blooming! ✨"}
              {insights.dominantSentiment === 'negative' && "Processing emotions... 🌱"}
              {insights.dominantSentiment === 'neutral' && "Steady growth happening 🌿"}
            </p>
          </div>
          <button
            onClick={analyzeEntries}
            className="p-2 rounded-xl hover:bg-white dark:hover:bg-deep-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-earth-500 dark:text-cream-500" />
          </button>
        </motion.div>
      )}

      {/* Section Header */}
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-leaf-500" />
        <h3 className="text-sm font-semibold text-earth-700 dark:text-cream-300">
          Writing Prompts
        </h3>
      </div>

      {/* Clean Prompt Cards */}
      <div className="space-y-2">
        {prompts.slice(0, 4).map((prompt, index) => {
          const Icon = getPromptIcon(prompt.type);
          const isSelected = selectedPrompt?.title === prompt.title;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelectPrompt(prompt)}
              className={`
                p-4 rounded-2xl cursor-pointer transition-all duration-200
                ${isSelected
                  ? 'bg-leaf-50 dark:bg-leaf-900/30 ring-2 ring-leaf-400 dark:ring-leaf-600'
                  : 'bg-white dark:bg-deep-800/50 hover:bg-sage-50 dark:hover:bg-deep-700/50'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`p-2 rounded-xl ${getPromptColor(prompt.type)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-earth-800 dark:text-cream-100">
                      {prompt.title}
                    </span>
                    <span className="text-xs text-earth-500 dark:text-cream-500 capitalize">
                      {prompt.type}
                    </span>
                  </div>
                  
                  <p className="text-sm text-earth-600 dark:text-cream-400 line-clamp-2">
                    {prompt.prompt}
                  </p>
                  
                  {/* Expanded state */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 pt-3 border-t border-leaf-200 dark:border-leaf-800"
                      >
                        <p className="text-xs text-leaf-600 dark:text-leaf-400 mb-3">
                          💚 {prompt.motivation}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('journal-entry-form')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="w-full py-2 bg-leaf-500 hover:bg-leaf-600 text-white text-sm font-medium rounded-xl transition-colors"
                        >
                          Start Writing
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Today's Motivation */}
      {patterns && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20"
        >
          <div className="flex items-start gap-3">
            <Heart className="w-4 h-4 text-amber-500 mt-0.5" />
            <p className="text-sm text-earth-700 dark:text-cream-300">
              {patterns.writingTrend === 'increasing' && 
                "Your writing is flourishing! Keep nurturing your inner garden. 🌟"}
              {patterns.writingTrend === 'decreasing' && 
                "Small seeds grow mighty trees. Every word matters. 🌱"}
              {patterns.writingTrend === 'stable' && 
                "Consistency is your superpower! Your garden grows strong. ✨"}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WritingInspiration;
