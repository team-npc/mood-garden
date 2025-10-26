/**
 * Firestore database utilities
 * Handles journal entries, plant data, and user data operations
 */

import { 
  collection,
  doc,
  addDoc,
  updateDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

/**
 * Add a new journal entry for a user
 * @param {string} uid - User ID
 * @param {string} content - Journal entry content
 * @param {string} mood - Optional mood/emoji
 * @returns {Promise<string>} Entry ID
 */
export const addJournalEntry = async (uid, content, mood = null) => {
  try {
    console.log('🔄 Starting journal entry save for user:', uid);
    console.log('📝 Entry content length:', content.length);
    console.log('😊 Mood:', mood);
    
    const entriesRef = collection(db, 'users', uid, 'entries');
    console.log('📂 Collection reference created');
    
    const entryData = {
      content: content.trim(),
      mood,
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
 * @param {number} limitCount - Number of entries to fetch
 * @returns {Promise<Array>} Array of journal entries
 */
export const getJournalEntries = async (uid, limitCount = 20) => {
  try {
    const entriesRef = collection(db, 'users', uid, 'entries');
    const q = query(entriesRef, orderBy('createdAt', 'desc'), limit(limitCount));
    
    const querySnapshot = await getDocs(q);
    const entries = [];
    
    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      });
    });
    
    return entries;
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
    
    let updateData = {
      daysSinceLastEntry,
      updatedAt: serverTimestamp()
    };
    
    // Apply wilting logic
    if (daysSinceLastEntry >= 3) {
      const healthDecrease = Math.min(50, (daysSinceLastEntry - 2) * 8);
      const newHealth = Math.max(0, currentPlant.health - healthDecrease);
      
      updateData = {
        ...updateData,
        health: newHealth,
        currentStreak: 0, // Reset streak after 3+ days
        metadata: {
          ...currentPlant.metadata,
          wiltingStarted: true,
          lastGrowthCheck: serverTimestamp()
        }
      };
      
      // If plant is severely neglected (7+ days), remove some rewards
      if (daysSinceLastEntry >= 7) {
        updateData.flowers = currentPlant.flowers?.slice(0, -1) || [];
        updateData.specialEffects = [];
      }
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