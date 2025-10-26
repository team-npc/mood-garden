/**
 * Journal Entry Form Component
 * Handles creating new journal entries with mood selection
 */

import React, { useState } from 'react';
import { X, Send, Smile } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

/**
 * Journal Entry Form Component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {boolean} props.isSubmitting - Whether the form is being submitted
 */
const JournalEntryForm = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  /**
   * Handle content change
   * @param {Event} e - Input change event
   */
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    try {
      await onSubmit(content.trim(), selectedMood);
      
      // Reset form
      setContent('');
      setSelectedMood(null);
      setShowEmojiPicker(false);
      onClose();
    } catch (error) {
      console.error('Error submitting entry:', error);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    setContent('');
    setSelectedMood(null);
    setShowEmojiPicker(false);
    onClose();
  };

  /**
   * Handle emoji selection
   * @param {string} emoji - Selected emoji
   */
  const handleEmojiSelect = (emoji) => {
    setSelectedMood(emoji);
    setShowEmojiPicker(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">New Journal Entry</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Mood Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              How are you feeling? (optional)
            </label>
            <div className="flex items-center space-x-2">
              {selectedMood ? (
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{selectedMood}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedMood(null)}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Smile className="w-4 h-4" />
                  <span className="text-sm">Choose mood</span>
                </button>
              )}
            </div>
            
            {showEmojiPicker && (
              <div className="mt-2">
                <EmojiPicker onSelect={handleEmojiSelect} />
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What's on your mind?
            </label>
            <textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              placeholder="Let your thoughts flow... Write about your day, your feelings, your dreams, or anything that comes to mind."
              className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              disabled={isSubmitting}
              autoFocus
            />
            
            {/* Plant encouragement */}
            <div className="mt-2 text-sm text-sage-600 dark:text-sage-400 text-center">
              {content.length === 0 
                ? "🌱 Your plant is waiting for your thoughts..."
                : content.length < 50
                ? "🌿 Your plant feels the first drops of care"
                : content.length < 150
                ? "🌸 Your plant is beginning to flourish"
                : "🌳 Your plant is thriving with such thoughtful care!"
              }
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="flex items-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JournalEntryForm;