/**
 * Advanced Search and Filter Utilities
 */

/**
 * Perform full-text search across multiple fields
 * @param {Array} entries - Journal entries to search
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered entries
 */
export const fullTextSearch = (entries, searchTerm) => {
  if (!searchTerm.trim()) return entries;

  const term = searchTerm.toLowerCase();
  return entries.filter(entry => {
    const content = (entry.content || '').toLowerCase();
    const tags = ((entry.tags || []).join(' ')).toLowerCase();
    const mood = (entry.mood || '').toLowerCase();
    
    return content.includes(term) || tags.includes(term) || mood.includes(term);
  });
};

/**
 * Apply advanced filters to entries
 * @param {Array} entries - Journal entries
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered entries
 */
export const applyAdvancedFilters = (entries, filters = {}) => {
  let filtered = [...entries];

  // Mood filter
  if (filters.moods && filters.moods.length > 0) {
    filtered = filtered.filter(entry => filters.moods.includes(entry.mood));
  }

  // Tags filter - must have at least one matching tag
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(entry => {
      const entryTags = entry.tags || [];
      return filters.tags.some(tag => entryTags.includes(tag));
    });
  }

  // Date range filter
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    fromDate.setHours(0, 0, 0, 0);
    filtered = filtered.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= fromDate;
    });
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate <= toDate;
    });
  }

  // Word count filter
  if (filters.minWords !== '' && filters.minWords !== null) {
    const minWords = parseInt(filters.minWords, 10);
    if (!isNaN(minWords)) {
      filtered = filtered.filter(entry => {
        const words = entry.content.trim().split(/\s+/).length;
        return words >= minWords;
      });
    }
  }

  if (filters.maxWords !== '' && filters.maxWords !== null) {
    const maxWords = parseInt(filters.maxWords, 10);
    if (!isNaN(maxWords)) {
      filtered = filtered.filter(entry => {
        const words = entry.content.trim().split(/\s+/).length;
        return words <= maxWords;
      });
    }
  }

  return filtered;
};

/**
 * Get hashtag suggestions based on typed input
 * @param {string} input - User input (hashtag search term)
 * @param {Array} allTags - All available tags
 * @param {number} limit - Max suggestions to return
 * @returns {Array} Suggested tags
 */
export const getHashtagSuggestions = (input, allTags = [], limit = 5) => {
  if (!input || input.length <2) return [];

  const term = input.toLowerCase().replace(/^#/, '');
  const suggestions = allTags
    .filter(tag => tag.toLowerCase().includes(term))
    .sort((a, b) => {
      // Prioritize tags that start with the term
      const aStarts = a.toLowerCase().startsWith(term);
      const bStarts = b.toLowerCase().startsWith(term);
      if (aStarts !== bStarts) return bStarts ? 1 : -1;
      // Then sort alphabetically
      return a.localeCompare(b);
    })
    .slice(0, limit);

  return suggestions;
};

/**
 * Highlight search matches in text
 * @param {string} text - Text to highlight
 * @param {string} searchTerm - Term to highlight
 * @returns {Object} { highlighted: string, bold: Array<string> }
 */
export const highlightMatches = (text, searchTerm) => {
  if (!searchTerm || !text) return { highlighted: text, bold: [] };

  const term = searchTerm.toLowerCase();
  const regex = new RegExp(`(${term})`, 'gi');
  const matches = text.match(regex) || [];
  
  return {
    highlighted: text.replace(regex, '< strong>$1</strong>'),
    bold: [...new Set(matches)]
  };
};

/**
 * Get recently used tags
 * @param {Array} entries - Journal entries
 * @param {number} limit - Max tags to return
 * @returns {Array} Recently used tags
 */
export const getRecentlyUsedTags = (entries, limit = 10) => {
  const tagMap = new Map();

  // Count tag occurrences and track latest date
  entries.forEach(entry => {
    (entry.tags || []).forEach(tag => {
      if (tagMap.has(tag)) {
        const item = tagMap.get(tag);
        item.count++;
        item.lastUsed = new Date(entry.createdAt);
      } else {
        tagMap.set(tag, {
          tag,
          count: 1,
          lastUsed: new Date(entry.createdAt)
        });
      }
    });
  });

  return Array.from(tagMap.values())
    .sort((a, b) => {
      // Sort by recency, then by frequency
      if (a.lastUsed !== b.lastUsed) {
        return b.lastUsed - a.lastUsed;
      }
      return b.count - a.count;
    })
    .map(item => item.tag)
    .slice(0, limit);
};

/**
 * Get recently used moods
 * @param {Array} entries - Journal entries
 * @param {number} limit - Max moods to return
 * @returns {Array} Recently used moods
 */
export const getRecentlyUsedMoods = (entries, limit = 10) => {
  const moodMap = new Map();

  entries.forEach(entry => {
    if (entry.mood) {
      if (moodMap.has(entry.mood)) {
        const item = moodMap.get(entry.mood);
        item.count++;
        item.lastUsed = new Date(entry.createdAt);
      } else {
        moodMap.set(entry.mood, {
          mood: entry.mood,
          count: 1,
          lastUsed: new Date(entry.createdAt)
        });
      }
    }
  });

  return Array.from(moodMap.values())
    .sort((a, b) => {
      if (a.lastUsed !== b.lastUsed) {
        return b.lastUsed - a.lastUsed;
      }
      return b.count - a.count;
    })
    .map(item => item.mood)
    .slice(0, limit);
};
