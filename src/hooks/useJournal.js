/**
 * Journal Hook
 * Manages journal entries, form state, and data operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { addJournalEntry, getJournalEntries, updateJournalEntry, deleteJournalEntry, toggleEntryPin, archiveEntry, restoreEntry, bulkDeleteEntries, bulkArchiveEntries, toggleEntryPrivacy } from '../firebase/firestore';

const normalizeTags = (tags = []) => {
  return [...new Set(
    tags
      .map((tag) => String(tag || '').trim().toLowerCase())
      .filter(Boolean)
  )].slice(0, 8);
};

const UNDO_TIMEOUT = 4000; // 4 seconds for undo window
const MAX_RETRIES = 2; // Max retry attempts on network failures

/**
 * Custom hook for managing journal entries
 * @returns {Object} Journal state and management functions
 */
export const useJournal = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreEntries, setHasMoreEntries] = useState(false);
  const [lastVisibleDate, setLastVisibleDate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [deletedEntries, setDeletedEntries] = useState([]); // Track soft-deleted entries
  const [failedMutations, setFailedMutations] = useState([]); // Track mutation errors for retry
  const [selectedEntries, setSelectedEntries] = useState([]); // Track bulk selected entries
  const [archivedEntries, setArchivedEntries] = useState([]); // Track archived entries

  /**
   * Helper to wrap mutations with error tracking
   * @param {string} mutationId - Unique ID for this mutation
   * @param {Function} operation - Async operation to perform
   * @param {Function} onRetry - Function called if retry needed
   * @returns {Promise} Operation result
   */
  const withErrorTracking = useCallback(async (mutationId, operation, onRetry) => {
    try {
      const result = await operation();
      // Clear any previous errors for this mutation
      setFailedMutations((prev) => prev.filter((m) => m.id !== mutationId));
      return result;
    } catch (err) {
      // Track the error with retry capability
      const isNetworkError = err.message?.includes('network') || 
                            err.message?.includes('NETWORK') ||
                            err.code?.includes('NETWORK');
      
      if (isNetworkError) {
        setFailedMutations((prev) => [...prev.filter((m) => m.id !== mutationId), {
          id: mutationId,
          error: err,
          timestamp: Date.now(),
          retryFn: onRetry
        }]);
      }
      throw err;
    }
  }, []);

  /**
   * Retry a failed mutation
   * @param {string} mutationId - Mutation ID to retry
   */
  const retryMutation = useCallback(async (mutationId) => {
    const failedMutation = failedMutations.find((m) => m.id === mutationId);
    if (!failedMutation) return;

    try {
      await failedMutation.retryFn();
      // Clear error on success
      setFailedMutations((prev) => prev.filter((m) => m.id !== mutationId));
    } catch (err) {
      console.error('Retry failed:', err);
      throw err;
    }
  }, [failedMutations]);

  /**
   * Toggle pin status of an entry (favorite/bookmark)
   * @param {string} entryId - Entry ID to toggle pin
   */
  const togglePin = useCallback(async (entryId) => {
    if (!user) throw new Error('No user authenticated');

    const entry = entries.find(e => e.id === entryId);
    if (!entry) throw new Error('Entry not found');

    const newPinStatus = !entry.isPinned;
    const mutationId = `pin-${entryId}`;

    try {
      // Optimistic update
      setEntries((prev) => prev.map((e) =>
        e.id === entryId ? { ...e, isPinned: newPinStatus } : e
      ));

      // Perform mutation with error tracking
      await withErrorTracking(
        mutationId,
        () => toggleEntryPin(user.uid, entryId, newPinStatus),
        () => toggleEntryPin(user.uid, entryId, newPinStatus)
      );
    } catch (error) {
      // Revert optimistic update on error
      setEntries((prev) => prev.map((e) =>
        e.id === entryId ? { ...e, isPinned: entry.isPinned } : e
      ));
      throw error;
    }
  }, [user, entries, withErrorTracking]);

  /**
   * Load journal entries from Firestore
   */
  const loadEntries = useCallback(async ({ limit = 20, reset = true } = {}) => {
    if (!user) {
      setEntries([]);
      setHasMoreEntries(false);
      setLastVisibleDate(null);
      setLoading(false);
      return;
    }

    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      const { entries: journalEntries, hasMore, lastVisible } = await getJournalEntries(user.uid, {
        limitCount: limit,
        startAfterDate: reset ? null : lastVisibleDate
      });

      setEntries(prevEntries => {
        if (reset) {
          return journalEntries;
        }

        const merged = [...prevEntries, ...journalEntries];
        const seen = new Set();
        return merged.filter(entry => {
          if (seen.has(entry.id)) return false;
          seen.add(entry.id);
          return true;
        });
      });
      setHasMoreEntries(hasMore);
      setLastVisibleDate(lastVisible || null);
    } catch (error) {
      console.error('Error loading journal entries:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user, lastVisibleDate]);

  /**
   * Load next page of entries
   */
  const loadMoreEntries = useCallback(async () => {
    if (!hasMoreEntries || loadingMore) return;
    await loadEntries({ limit: 20, reset: false });
  }, [hasMoreEntries, loadingMore, loadEntries]);

  /**
   * Load all entries for export and backups
   */
  const loadAllEntries = useCallback(async () => {
    if (!user) return [];

    const allEntries = [];
    let hasMore = true;
    let cursor = null;

    while (hasMore) {
      const result = await getJournalEntries(user.uid, {
        limitCount: 100,
        startAfterDate: cursor
      });

      allEntries.push(...result.entries);
      hasMore = result.hasMore;
      cursor = result.lastVisible;
    }

    return allEntries;
  }, [user]);

  /**
   * Add a new journal entry
   * @param {string} content - Entry content
   * @param {string} mood - Selected mood/emoji
   * @returns {Promise<string>} Entry ID
   */
  const addEntry = useCallback(async (content, mood = null, tags = []) => {
    if (!user || !content.trim()) {
      const error = !user ? 'No user authenticated' : 'Content is required';
      throw new Error(error);
    }

    setSubmitting(true);
    const mutationId = `add-${Date.now()}`;

    try {
      const normalizedTags = normalizeTags(tags);
      const newEntry = {
        id: null,
        content: content.trim(),
        mood,
        tags: normalizedTags,
        createdAt: new Date(),
        wordCount: content.trim().split(/\s+/).length,
        characterCount: content.length
      };

      // Optimistic update
      setEntries(prev => [{...newEntry}, ...prev]);

      // Perform mutation with error tracking
      const entryId = await withErrorTracking(
        mutationId,
        () => addJournalEntry(user.uid, content, mood, normalizedTags),
        () => addJournalEntry(user.uid, content, mood, normalizedTags)
      );
      
      // Update with real entry ID
      newEntry.id = entryId;
      setEntries(prev => {
        const idx = prev.findIndex(e => !e.id || e.id === null);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = {...newEntry, id: entryId};
          return updated;
        }
        return prev;
      });
      
      return entryId;
    } catch (error) {
      console.error('Error adding journal entry:', error);
      // Revert optimistic update on error
      setEntries(prev => prev.filter(e => e.id !== null));
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [user, withErrorTracking]);

  /**
   * Update an existing journal entry
   * @param {string} entryId - Entry ID
   * @param {string} content - Updated content
  * @param {string|null} mood - Updated mood
  * @param {Array<string>} tags - Updated tags
   */
  const updateEntry = useCallback(async (entryId, content, mood = null, tags = []) => {
    if (!user || !content.trim()) {
      const err = !user ? 'No user authenticated' : 'Content is required';
      throw new Error(err);
    }

    const mutationId = `update-${entryId}`;
    const originalEntry = entries.find(e => e.id === entryId);

    try {
      const normalizedTags = normalizeTags(tags);
      
      // Optimistic update
      setEntries((prev) => prev.map((entry) => (
        entry.id === entryId
          ? {
              ...entry,
              content: content.trim(),
              mood,
              tags: normalizedTags,
              wordCount: content.trim().split(/\s+/).length,
              characterCount: content.length
            }
          : entry
      )));

      // Perform mutation with error tracking
      await withErrorTracking(
        mutationId,
        () => updateJournalEntry(user.uid, entryId, content, mood, normalizedTags),
        () => updateJournalEntry(user.uid, entryId, content, mood, normalizedTags)
      );
    } catch (error) {
      // Revert optimistic update on error
      if (originalEntry) {
        setEntries((prev) => prev.map((entry) => 
          entry.id === entryId ? originalEntry : entry
        ));
      }
      throw error;
    }
  }, [user, entries, withErrorTracking]);

  /**
   * Delete a journal entry
   * @param {string} entryId - Entry ID
   */
  const deleteEntry = useCallback(async (entryId) => {
    if (!user) {
      throw new Error('No user authenticated');
    }

    await deleteJournalEntry(user.uid, entryId);
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
  }, [user]);

  /**
   * Soft-delete entry with undo window (4 seconds)
   * Entry is removed from display immediately but can be restored
   * Hard-delete happens automatically after timeout
   * @param {string} entryId - Entry ID to delete
   * @returns {Promise<Object>} { entryId, undoFunction }
   */
  const deleteEntryWithUndo = useCallback(async (entryId) => {
    if (!user) {
      throw new Error('No user authenticated');
    }

    // Find the entry to move to trash
    const entryToDelete = entries.find(e => e.id === entryId);
    if (!entryToDelete) {
      throw new Error('Entry not found');
    }

    const mutationId = `delete-${entryId}`;

    // Optimistically remove from display
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
    
    // Add to deleted queue
    const deletedItem = {
      id: entryId,
      entry: entryToDelete,
      timestamp: Date.now()
    };
    
    setDeletedEntries((prev) => [...prev, deletedItem]);

    // Set timeout for hard-delete with error tracking
    const timeoutId = setTimeout(async () => {
      try {
        // Hard delete from Firestore with error tracking and retry
        await withErrorTracking(
          mutationId,
          () => deleteJournalEntry(user.uid, entryId),
          () => deleteJournalEntry(user.uid, entryId)
        );
        // Remove from deleted queue
        setDeletedEntries((prev) => prev.filter((item) => item.id !== entryId));
      } catch (error) {
        console.error('Error hard-deleting entry:', error);
        // On error, restore entry to entries so user can try again or undo
        setEntries((prev) => {
          const restored = [...prev, entryToDelete];
          return restored.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
        });
        // Show failed mutation state for retry
      }
    }, UNDO_TIMEOUT);

    // Return undo function
    const undoFunc = async () => {
      clearTimeout(timeoutId);
      // Restore to entries
      setEntries((prev) => {
        // Reconstruct sorted position
        const restored = [...prev, entryToDelete];
        return restored.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      });
      // Remove from deleted queue
      setDeletedEntries((prev) => prev.filter((item) => item.id !== entryId));
    };

    return { entryId, undoFunc };
  }, [user, entries, withErrorTracking]);

  /**
   * Restore a soft-deleted entry
   * @param {string} entryId - Entry ID to restore
   */
  const restoreEntry = useCallback(async (entryId) => {
    const deletedItem = deletedEntries.find((item) => item.id === entryId);
    if (!deletedItem) return;

    // Restore to entries
    setEntries((prev) => {
      const restored = [...prev, deletedItem.entry];
      return restored.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    });
    
    // Remove from deleted queue
    setDeletedEntries((prev) => prev.filter((item) => item.id !== entryId));
  }, [deletedEntries]);

  /**
   * Calculate journaling streak (consecutive days with entries)
   * @returns {Object} { currentStreak, longestStreak, streakStartDate }
   */
  const calculateStreak = useCallback(() => {
    if (!entries.length) {
      return { currentStreak: 0, longestStreak: 0, streakStartDate: null };
    }

    // Get unique entry dates, sorted newest first
    const entryDates = [...new Set(
      entries.map(e => new Date(e.createdAt).toDateString())
    )].map(d => new Date(d)).sort((a, b) => b - a);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let streakStartDate = null;

    // Calculate streaks
    for (let i = 0; i < entryDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const dayDiff = Math.floor((entryDates[i - 1] - entryDates[i]) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          tempStreak++;
        } else if (dayDiff > 1) {
          tempStreak = 1;
        }
      }

      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }

    // Check if current streak is still active (includes today or yesterday)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastEntryDate = new Date(entryDates[0]);
    lastEntryDate.setHours(0, 0, 0, 0);

    if (lastEntryDate.getTime() === today.getTime() || lastEntryDate.getTime() === yesterday.getTime()) {
      currentStreak = entryDates.some(d => {
        const dCopy = new Date(d);
        dCopy.setHours(0, 0, 0, 0);
        return dCopy.getTime() === today.getTime();
      }) ? 1 : tempStreak;

      // Calculate actual current streak
      let streakCount = 0;
      for (let i = 0; i < entryDates.length; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const hasEntry = entryDates.some(d => {
          const dCopy = new Date(d);
          dCopy.setHours(0, 0, 0, 0);
          return dCopy.getTime() === checkDate.getTime();
        });
        if (hasEntry) {
          streakCount++;
        } else {
          break;
        }
      }
      currentStreak = streakCount;
      
      if (currentStreak > 0) {
        streakStartDate = new Date(today);
        streakStartDate.setDate(streakStartDate.getDate() - (currentStreak - 1));
      }
    }

    return { currentStreak, longestStreak, streakStartDate };
  }, [entries]);

  /**
   * Get plant-based insights instead of statistics
   * @returns {Object} Plant-focused insights
   */
  const getPlantInsights = useCallback(() => {
    if (!entries.length) {
      return {
        plantMessage: "Your seed is waiting to sprout...",
        encouragement: "Write your first entry to begin your garden journey",
        recentActivity: "quiet",
        growthPhase: "dormant"
      };
    }

    const recentEntries = entries.slice(0, 7); // Last 7 entries
    const today = new Date();
    
    // Determine recent activity level based on entries
    const daysWithEntries = new Set(
      recentEntries.map(entry => 
        new Date(entry.createdAt).toDateString()
      )
    ).size;
    
    let activityLevel;
    let plantMessage;
    let encouragement;
    let growthPhase;
    
    if (daysWithEntries >= 5) {
      activityLevel = "flourishing";
      plantMessage = "Your garden is thriving with regular care";
      encouragement = "Keep nurturing your thoughts";
      growthPhase = "blooming";
    } else if (daysWithEntries >= 3) {
      activityLevel = "growing";
      plantMessage = "Your plant is growing steadily";
      encouragement = "Your consistency is showing";
      growthPhase = "developing";
    } else if (daysWithEntries >= 1) {
      activityLevel = "budding";
      plantMessage = "Small steps are leading to growth";
      encouragement = "Every entry helps your plant grow";
      growthPhase = "sprouting";
    } else {
      activityLevel = "resting";
      plantMessage = "Your plant misses your thoughts";
      encouragement = "A gentle return to writing awaits";
      growthPhase = "waiting";
    }

    const streakInfo = calculateStreak();

    return {
      plantMessage,
      encouragement,
      recentActivity: activityLevel,
      growthPhase,
      entriesCount: entries.length,
      hasRecentEntries: daysWithEntries > 0,
      currentStreak: streakInfo.currentStreak,
      longestStreak: streakInfo.longestStreak,
      streakStartDate: streakInfo.streakStartDate
    };
  }, [entries, calculateStreak]);

  /**
   * Get entries grouped by date
   * @returns {Object} Entries grouped by date
   */
  const getEntriesByDate = useCallback(() => {
    const grouped = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.createdAt);
      const dateKey = date.toDateString();
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(entry);
    });

    return grouped;
  }, [entries]);

  /**
   * Format entry date for display
   * @param {Date} date - Entry date
   * @returns {string} Formatted date string
   */
  const formatEntryDate = useCallback((date) => {
    const now = new Date();
    const entryDate = new Date(date);
    const diffTime = now - entryDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return entryDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }, []);

  /**
   * Get mood garden overview instead of mood statistics
   * @returns {Object} Mood garden insights
   */
  const getMoodGarden = useCallback(() => {
    const moodEntries = entries.filter(entry => entry.mood);
    
    if (!moodEntries.length) {
      return {
        gardenMessage: "Your emotional garden awaits color",
        suggestion: "Try adding moods to your entries to see them bloom",
        moodPresence: "minimal",
        colorfulEntries: false
      };
    }

    const recentMoods = moodEntries.slice(0, 10).map(entry => entry.mood);
    const uniqueMoods = new Set(recentMoods);
    
    let gardenMessage;
    let suggestion;
    let moodPresence;
    
    if (uniqueMoods.size >= 5) {
      gardenMessage = "Your emotional garden is rich and diverse";
      suggestion = "What a beautiful spectrum of feelings you're exploring";
      moodPresence = "vibrant";
    } else if (uniqueMoods.size >= 3) {
      gardenMessage = "Your garden is growing with varied emotions";
      suggestion = "Each feeling adds a unique color to your garden";
      moodPresence = "colorful";
    } else if (uniqueMoods.size >= 1) {
      gardenMessage = "Your garden is beginning to show its colors";
      suggestion = "Try exploring different moods in your entries";
      moodPresence = "budding";
    }

    return {
      gardenMessage,
      suggestion,
      moodPresence,
      colorfulEntries: true,
      recentMoods: Array.from(uniqueMoods).slice(0, 5),
      moodVariety: uniqueMoods.size
    };
  }, [entries]);

  /**
   * Toggle selection of an entry for bulk operations
   * @param {string} entryId - Entry ID to toggle selection
   */
  const toggleSelectEntry = useCallback((entryId) => {
    setSelectedEntries((prev) =>
      prev.includes(entryId)
        ? prev.filter((id) => id !== entryId)
        : [...prev, entryId]
    );
  }, []);

  /**
   * Select/deselect all entries
   * @param {boolean} selectAll - Whether to select all or deselect all
   */
  const toggleSelectAll = useCallback((selectAll) => {
    if (selectAll) {
      setSelectedEntries(entries.map((e) => e.id));
    } else {
      setSelectedEntries([]);
    }
  }, [entries]);

  /**
   * Bulk delete multiple selected entries
   * @returns {Promise<void>}
   */
  const bulkDelete = useCallback(async () => {
    if (!user || selectedEntries.length === 0) return;

    const mutationId = `bulk-delete-${Date.now()}`;
    const entriesToDelete = entries.filter((e) => selectedEntries.includes(e.id));

    try {
      // Optimistic update
      setEntries((prev) => prev.filter((e) => !selectedEntries.includes(e.id)));
      setSelectedEntries([]);

      // Perform mutation with error tracking
      await withErrorTracking(
        mutationId,
        () => bulkDeleteEntries(user.uid, selectedEntries),
        () => bulkDeleteEntries(user.uid, selectedEntries)
      );
    } catch (error) {
      // Revert optimistic update on error
      setEntries((prev) => {
        const restored = [...prev, ...entriesToDelete];
        return restored.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });
      throw error;
    }
  }, [user, entries, selectedEntries, withErrorTracking]);

  /**
   * Bulk archive multiple selected entries
   * @returns {Promise<void>}
   */
  const bulkArchive = useCallback(async () => {
    if (!user || selectedEntries.length === 0) return;

    const mutationId = `bulk-archive-${Date.now()}`;
    const entriesToArchive = entries.filter((e) => selectedEntries.includes(e.id));

    try {
      // Optimistic update
      setEntries((prev) => prev.filter((e) => !selectedEntries.includes(e.id)));
      setArchivedEntries((prev) => [...prev, ...entriesToArchive]);
      setSelectedEntries([]);

      // Perform mutation with error tracking
      const entriesToArchiveFormatted = entriesToArchive.map((e) => ({
        id: e.id,
        data: e
      }));

      await withErrorTracking(
        mutationId,
        () => bulkArchiveEntries(user.uid, entriesToArchiveFormatted),
        () => bulkArchiveEntries(user.uid, entriesToArchiveFormatted)
      );
    } catch (error) {
      // Revert optimistic update on error
      setEntries((prev) => {
        const restored = [...prev, ...entriesToArchive];
        return restored.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });
      setArchivedEntries((prev) =>
        prev.filter((e) => !entriesToArchive.map((a) => a.id).includes(e.id))
      );
      throw error;
    }
  }, [user, entries, selectedEntries, withErrorTracking]);

  /**
   * Archive a single entry
   * @param {string} entryId - Entry ID to archive
   */
  const archiveEntryFn = useCallback(async (entryId) => {
    if (!user) throw new Error('No user authenticated');

    const entry = entries.find((e) => e.id === entryId);
    if (!entry) throw new Error('Entry not found');

    const mutationId = `archive-${entryId}`;

    try {
      // Optimistic update
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
      setArchivedEntries((prev) => [...prev, entry]);

      // Perform mutation
      await withErrorTracking(
        mutationId,
        () => import('../firebase/firestore').then((m) => m.archiveEntry(user.uid, entryId, entry)),
        () => import('../firebase/firestore').then((m) => m.archiveEntry(user.uid, entryId, entry))
      );
    } catch (error) {
      // Revert optimistic update
      setEntries((prev) => {
        const restored = [...prev, entry];
        return restored.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });
      setArchivedEntries((prev) => prev.filter((e) => e.id !== entryId));
      throw error;
    }
  }, [user, entries, withErrorTracking]);

  /**
   * Restore an archived entry
   * @param {string} entryId - Entry ID to restore
   */
  const restoreArchivedEntry = useCallback(async (entryId) => {
    if (!user) throw new Error('No user authenticated');

    const entry = archivedEntries.find((e) => e.id === entryId);
    if (!entry) throw new Error('Archived entry not found');

    const mutationId = `restore-${entryId}`;

    try {
      // Optimistic update
      setArchivedEntries((prev) => prev.filter((e) => e.id !== entryId));
      setEntries((prev) => {
        const restored = [...prev, entry];
        return restored.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });

      // Perform mutation
      await withErrorTracking(
        mutationId,
        () => import('../firebase/firestore').then((m) => m.restoreEntry(user.uid, entryId, entry)),
        () => import('../firebase/firestore').then((m) => m.restoreEntry(user.uid, entryId, entry))
      );
    } catch (error) {
      // Revert optimistic update
      setArchivedEntries((prev) => [...prev, entry]);
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
      throw error;
    }
  }, [user, archivedEntries, withErrorTracking]);

  /**
   * Toggle privacy status of an entry
   * @param {string} entryId - Entry ID to toggle privacy
   */
  const togglePrivacy = useCallback(async (entryId) => {
    if (!user) throw new Error('No user authenticated');

    const entry = entries.find(e => e.id === entryId);
    if (!entry) throw new Error('Entry not found');

    const newPrivacyStatus = !entry.isPrivate;
    const mutationId = `privacy-${entryId}`;

    try {
      // Optimistic update
      setEntries((prev) => prev.map((e) =>
        e.id === entryId ? { ...e, isPrivate: newPrivacyStatus } : e
      ));

      // Perform mutation with error tracking
      await withErrorTracking(
        mutationId,
        () => toggleEntryPrivacy(user.uid, entryId, newPrivacyStatus),
        () => toggleEntryPrivacy(user.uid, entryId, newPrivacyStatus)
      );
    } catch (error) {
      // Revert optimistic update on error
      setEntries((prev) => prev.map((e) =>
        e.id === entryId ? { ...e, isPrivate: entry.isPrivate } : e
      ));
      throw error;
    }
  }, [user, entries, withErrorTracking]);

  // Load entries when user changes
  useEffect(() => {
    loadEntries({ reset: true });
  }, [loadEntries]);

  return {
    entries,
    loading,
    loadingMore,
    hasMoreEntries,
    submitting,
    error,
    failedMutations,
    loadEntries,
    loadMoreEntries,
    loadAllEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    deleteEntryWithUndo,
    restoreEntry,
    retryMutation,
    togglePin,
    calculateStreak,
    getPlantInsights,
    getEntriesByDate,
    formatEntryDate,
    getMoodGarden,
    selectedEntries,
    archivedEntries,
    toggleSelectEntry,
    toggleSelectAll,
    bulkDelete,
    bulkArchive,
    archiveEntryFn,
    restoreArchivedEntry,
    togglePrivacy
  };
};