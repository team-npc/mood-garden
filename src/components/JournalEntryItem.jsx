/**
 * Journal Entry Item Component
 * Displays individual journal entries in a list or timeline view
 */

import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Journal Entry Item Component
 * @param {Object} props - Component props
 * @param {Object} props.entry - Journal entry data
 * @param {boolean} props.showFullContent - Whether to show full content by default
 */
const JournalEntryItem = ({ entry, showFullContent = false }) => {
  const [isExpanded, setIsExpanded] = useState(showFullContent);
  
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

  return (
    <div className="card mb-4 transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {entry.mood && (
            <span className="text-2xl" title="Mood">{entry.mood}</span>
          )}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(entry.createdAt)}</span>
          </div>
        </div>
        
        {/* Visual indicator for entry length instead of word count */}
        <div className="flex items-center space-x-1">
          {entry.content.length > 300 && <span className="text-green-500 text-xs">🌳</span>}
          {entry.content.length > 150 && entry.content.length <= 300 && <span className="text-sage-500 text-xs">🌿</span>}
          {entry.content.length <= 150 && <span className="text-yellow-500 text-xs">🌱</span>}
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {isExpanded ? entry.content : getPreview(entry.content)}
        </p>
      </div>

      {/* Expand/Collapse Toggle */}
      {hasLongContent && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-sm text-sage-600 hover:text-sage-700 transition-colors"
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
      {(entry.wordCount >= 100 || entry.characterCount >= 500) && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {entry.wordCount >= 100 && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-sage-100 text-sage-700 rounded-full">
                Thoughtful reflection
              </span>
            )}
            {entry.characterCount >= 500 && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-earth-100 text-earth-700 rounded-full">
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