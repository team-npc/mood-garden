/**
 * Writing Prompt Display Component
 * Shows daily or mood-based writing prompts to inspire entries
 */

import React, { useState, useEffect } from 'react';
import { RefreshCw, Lightbulb } from 'lucide-react';
import { getDailyPrompt, getMoodPrompt, getRandomPrompt } from '../utils/writingPrompts';

/**
 * WritingPrompt Component
 * @param {Object} props - Component props
 * @param {string} props.mood - Selected mood emoji (optional)
 * @param {Function} props.onUsePrompt - Callback when user applies prompt to entry
 */
const WritingPrompt = ({ mood = null, onUsePrompt = null }) => {
  const [prompt, setPrompt] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Get appropriate prompt based on mood
    if (mood) {
      setPrompt(getMoodPrompt(mood));
    } else {
      setPrompt(getDailyPrompt());
    }
  }, [mood]);

  const handleRefreshPrompt = () => {
    const newPrompt = getRandomPrompt(mood);
    setPrompt(newPrompt);
  };

  const handleUsePrompt = () => {
    if (onUsePrompt) {
      onUsePrompt(prompt);
    }
  };

  if (!prompt) return null;

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-sage-50 to-earth-50 dark:from-sage-900/30 dark:to-earth-900/30 rounded-lg border border-sage-200 dark:border-sage-700 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-sage-600 dark:text-sage-400" />
          <span className="text-sm font-medium text-sage-900 dark:text-sage-100">
            {isExpanded ? '✨ Inspiration (click to collapse)' : '✨ Need inspiration?'}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg border border-sage-200 dark:border-sage-700 shadow-sm">
          <div className="mb-4">
            <p className="text-lg italic text-gray-700 dark:text-gray-300 leading-relaxed">
              "{prompt}"
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleRefreshPrompt}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try another</span>
            </button>

            {onUsePrompt && (
              <button
                type="button"
                onClick={handleUsePrompt}
                className="px-4 py-2 rounded-lg bg-sage-100 dark:bg-sage-900/40 text-sage-800 dark:text-sage-200 hover:bg-sage-200 dark:hover:bg-sage-800/60 transition-colors font-medium text-sm"
              >
                Use as starter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingPrompt;
