/**
 * Journal Hook
 * Manages journal entries, form state, and data operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { addJournalEntry, getJournalEntries } from '../firebase/firestore';

/**
 * Custom hook for managing journal entries
 * @returns {Object} Journal state and management functions
 */
export const useJournal = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load journal entries from Firestore
   */
  const loadEntries = useCallback(async (limit = 20) => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const journalEntries = await getJournalEntries(user.uid, limit);
      setEntries(journalEntries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Add a new journal entry
   * @param {string} content - Entry content
   * @param {string} mood - Selected mood/emoji
   * @returns {Promise<string>} Entry ID
   */
  const addEntry = useCallback(async (content, mood = null) => {
    if (!user || !content.trim()) {
      const error = !user ? 'No user authenticated' : 'Content is required';
      throw new Error(error);
    }

    setSubmitting(true);
    try {
      const entryId = await addJournalEntry(user.uid, content, mood);
      
      // Add new entry to local state
      const newEntry = {
        id: entryId,
        content: content.trim(),
        mood,
        createdAt: new Date(),
        wordCount: content.trim().split(/\s+/).length,
        characterCount: content.length
      };
      
      setEntries(prev => [newEntry, ...prev]);
      return entryId;
    } catch (error) {
      console.error('Error adding journal entry:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [user]);

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

    return {
      plantMessage,
      encouragement,
      recentActivity: activityLevel,
      growthPhase,
      entriesCount: entries.length,
      hasRecentEntries: daysWithEntries > 0
    };
  }, [entries]);

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

  // Load entries when user changes
  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return {
    entries,
    loading,
    submitting,
    error,
    loadEntries,
    addEntry,
    getPlantInsights,
    getEntriesByDate,
    formatEntryDate,
    getMoodGarden
  };
};