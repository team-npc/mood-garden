/**
 * Journal Entry Form Component
 * Handles creating new journal entries with mood selection
 * Includes auto-save drafts to localStorage and sentence starters
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { X, Send, Smile, Save, RotateCcw, Lightbulb } from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import WritingPrompt from './WritingPrompt';
import { getSentenceStarters } from '../utils/writingPrompts';

const DRAFT_KEY = 'mood-garden-draft';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

/**
 * Journal Entry Form Component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {boolean} props.isSubmitting - Whether the form is being submitted
 */
const JournalEntryForm = ({ isOpen, onClose, onSubmit, isSubmitting, initialContent = '' }) => {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [tagsInput, setTagsInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showSentenceStarters, setShowSentenceStarters] = useState(false);
  const autoSaveTimerRef = useRef(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft && !initialContent) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft.content || draft.mood || draft.tags) {
            setHasDraft(true);
          }
        } catch (e) {
          console.error('Error parsing draft:', e);
        }
      }
      if (initialContent) {
        setContent(initialContent);
      }
    }
  }, [isOpen, initialContent]);

  // Auto-save to localStorage
  const saveDraft = useCallback(() => {
    if (content.trim() || selectedMood || tagsInput.trim()) {
      const draft = {
        content,
        mood: selectedMood,
        tags: tagsInput,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setLastSaved(new Date());
    }
  }, [content, selectedMood, tagsInput]);

  // Set up auto-save timer
  useEffect(() => {
    if (isOpen && (content.trim() || selectedMood || tagsInput.trim())) {
      autoSaveTimerRef.current = setInterval(saveDraft, AUTO_SAVE_INTERVAL);
    }
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [isOpen, content, selectedMood, tagsInput, saveDraft]);

  // Restore draft
  const restoreDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setContent(draft.content || '');
        setSelectedMood(draft.mood || null);
        setTagsInput(draft.tags || '');
        setHasDraft(false);
      } catch (e) {
        console.error('Error restoring draft:', e);
      }
    }
  };

  // Clear draft
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setLastSaved(null);
  };

  /**
   * Handle content change with auto-save on blur
   * @param {Event} e - Input change event
   */
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
  };

  /**
   * Handle textarea blur - save draft
   */
  const handleBlur = () => {
    saveDraft();
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    try {
      const parsedTags = tagsInput
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 8);

      await onSubmit(content.trim(), selectedMood, parsedTags);
      
      // Reset form and clear draft
      setContent('');
      setSelectedMood(null);
      setTagsInput('');
      setShowEmojiPicker(false);
      setShowSentenceStarters(false);
      clearDraft();
      onClose();
    } catch (error) {
      console.error('Error submitting entry:', error);
    }
  };

  /**
   * Handle modal close - save draft first
   */
  const handleClose = () => {
    saveDraft();
    setContent('');
    setSelectedMood(null);
    setTagsInput('');
    setShowEmojiPicker(false);
    setShowSentenceStarters(false);
    onClose();
  };

  /**
   * Use sentence starter
   */
  const useSentenceStarter = (starter) => {
    if (content) {
      setContent(`${content} ${starter}`);
    } else {
      setContent(starter);
    }
    setShowSentenceStarters(false);
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
    <div className="modal-overlay flex items-center justify-center p-4">
      <div className="bento-item max-w-2xl w-full max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sage-200 dark:border-deep-600">
          <div>
            <h2 className="text-xl font-semibold text-earth-800 dark:text-cream-100">New Journal Entry</h2>
            {lastSaved && (
              <div className="flex items-center space-x-1 text-xs text-earth-500 dark:text-cream-500 mt-1">
                <Save className="w-3 h-3" />
                <span>Draft saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-earth-500 dark:text-cream-500 hover:text-earth-700 dark:hover:text-cream-200 transition-colors p-2 rounded-xl hover:bg-sage-100 dark:hover:bg-deep-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Draft Recovery Banner */}
        {hasDraft && (
          <div className="mx-6 mt-4 p-3 bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-300">
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">You have an unsaved draft</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={restoreDraft}
                className="text-sm text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 font-medium"
              >
                Restore
              </button>
              <button
                type="button"
                onClick={clearDraft}
                className="text-sm text-earth-500 dark:text-cream-500 hover:text-earth-700 dark:hover:text-cream-300"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Mood Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-earth-700 dark:text-cream-300 mb-2">
              How are you feeling? (optional)
            </label>
            <div className="flex items-center space-x-2">
              {selectedMood ? (
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{selectedMood}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedMood(null)}
                    className="text-sm text-earth-500 dark:text-cream-500 hover:text-earth-700 dark:hover:text-cream-200"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex items-center space-x-2 px-3 py-2 border border-sage-300 dark:border-deep-500 rounded-xl hover:bg-sage-100 dark:hover:bg-deep-600 transition-colors text-earth-700 dark:text-cream-300"
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
            <label htmlFor="content" className="block text-sm font-medium text-earth-700 dark:text-cream-300 mb-2">
              What's on your mind?
            </label>

            {/* Writing Prompt for Inspiration */}
            <WritingPrompt 
              mood={selectedMood} 
              onUsePrompt={(prompt) => {
                if (content) {
                  setContent(`${content}\n\n${prompt}`);
                } else {
                  setContent(prompt);
                }
              }}
            />

            <textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              onBlur={handleBlur}
              placeholder="Let your thoughts flow... Write about your day, your feelings, your dreams, or anything that comes to mind."
              className="w-full h-64 px-4 py-3 border border-sage-300 dark:border-deep-500 rounded-xl focus:ring-2 focus:ring-leaf-500/30 focus:border-leaf-500 resize-none bg-white dark:bg-deep-700 text-earth-800 dark:text-cream-100 placeholder-earth-400 dark:placeholder-cream-600"
              disabled={isSubmitting}
              autoFocus
            />

            {/* Sentence Starters */}
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowSentenceStarters(!showSentenceStarters)}
                className="flex items-center space-x-1 text-sm text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Need help starting? Try a sentence starter</span>
              </button>
              
              {showSentenceStarters && (
                <div className="mt-2 p-3 bg-sage-100 dark:bg-deep-600/50 rounded-xl border border-sage-200 dark:border-deep-500">
                  <div className="text-xs text-earth-600 dark:text-cream-400 mb-2">Click to use:</div>
                  <div className="flex flex-wrap gap-2">
                    {getSentenceStarters(selectedMood).map((starter, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => useSentenceStarter(starter)}
                        className="text-sm px-3 py-1.5 bg-sage-200 dark:bg-sage-600/30 hover:bg-sage-300 dark:hover:bg-sage-600/50 text-earth-700 dark:text-cream-200 rounded-lg transition-colors"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Plant encouragement */}
            <div className="mt-2 text-sm text-leaf-600 dark:text-leaf-400 text-center">
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

          {/* Tags */}
          <div className="mb-5">
            <label htmlFor="entry-tags" className="block text-sm font-medium text-earth-700 dark:text-cream-300 mb-2">
              Tags (optional)
            </label>
            <input
              id="entry-tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="gratitude, work, family"
              className="w-full px-4 py-2 border border-sage-300 dark:border-deep-500 rounded-xl bg-white dark:bg-deep-700 text-earth-800 dark:text-cream-100 placeholder-earth-400 dark:placeholder-cream-600"
              disabled={isSubmitting}
            />
            <p className="text-xs mt-1 text-earth-500 dark:text-cream-600">Use commas to separate tags (up to 8).</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
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