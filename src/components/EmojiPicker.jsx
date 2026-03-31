/**
 * Emoji Picker Component
 * Simple emoji selection interface for mood tracking
 */

import React from 'react';

/**
 * Emoji Picker Component
 * @param {Object} props - Component props
 * @param {Function} props.onSelect - Function called when emoji is selected
 */
const EmojiPicker = ({ onSelect }) => {
  // Curated list of mood emojis organized by category
  const emojiCategories = {
    'Happy': ['😊', '😄', '🥰', '😆', '🤗', '🌞', '✨', '🎉'],
    'Calm': ['😌', '😇', '🧘‍♀️', '🧘‍♂️', '🌸', '🍃', '💆‍♀️', '🕊️'],
    'Thoughtful': ['🤔', '💭', '📝', '🎯', '🔍', '💡', '🧠', '📚'],
    'Grateful': ['🙏', '💖', '🌺', '🌻', '🌈', '⭐', '💫', '🌟'],
    'Sad': ['😢', '😔', '💔', '😞', '😪', '🌧️', '☁️', '💙'],
    'Stressed': ['😰', '😅', '🤯', '😵', '🌀', '⚡', '🔥', '💢'],
    'Excited': ['🤩', '🎊', '🚀', '⚡', '🔥', '💥', '🌟', '🎈'],
    'Peaceful': ['☮️', '🌊', '🌙', '🌅', '🕯️', '🏔️', '🌿', '🦋']
  };

  return (
    <div className="bg-white dark:bg-deep-700 border border-sage-200 dark:border-deep-500 rounded-xl shadow-lg p-4 max-w-md">
      <div className="space-y-3">
        {Object.entries(emojiCategories).map(([category, emojis]) => (
          <div key={category}>
            <h4 className="text-xs font-medium text-earth-500 dark:text-cream-500 mb-2 uppercase tracking-wide">
              {category}
            </h4>
            <div className="grid grid-cols-8 gap-1">
              {emojis.map((emoji, index) => (
                <button
                  key={`${category}-${index}`}
                  type="button"
                  onClick={() => onSelect(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-sage-100 dark:hover:bg-deep-600 rounded-lg transition-colors"
                  title={`${category} - ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-sage-200 dark:border-deep-500">
        <p className="text-xs text-earth-500 dark:text-cream-500 text-center">
          Choose an emoji that represents your current mood
        </p>
      </div>
    </div>
  );
};

export default EmojiPicker;