/**
 * Firestore database utilities
 * Handles journal entries, plant data, and user data operations
 */

import { 
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  writeBatch,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

const DEFAULT_ENTRY_PAGE_SIZE = 20;

const normalizeTags = (tags = []) => {
  return [...new Set(
    tags
      .map((tag) => String(tag || '').trim().toLowerCase())
      .filter(Boolean)
  )].slice(0, 8);
};

/**
 * Add a new journal entry for a user
 * @param {string} uid - User ID
 * @param {string} content - Journal entry content
 * @param {string} mood - Optional mood/emoji
 * @param {Array<string>} tags - Optional tags
 * @returns {Promise<string>} Entry ID
 */
export const addJournalEntry = async (uid, content, mood = null, tags = []) => {
  try {
    console.log('🔄 Starting journal entry save for user:', uid);
    console.log('📝 Entry content length:', content.length);
    console.log('😊 Mood:', mood);
    
    const entriesRef = collection(db, 'users', uid, 'entries');
    console.log('📂 Collection reference created');
    
    const entryData = {
      content: content.trim(),
      mood,
      tags: normalizeTags(tags),
      createdAt: serverTimestamp(),
      wordCount: content.trim().split(/\s+/).length,
      characterCount: content.length
    };
    
    console.log('📋 Entry data prepared:', {
      wordCount: entryData.wordCount,
      characterCount: entryData.characterCount,
      mood: entryData.mood
    });
    
    const docRef = await addDoc(entriesRef, entryData);
    console.log('✅ Journal entry saved with ID:', docRef.id);
    
    // Update plant after adding entry
    console.log('🌱 Updating plant data...');
    await updatePlantAfterEntry(uid);
    console.log('✅ Plant data updated successfully');
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding journal entry:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      uid: uid,
      contentLength: content?.length
    });
    throw error;
  }
};

/**
 * Get user's journal entries
 * @param {string} uid - User ID
 * @param {Object|number} options - Query options or legacy limit number
 * @param {number} options.limitCount - Number of entries to fetch
 * @param {Date|Timestamp|null} options.startAfterDate - Cursor date for pagination
 * @returns {Promise<Object>} Paged journal entries and pagination metadata
 */
export const getJournalEntries = async (uid, options = {}) => {
  try {
    const normalizedOptions = typeof options === 'number'
      ? { limitCount: options, startAfterDate: null }
      : options;
    const limitCount = normalizedOptions.limitCount || DEFAULT_ENTRY_PAGE_SIZE;
    const startAfterDate = normalizedOptions.startAfterDate || null;

    const entriesRef = collection(db, 'users', uid, 'entries');
    const cursorTimestamp = startAfterDate
      ? (startAfterDate instanceof Date ? Timestamp.fromDate(startAfterDate) : startAfterDate)
      : null;
    const q = cursorTimestamp
      ? query(entriesRef, orderBy('createdAt', 'desc'), startAfter(cursorTimestamp), limit(limitCount))
      : query(entriesRef, orderBy('createdAt', 'desc'), limit(limitCount));
    
    const querySnapshot = await getDocs(q);
    const entries = [];
    
    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      });
    });
    
    return {
      entries,
      hasMore: entries.length === limitCount,
      lastVisible: entries.length > 0 ? entries[entries.length - 1].createdAt : null
    };
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    throw error;
  }
};

/**
 * Get user's plant data
 * @param {string} uid - User ID
 * @returns {Promise<Object>} Plant data
 */
export const getUserPlant = async (uid) => {
  try {
    const plantRef = doc(db, 'users', uid, 'plant', 'current');
    const plantSnap = await getDoc(plantRef);
    
    if (plantSnap.exists()) {
      const data = plantSnap.data();
      return {
        ...data,
        lastWatered: data.lastWatered?.toDate(),
        lastEntryDate: data.lastEntryDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        metadata: {
          ...data.metadata,
          lastGrowthCheck: data.metadata?.lastGrowthCheck?.toDate()
        }
      };
    } else {
      throw new Error('Plant data not found');
    }
  } catch (error) {
    console.error('Error fetching plant data:', error);
    throw error;
  }
};

/**
 * Update plant data after a journal entry
 * @param {string} uid - User ID
 * @returns {Promise<void>}
 */
export const updatePlantAfterEntry = async (uid) => {
  try {
    const plantRef = doc(db, 'users', uid, 'plant', 'current');
    const plantSnap = await getDoc(plantRef);
    
    if (!plantSnap.exists()) {
      throw new Error('Plant data not found');
    }
    
    const currentPlant = plantSnap.data();
    const now = new Date();
    const lastEntry = currentPlant.lastEntryDate?.toDate();
    
    // Calculate streak
    let newStreak = currentPlant.currentStreak || 0;
    const daysSinceLastEntry = lastEntry ? 
      Math.floor((now - lastEntry) / (1000 * 60 * 60 * 24)) : 0;
    
    if (!lastEntry || daysSinceLastEntry === 1) {
      newStreak += 1;
    } else if (daysSinceLastEntry === 0) {
      // Same day entry, don't reset streak but don't increment either
    } else {
      newStreak = 1; // Reset streak if gap > 1 day
    }
    
    // Calculate growth points and stage progression
    const growthPoints = (currentPlant.metadata?.growthPoints || 0) + 1;
    const currentStage = currentPlant.stage || 'seed';
    const newStage = calculateNewStage(currentStage, growthPoints, newStreak);
    
    // Generate rewards based on streak and stage
    const rewards = generateRewards(newStreak, newStage, currentStage);
    
    const updateData = {
      health: Math.min(100, (currentPlant.health || 0) + 10),
      lastEntryDate: serverTimestamp(),
      lastWatered: serverTimestamp(),
      daysSinceLastEntry: 0,
      totalEntries: (currentPlant.totalEntries || 0) + 1,
      currentStreak: newStreak,
      longestStreak: Math.max(currentPlant.longestStreak || 0, newStreak),
      stage: newStage,
      updatedAt: serverTimestamp(),
      metadata: {
        ...currentPlant.metadata,
        growthPoints,
        wiltingStarted: false,
        inactivityPenaltyApplied: 0,
        rewardsPrunedForInactivity: false,
        lastGrowthCheck: serverTimestamp()
      }
    };
    
    // Add rewards if any
    if (rewards.flowers.length > 0) {
      updateData.flowers = [...(currentPlant.flowers || []), ...rewards.flowers];
    }
    if (rewards.fruits.length > 0) {
      updateData.fruits = [...(currentPlant.fruits || []), ...rewards.fruits];
    }
    if (rewards.effects.length > 0) {
      updateData.specialEffects = [...(currentPlant.specialEffects || []), ...rewards.effects];
    }
    
    await updateDoc(plantRef, updateData);
  } catch (error) {
    console.error('Error updating plant after entry:', error);
    throw error;
  }
};

/**
 * Check and update plant health based on inactivity
 * @param {string} uid - User ID
 * @returns {Promise<Object>} Updated plant data
 */
export const checkPlantHealth = async (uid) => {
  try {
    const plantRef = doc(db, 'users', uid, 'plant', 'current');
    const plantSnap = await getDoc(plantRef);
    
    if (!plantSnap.exists()) {
      throw new Error('Plant data not found');
    }
    
    const currentPlant = plantSnap.data();
    const now = new Date();
    const lastEntry = currentPlant.lastEntryDate?.toDate();
    
    if (!lastEntry) return currentPlant;
    
    const daysSinceLastEntry = Math.floor((now - lastEntry) / (1000 * 60 * 60 * 24));
    const previouslyAppliedPenalty = currentPlant.metadata?.inactivityPenaltyApplied || 0;
    const expectedPenalty = daysSinceLastEntry >= 3
      ? Math.min(50, (daysSinceLastEntry - 2) * 8)
      : 0;
    const penaltyDelta = Math.max(0, expectedPenalty - previouslyAppliedPenalty);
    
    let updateData = {
      daysSinceLastEntry,
      updatedAt: serverTimestamp()
    };
    
    // Apply wilting logic
    if (daysSinceLastEntry >= 3) {
      const newHealth = Math.max(0, currentPlant.health - penaltyDelta);
      const hasPrunedRewards = currentPlant.metadata?.rewardsPrunedForInactivity || false;
      
      updateData = {
        ...updateData,
        health: newHealth,
        currentStreak: 0, // Reset streak after 3+ days
        metadata: {
          ...currentPlant.metadata,
          inactivityPenaltyApplied: expectedPenalty,
          wiltingStarted: true,
          lastGrowthCheck: serverTimestamp()
        }
      };
      
      // If plant is severely neglected (7+ days), remove some rewards once.
      if (daysSinceLastEntry >= 7 && !hasPrunedRewards) {
        updateData.flowers = currentPlant.flowers?.slice(0, -1) || [];
        updateData.specialEffects = [];
        updateData.metadata = {
          ...updateData.metadata,
          rewardsPrunedForInactivity: true
        };
      }
    } else if (previouslyAppliedPenalty !== 0 || currentPlant.metadata?.wiltingStarted) {
      updateData.metadata = {
        ...currentPlant.metadata,
        inactivityPenaltyApplied: 0,
        rewardsPrunedForInactivity: false,
        wiltingStarted: false,
        lastGrowthCheck: serverTimestamp()
      };
    }
    
    await updateDoc(plantRef, updateData);
    
    return { ...currentPlant, ...updateData };
  } catch (error) {
    console.error('Error checking plant health:', error);
    throw error;
  }
};

/**
 * Calculate new plant stage based on growth points and streak
 * @param {string} currentStage - Current plant stage
 * @param {number} growthPoints - Total growth points
 * @param {number} streak - Current streak
 * @returns {string} New plant stage
 */
const calculateNewStage = (currentStage, growthPoints, streak) => {
  const stages = ['seed', 'sprout', 'plant', 'blooming', 'tree', 'fruitingTree'];
  
  // Define growth requirements for each stage (cumulative)
  const requirements = {
    seed: { points: 0, streak: 0 },      // Starting stage
    sprout: { points: 3, streak: 2 },
    plant: { points: 7, streak: 3 },
    blooming: { points: 15, streak: 5 },
    tree: { points: 25, streak: 7 },
    fruitingTree: { points: 40, streak: 10 }
  };
  
  // Find the highest stage that meets requirements
  let newStage = 'seed';
  for (const stage of stages) {
    const req = requirements[stage];
    if (growthPoints >= req.points && streak >= req.streak) {
      newStage = stage;
    }
  }
  
  return newStage;
};

/**
 * Generate rewards based on streak and stage progression
 * @param {number} streak - Current streak
 * @param {string} newStage - New plant stage
 * @param {string} oldStage - Previous plant stage
 * @returns {Object} Rewards object
 */
const generateRewards = (streak, newStage, oldStage) => {
  const rewards = {
    flowers: [],
    fruits: [],
    effects: []
  };
  
  // Flower rewards for streak milestones
  if (streak > 0 && streak % 3 === 0) {
    const flowerTypes = ['cherry', 'daisy', 'rose', 'sunflower', 'tulip'];
    const flower = {
      type: flowerTypes[Math.floor(Math.random() * flowerTypes.length)],
      earnedAt: new Date(),
      streak: streak
    };
    rewards.flowers.push(flower);
  }
  
  // Fruit rewards for longer streaks
  if (streak > 0 && streak % 5 === 0 && newStage === 'fruitingTree') {
    const fruitTypes = ['apple', 'orange', 'pear', 'plum', 'cherry'];
    const fruit = {
      type: fruitTypes[Math.floor(Math.random() * fruitTypes.length)],
      earnedAt: new Date(),
      streak: streak
    };
    rewards.fruits.push(fruit);
  }
  
  // Special effects for stage progression
  if (newStage !== oldStage) {
    const effect = {
      type: 'glow',
      intensity: 'medium',
      duration: 3000, // 3 seconds
      earnedAt: new Date(),
      reason: `Grew to ${newStage} stage`
    };
    rewards.effects.push(effect);
  }
  
  return rewards;
};

/**
 * Recalculate plant stage based on current data
 * Call this function to fix plants that are stuck in wrong stage
 * @param {string} uid - User ID
 * @returns {Promise<string>} New stage
 */
export const recalculatePlantStage = async (uid) => {
  try {
    console.log('🔄 Recalculating plant stage for user:', uid);
    
    // Get plant data
    const plantRef = doc(db, 'users', uid, 'plant', 'current');
    const plantSnap = await getDoc(plantRef);
    
    let currentPlant;
    
    if (!plantSnap.exists()) {
      console.log('⚠️ Plant not found, creating new plant...');
      // Create a new plant document
      const newPlantData = {
        stage: 'seed',
        health: 100,
        lastWatered: serverTimestamp(),
        lastEntryDate: null,
        daysSinceLastEntry: 0,
        totalEntries: 0,
        currentStreak: 0,
        longestStreak: 0,
        flowers: [],
        fruits: [],
        specialEffects: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        metadata: {
          timeToNextStage: 1,
          growthPoints: 0,
          inactivityPenaltyApplied: 0,
          rewardsPrunedForInactivity: false,
          wiltingStarted: false,
          lastGrowthCheck: serverTimestamp()
        }
      };
      
      await setDoc(plantRef, newPlantData);
      currentPlant = newPlantData;
      console.log('✅ Plant created');
    } else {
      currentPlant = plantSnap.data();
      console.log('Current plant data:', currentPlant);
    }
    
    // Get all entries to calculate proper streak
    console.log('Fetching entries...');
    const entriesRef = collection(db, 'users', uid, 'entries');
    const entriesQuery = query(entriesRef, orderBy('createdAt', 'desc'));
    const entriesSnap = await getDocs(entriesQuery);
    
    console.log('Entries fetched:', entriesSnap.size);
    
    const totalEntries = entriesSnap.size;
    
    if (totalEntries === 0) {
      console.log('No entries found, keeping seed stage');
      return 'seed';
    }
    
    // Calculate current streak from entries
    let currentStreak = 0;
    let previousDate = null;
    const entries = [];
    
    entriesSnap.forEach((doc) => {
      const entry = doc.data();
      entries.push(entry);
      const entryDate = entry.createdAt?.toDate();
      
      if (!entryDate) {
        console.log('Entry without date:', doc.id);
        return;
      }
      
      const entryDay = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
      
      if (!previousDate) {
        // First entry (most recent)
        currentStreak = 1;
        previousDate = entryDay;
      } else {
        const daysDiff = Math.floor((previousDate - entryDay) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
          // Same day, don't change streak
        } else if (daysDiff === 1) {
          // Consecutive day
          currentStreak++;
          previousDate = entryDay;
        } else {
          // Streak broken, stop counting
          return;
        }
      }
    });
    
    console.log('Calculated from entries:', { 
      totalEntries,
      currentStreak,
      firstEntryDate: entries[0]?.createdAt?.toDate(),
      lastEntryDate: entries[entries.length - 1]?.createdAt?.toDate()
    });
    
    // Use totalEntries as growth points
    const growthPoints = totalEntries;
    
    console.log('Growth calculation:', { 
      currentStage: currentPlant.stage, 
      storedGrowthPoints: currentPlant.metadata?.growthPoints,
      storedStreak: currentPlant.currentStreak,
      calculatedGrowthPoints: growthPoints,
      calculatedStreak: currentStreak
    });
    
    // Recalculate stage
    const newStage = calculateNewStage(currentPlant.stage || 'seed', growthPoints, currentStreak);
    
    console.log('New stage calculated:', newStage);
    
    // Update plant with correct data
    console.log('Updating plant document...');
    await updateDoc(plantRef, {
      stage: newStage,
      totalEntries: totalEntries,
      currentStreak: currentStreak,
      longestStreak: Math.max(currentPlant.longestStreak || 0, currentStreak),
      lastEntryDate: entries[0]?.createdAt || serverTimestamp(),
      'metadata.growthPoints': growthPoints,
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Plant stage updated to:', newStage);
    
    return newStage;
  } catch (error) {
    console.error('❌ Error in recalculatePlantStage:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    throw error;
  }
};

/**
 * Delete all user data from Firestore
 * @param {string} uid - User ID
 * @returns {Promise<void>}
 */
export const deleteUserData = async (uid) => {
  try {
    const entriesRef = collection(db, 'users', uid, 'entries');
    const pageSize = 400;

    // Delete entries in chunks to stay under batch operation limits.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const snapshot = await getDocs(query(entriesRef, limit(pageSize)));
      if (snapshot.empty) {
        break;
      }

      const batch = writeBatch(db);
      snapshot.docs.forEach((entryDoc) => {
        batch.delete(entryDoc.ref);
      });
      await batch.commit();

      if (snapshot.size < pageSize) {
        break;
      }
    }

    const plantRef = doc(db, 'users', uid, 'plant', 'current');
    await deleteDoc(plantRef);

    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
};

/**
 * Update an existing journal entry
 * @param {string} uid - User ID
 * @param {string} entryId - Entry ID
 * @param {string} content - Updated content
 * @param {string|null} mood - Updated mood
 * @param {Array<string>} tags - Updated tags
 * @returns {Promise<void>}
 */
export const updateJournalEntry = async (uid, entryId, content, mood = null, tags = []) => {
  try {
    const entryRef = doc(db, 'users', uid, 'entries', entryId);
    await updateDoc(entryRef, {
      content: content.trim(),
      mood,
      tags: normalizeTags(tags),
      wordCount: content.trim().split(/\s+/).length,
      characterCount: content.length,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    throw error;
  }
};

/**
 * Delete a journal entry
 * @param {string} uid - User ID
 * @param {string} entryId - Entry ID
 * @returns {Promise<void>}
 */
export const deleteJournalEntry = async (uid, entryId) => {
  try {
    const entryRef = doc(db, 'users', uid, 'entries', entryId);
    await deleteDoc(entryRef);
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    throw error;
  }
};

/**
 * Toggle pin status of a journal entry (favorite/pin)
 * @param {string} uid - User ID
 * @param {string} entryId - Entry ID
 * @param {boolean} isPinned - New pin status
 * @returns {Promise<void>}
 */
export const toggleEntryPin = async (uid, entryId, isPinned) => {
  try {
    const entryRef = doc(db, 'users', uid, 'entries', entryId);
    await updateDoc(entryRef, {
      isPinned: isPinned,
      pinnedAt: isPinned ? serverTimestamp() : null
    });
  } catch (error) {
    console.error('Error toggling entry pin:', error);
    throw error;
  }
};

/**
 * Archive a journal entry (soft delete)
 * @param {string} uid - User ID
 * @param {string} entryId - Entry ID  
 * @param {Object} entryData - Full entry data to archive
 * @returns {Promise<void>}
 */
export const archiveEntry = async (uid, entryId, entryData) => {
  try {
    const batch = writeBatch(db);
    
    // Add to archived collection with archivedAt timestamp
    const archivedRef = doc(db, 'users', uid, 'archived', entryId);
    batch.set(archivedRef, {
      ...entryData,
      archivedAt: serverTimestamp()
    });
    
    // Delete from active entries
    const activeRef = doc(db, 'users', uid, 'entries', entryId);
    batch.delete(activeRef);
    
    await batch.commit();
  } catch (error) {
    console.error('Error archiving entry:', error);
    throw error;
  }
};

/**
 * Restore an archived entry
 * @param {string} uid - User ID
 * @param {string} entryId - Entry ID
 * @param {Object} entryData - Full archived entry data
 * @returns {Promise<void>}
 */
export const restoreEntry = async (uid, entryId, entryData) => {
  try {
    const batch = writeBatch(db);
    
    // Add back to entries collection (remove archivedAt field)
    const { archivedAt, ...activeData } = entryData;
    const activeRef = doc(db, 'users', uid, 'entries', entryId);
    batch.set(activeRef, activeData);
    
    // Delete from archived
    const archivedRef = doc(db, 'users', uid, 'archived', entryId);
    batch.delete(archivedRef);
    
    await batch.commit();
  } catch (error) {
    console.error('Error restoring entry:', error);
    throw error;
  }
};

/**
 * Bulk delete multiple entries
 * @param {string} uid - User ID
 * @param {Array<string>} entryIds - Array of entry IDs to delete
 * @returns {Promise<void>}
 */
export const bulkDeleteEntries = async (uid, entryIds) => {
  try {
    const batch = writeBatch(db);
    entryIds.forEach(entryId => {
      const entryRef = doc(db, 'users', uid, 'entries', entryId);
      batch.delete(entryRef);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error bulk deleting entries:', error);
    throw error;
  }
};

/**
 * Bulk archive multiple entries
 * @param {string} uid - User ID
 * @param {Array<Object>} entries - Array of {id, data} objects to archive
 * @returns {Promise<void>}
 */
export const bulkArchiveEntries = async (uid, entries) => {
  try {
    const batch = writeBatch(db);
    
    entries.forEach(({ id, data }) => {
      // Archive the entry
      const archivedRef = doc(db, 'users', uid, 'archived', id);
      batch.set(archivedRef, {
        ...data,
        archivedAt: serverTimestamp()
      });
      
      // Remove from active
      const activeRef = doc(db, 'users', uid, 'entries', id);
      batch.delete(activeRef);
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error bulk archiving entries:', error);
    throw error;
  }
};

/**
 * Toggle privacy status of a journal entry
 * @param {string} uid - User ID
 * @param {string} entryId - Entry ID
 * @param {boolean} isPrivate - New privacy status
 * @returns {Promise<void>}
 */
export const toggleEntryPrivacy = async (uid, entryId, isPrivate) => {
  try {
    const entryRef = doc(db, 'users', uid, 'entries', entryId);
    await updateDoc(entryRef, {
      isPrivate: isPrivate,
      privacyToggleAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error toggling entry privacy:', error);
    throw error;
  }
};