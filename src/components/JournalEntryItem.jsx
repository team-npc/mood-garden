/**
 * Journal Entry Item Component
 * Displays individual journal entries in a list or timeline view
 * Includes night mode indicator and hover preview
 */

import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Pencil, Trash2, Check, X, Smile, Star, CheckSquare, Square, Lock, LockOpen, Moon, Share2 } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

/**
 * Check if entry was written at night (after 10 PM or before 6 AM)
 */
const isNightEntry = (date) => {
  const entryDate = new Date(date);
  const hours = entryDate.getHours();
  return hours >= 22 || hours < 6;
};

/**
 * Journal Entry Item Component
 * @param {Object} props - Component props
 * @param {Object} props.entry - Journal entry data
 * @param {boolean} props.showFullContent - Whether to show full content by default
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @param {Function} props.onPin - Pin toggle callback
 * @param {boolean} props.isSelected - Whether entry is selected for bulk operations
 * @param {Function} props.onSelect - Selection callback for bulk operations
 * @param {Function} props.onPrivacyToggle - Privacy toggle callback
 * @param {boolean} props.enableHoverPreview - Enable hover preview card
 * @param {Function} props.onShare - Share callback
 */
const JournalEntryItem = ({ entry, showFullContent = false, onEdit, onDelete, onPin, isSelected = false, onSelect, onPrivacyToggle, enableHoverPreview = true, onShare }) => {
  const [isExpanded, setIsExpanded] = useState(showFullContent);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(entry.content);
  const [editMood, setEditMood] = useState(entry.mood || null);
  const [editTagsInput, setEditTagsInput] = useState((entry.tags || []).join(', '));
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const isNight = isNightEntry(entry.createdAt);
  
  /**
   * Format entry date for display
   * @param {Date} date - Entry date
   * @returns {string} Formatted date string
   */
  const formatDate = (date) => {
    const now = new Date();
    const entryDate = new Date(date);
    const diffTime = now - entryDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return entryDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return entryDate.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return entryDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: entryDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  /**
   * Get a preview of the entry content
   * @param {string} content - Full content
   * @param {number} maxLength - Maximum preview length
   * @returns {string} Preview text
   */
  const getPreview = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    
    const preview = content.substring(0, maxLength);
    const lastSpaceIndex = preview.lastIndexOf(' ');
    
    if (lastSpaceIndex > 0) {
      return preview.substring(0, lastSpaceIndex) + '...';
    }
    
    return preview + '...';
  };

  const hasLongContent = entry.content.length > 150;

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    const parsedTags = editTagsInput
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 8);

    if (onEdit) {
      await onEdit(entry.id, editContent.trim(), editMood, parsedTags);
    }
    setIsEditing(false);
  };

  return (
    <div 
      className="bento-item mb-4 transition-all duration-200 hover:shadow-lg relative"
      onMouseEnter={() => enableHoverPreview && !isExpanded && setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      {/* Hover Preview Card */}
      {showPreview && !isExpanded && entry.content.length > 150 && (
        <div className="absolute z-50 left-0 right-0 top-full mt-2 p-4 bg-white dark:bg-deep-700 border border-sage-200 dark:border-deep-500 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
          <div className="text-sm text-earth-600 dark:text-cream-400 mb-2 font-medium">Full Entry Preview</div>
          <div className="text-earth-800 dark:text-cream-200 whitespace-pre-wrap text-sm">
            {entry.content}
          </div>
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-sage-200 dark:border-deep-500">
              {entry.tags.map((tag, idx) => (
                <span key={idx} className="text-xs px-2 py-0.5 bg-sage-200 dark:bg-sage-600/30 text-sage-700 dark:text-sage-300 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {onSelect && (
            <button
              onClick={() => onSelect(entry.id)}
              className="p-1 rounded-lg hover:bg-sage-100 dark:hover:bg-deep-600 transition-colors"
              title={isSelected ? 'Deselect entry' : 'Select entry'}
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-leaf-500 dark:text-leaf-400" />
              ) : (
                <Square className="w-5 h-5 text-earth-500 dark:text-cream-500" />
              )}
            </button>
          )}
          {entry.mood && (
            <span className="text-2xl" title="Mood">{entry.mood}</span>
          )}
          <div className="flex items-center space-x-2 text-sm text-earth-500 dark:text-cream-500">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(entry.createdAt)}</span>
            {/* Night Mode Entry Indicator */}
            {isNight && (
              <span 
                className="flex items-center space-x-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-full text-xs"
                title="Written at night"
              >
                <Moon className="w-3 h-3" />
                <span>Night</span>
              </span>
            )}
          </div>
        </div>
        
        {/* Visual indicator for entry length instead of word count */}
        <div className="flex items-center space-x-1">
          {entry.content.length > 300 && <span className="text-leaf-500 text-xs">🌳</span>}
          {entry.content.length > 150 && entry.content.length <= 300 && <span className="text-leaf-400 text-xs">🌿</span>}
          {entry.content.length <= 150 && <span className="text-leaf-300 text-xs">🌱</span>}

          {!isEditing && (
            <>
              <button
                type="button"
                onClick={() => onPin && onPin(entry.id)}
                className={`p-1 rounded-lg transition-colors ${
                  entry.isPinned
                    ? 'text-leaf-500 dark:text-leaf-400 hover:text-leaf-400 dark:hover:text-leaf-300 bg-leaf-100 dark:bg-leaf-900/30'
                    : 'text-earth-500 dark:text-cream-500 hover:text-leaf-500 dark:hover:text-leaf-400 hover:bg-sage-100 dark:hover:bg-deep-600'
                }`}
                title={entry.isPinned ? 'Unpin favorite' : 'Pin favorite'}
              >
                <Star className="w-4 h-4" fill={entry.isPinned ? 'currentColor' : 'none'} />
              </button>
              <button
                type="button"
                onClick={() => onPrivacyToggle && onPrivacyToggle(entry.id)}
                className={`p-1 rounded-lg transition-colors ${
                  entry.isPrivate
                    ? 'text-blue-500 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-300 bg-blue-100 dark:bg-blue-900/30'
                    : 'text-earth-500 dark:text-cream-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-sage-100 dark:hover:bg-deep-600'
                }`}
                title={entry.isPrivate ? 'Entry is private' : 'Make private'}
              >
                {entry.isPrivate ? (
                  <Lock className="w-4 h-4" fill="currentColor" />
                ) : (
                  <LockOpen className="w-4 h-4" />
                )}
              </button>
              {onShare && (
                <button
                  type="button"
                  onClick={() => onShare(entry)}
                  className="p-1 rounded-lg text-earth-500 dark:text-cream-500 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                  title="Share entry"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setEditContent(entry.content);
                  setEditMood(entry.mood || null);
                  setEditTagsInput((entry.tags || []).join(', '));
                  setIsEditing(true);
                }}
                className="p-1 rounded-lg text-earth-500 dark:text-cream-500 hover:text-leaf-500 dark:hover:text-leaf-400 hover:bg-sage-100 dark:hover:bg-deep-600"
                title="Edit entry"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete && onDelete(entry.id)}
                className="p-1 rounded-lg text-earth-500 dark:text-cream-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                title="Delete entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none">
        {isEditing ? (
          <div className="space-y-3">
            {/* Mood Selector in Edit Mode */}
            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-cream-300 mb-2">
                Mood (optional)
              </label>
              <div className="flex items-center space-x-2">
                {editMood ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{editMood}</span>
                    <button
                      type="button"
                      onClick={() => setEditMood(null)}
                      className="text-sm text-earth-500 dark:text-cream-500 hover:text-earth-700 dark:hover:text-cream-200"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowMoodPicker(!showMoodPicker)}
                    className="flex items-center space-x-2 px-3 py-2 border border-sage-300 dark:border-deep-500 rounded-xl hover:bg-sage-100 dark:hover:bg-deep-600 transition-colors text-earth-700 dark:text-cream-300"
                  >
                    <Smile className="w-4 h-4" />
                    <span className="text-sm">Choose mood</span>
                  </button>
                )}
              </div>
              {showMoodPicker && (
                <div className="mt-2">
                  <EmojiPicker onSelect={(emoji) => {
                    setEditMood(emoji);
                    setShowMoodPicker(false);
                  }} />
                </div>
              )}
            </div>

            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[120px] px-3 py-2 border border-sage-300 dark:border-deep-500 rounded-xl bg-white dark:bg-deep-700 text-earth-800 dark:text-cream-100"
            />
            <input
              value={editTagsInput}
              onChange={(e) => setEditTagsInput(e.target.value)}
              placeholder="tags: gratitude, work"
              className="w-full px-3 py-2 border border-sage-300 dark:border-deep-500 rounded-xl bg-white dark:bg-deep-700 text-earth-800 dark:text-cream-100"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(entry.content);
                  setEditMood(entry.mood || null);
                  setEditTagsInput((entry.tags || []).join(', '));
                  setShowMoodPicker(false);
                }}
                className="btn-secondary inline-flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={!editContent.trim()}
                className="btn-primary inline-flex items-center gap-1 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-earth-800 dark:text-cream-200 leading-relaxed whitespace-pre-wrap">
            {isExpanded ? entry.content : getPreview(entry.content)}
          </p>
        )}
      </div>

      {/* Expand/Collapse Toggle */}
      {hasLongContent && !isEditing && (
        <div className="mt-3 pt-3 border-t border-sage-200 dark:border-deep-600">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-sm text-leaf-600 dark:text-leaf-400 hover:text-leaf-500 dark:hover:text-leaf-300 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Read more</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Tags or Additional Info */}
      {((entry.tags || []).length > 0 || entry.wordCount >= 100 || entry.characterCount >= 500) && !isEditing && (
        <div className="mt-3 pt-3 border-t border-sage-200 dark:border-deep-600">
          <div className="flex flex-wrap gap-2">
            {(entry.tags || []).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {entry.wordCount >= 100 && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-leaf-100 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-300 rounded-full">
                Thoughtful reflection
              </span>
            )}
            {entry.characterCount >= 500 && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-earth-100 dark:bg-earth-900/40 text-earth-600 dark:text-earth-300 rounded-full">
                Deep dive
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntryItem;