/**
 * Smart Collections Utility
 * Auto-groups entries by patterns like weekends, time of day, themes
 */

/**
 * Collection definitions for automatic grouping
 */
export const SMART_COLLECTIONS = {
  weekendReflections: {
    id: 'weekend-reflections',
    name: 'Weekend Reflections',
    icon: '🌅',
    description: 'Entries written on Saturdays and Sundays',
    filter: (entry) => {
      const date = new Date(entry.createdAt);
      const day = date.getDay();
      return day === 0 || day === 6;
    }
  },
  earlyBird: {
    id: 'early-bird',
    name: 'Early Bird',
    icon: '🌄',
    description: 'Entries written before 9 AM',
    filter: (entry) => {
      const date = new Date(entry.createdAt);
      return date.getHours() < 9;
    }
  },
  nightOwl: {
    id: 'night-owl',
    name: 'Night Owl',
    icon: '🌙',
    description: 'Entries written after 10 PM',
    filter: (entry) => {
      const date = new Date(entry.createdAt);
      return date.getHours() >= 22;
    }
  },
  happyMoments: {
    id: 'happy-moments',
    name: 'Happy Moments',
    icon: '😊',
    description: 'Entries with positive moods',
    filter: (entry) => {
      const happyMoods = ['😊', '🥰', '😄', '😌', '✨', '🌟', '😍', '🤗', '😎'];
      return happyMoods.includes(entry.mood);
    }
  },
  challengingDays: {
    id: 'challenging-days',
    name: 'Challenging Days',
    icon: '💪',
    description: 'Entries with difficult emotions',
    filter: (entry) => {
      const challengingMoods = ['😢', '😡', '😰', '😫', '😔', '😱', '😤'];
      return challengingMoods.includes(entry.mood);
    }
  },
  longEntries: {
    id: 'long-entries',
    name: 'Deep Thoughts',
    icon: '📝',
    description: 'Entries with 200+ words',
    filter: (entry) => {
      const wordCount = entry.wordCount || entry.content?.trim().split(/\s+/).length || 0;
      return wordCount >= 200;
    }
  },
  quickNotes: {
    id: 'quick-notes',
    name: 'Quick Notes',
    icon: '⚡',
    description: 'Brief reflections and quick thoughts',
    filter: (entry) => {
      const wordCount = entry.wordCount || entry.content?.trim().split(/\s+/).length || 0;
      return wordCount < 50;
    }
  },
  gratitude: {
    id: 'gratitude',
    name: 'Gratitude',
    icon: '🙏',
    description: 'Entries mentioning gratitude or thankfulness',
    filter: (entry) => {
      const content = (entry.content || '').toLowerCase();
      const tags = (entry.tags || []).map(t => t.toLowerCase());
      return content.includes('grateful') || 
             content.includes('thankful') || 
             content.includes('gratitude') ||
             tags.includes('gratitude') ||
             tags.includes('grateful');
    }
  },
  recentFavorites: {
    id: 'recent-favorites',
    name: 'Recent Favorites',
    icon: '⭐',
    description: 'Your recently pinned entries',
    filter: (entry) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const entryDate = new Date(entry.createdAt);
      return entry.isPinned && entryDate >= thirtyDaysAgo;
    }
  },
  thisWeek: {
    id: 'this-week',
    name: 'This Week',
    icon: '📅',
    description: 'Entries from the current week',
    filter: (entry) => {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return new Date(entry.createdAt) >= startOfWeek;
    }
  }
};

/**
 * Get all smart collections with entry counts
 * @param {Array} entries - All journal entries
 * @returns {Array} Collections with counts and entries
 */
export const getSmartCollections = (entries = []) => {
  return Object.values(SMART_COLLECTIONS).map(collection => {
    const matchingEntries = entries.filter(collection.filter);
    return {
      ...collection,
      count: matchingEntries.length,
      entries: matchingEntries
    };
  }).filter(c => c.count > 0); // Only return collections that have entries
};

/**
 * Get entries for a specific collection
 * @param {string} collectionId - Collection ID
 * @param {Array} entries - All journal entries
 * @returns {Array} Matching entries
 */
export const getCollectionEntries = (collectionId, entries = []) => {
  const collection = Object.values(SMART_COLLECTIONS).find(c => c.id === collectionId);
  if (!collection) return [];
  return entries.filter(collection.filter);
};

/**
 * Detect duplicate entries based on content similarity
 * @param {string} newContent - New entry content
 * @param {Array} recentEntries - Recent entries to compare against
 * @param {number} threshold - Similarity threshold (0-1)
 * @returns {Object|null} Similar entry if found, null otherwise
 */
export const detectDuplicateEntry = (newContent, recentEntries = [], threshold = 0.7) => {
  if (!newContent.trim() || recentEntries.length === 0) return null;

  const normalizedNew = newContent.toLowerCase().trim();
  
  // Only check entries from the last 24 hours
  const dayAgo = new Date();
  dayAgo.setDate(dayAgo.getDate() - 1);
  
  const recent = recentEntries.filter(entry => {
    const entryDate = new Date(entry.createdAt);
    return entryDate >= dayAgo;
  });

  for (const entry of recent) {
    const similarity = calculateSimilarity(normalizedNew, (entry.content || '').toLowerCase().trim());
    if (similarity >= threshold) {
      return { entry, similarity };
    }
  }
  
  return null;
};

/**
 * Simple string similarity calculation using Jaccard index
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score (0-1)
 */
const calculateSimilarity = (str1, str2) => {
  const words1 = new Set(str1.split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(str2.split(/\s+/).filter(w => w.length > 2));
  
  if (words1.size === 0 || words2.size === 0) return 0;
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};

/**
 * Sort options for entries
 */
export const SORT_OPTIONS = [
  { id: 'date-desc', label: 'Newest First', icon: '📅', sort: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
  { id: 'date-asc', label: 'Oldest First', icon: '📆', sort: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
  { id: 'length-desc', label: 'Longest First', icon: '📝', sort: (a, b) => (b.wordCount || 0) - (a.wordCount || 0) },
  { id: 'length-asc', label: 'Shortest First', icon: '⚡', sort: (a, b) => (a.wordCount || 0) - (b.wordCount || 0) },
  { id: 'pinned', label: 'Pinned First', icon: '⭐', sort: (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) },
  { id: 'mood', label: 'By Mood', icon: '😊', sort: (a, b) => (a.mood || '').localeCompare(b.mood || '') }
];

/**
 * Apply sorting to entries
 * @param {Array} entries - Entries to sort
 * @param {string} sortId - Sort option ID
 * @returns {Array} Sorted entries
 */
export const sortEntries = (entries, sortId) => {
  const sortOption = SORT_OPTIONS.find(s => s.id === sortId);
  if (!sortOption) return entries;
  return [...entries].sort(sortOption.sort);
};
