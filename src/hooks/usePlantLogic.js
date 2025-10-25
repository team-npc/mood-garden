/**
 * Plant Logic Hook
 * Manages plant growth, health, and time-based updates
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserPlant, checkPlantHealth } from '../firebase/firestore';

/**
 * Custom hook for managing plant logic and state
 * @returns {Object} Plant state and management functions
 */
export const usePlantLogic = () => {
  const { user } = useAuth();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load plant data from Firestore
   */
  const loadPlant = useCallback(async () => {
    if (!user) {
      setPlant(null);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const plantData = await getUserPlant(user.uid);
      setPlant(plantData);
    } catch (error) {
      console.error('Error loading plant:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Check and update plant health based on inactivity
   */
  const updatePlantHealth = useCallback(async () => {
    if (!user || !plant) return;

    try {
      const updatedPlant = await checkPlantHealth(user.uid);
      setPlant(updatedPlant);
    } catch (error) {
      console.error('Error updating plant health:', error);
      setError(error.message);
    }
  }, [user, plant]);

  /**
   * Get plant visual state based on health and stage
   * @returns {string} Visual state identifier
   */
  const getPlantVisualState = useCallback(() => {
    if (!plant) return 'loading';

    const { health, metadata } = plant;
    const isWilting = metadata?.wiltingStarted || false;

    if (health <= 20) return 'dead';
    if (health <= 50 || isWilting) return 'wilting';
    return 'healthy';
  }, [plant]);

  /**
   * Get encouraging messages based on plant state
   * @returns {Object} Message object with title and text
   */
  const getEncouragementMessage = useCallback(() => {
    if (!plant) return null;

    const { stage, currentStreak, daysSinceLastEntry, health } = plant;
    const visualState = getPlantVisualState();

    // Messages for different states
    const messages = {
      healthy: {
        seed: {
          title: "Your journey begins",
          text: "A tiny seed holds infinite potential. Keep nurturing with your words."
        },
        sprout: {
          title: "Growth emerges",
          text: "Your thoughts are taking root. Each entry strengthens your foundation."
        },
        plant: {
          title: "Steady progress",
          text: "Your words have nourished this growth. The leaves reach toward light."
        },
        blooming: {
          title: "Beauty unfolds",
          text: "Your consistent care brings forth flowers. Your mind garden flourishes."
        },
        tree: {
          title: "Wisdom takes form",
          text: "Strong roots, reaching branches. Your reflection has grown into wisdom."
        },
        fruitingTree: {
          title: "Abundance flows",
          text: "Your dedication bears fruit. This garden reflects your inner growth."
        }
      },
      wilting: {
        default: {
          title: "Your garden awaits",
          text: daysSinceLastEntry <= 5 
            ? "A few gentle words can revive what's fading. Your plant remembers your care."
            : "Even the strongest gardens need tending. A moment of reflection can restore vitality."
        }
      },
      dead: {
        default: {
          title: "New beginnings",
          text: "Every ending is a chance to start anew. Plant fresh seeds with your next entry."
        }
      }
    };

    if (visualState === 'healthy') {
      return messages.healthy[stage] || messages.healthy.seed;
    } else {
      return messages[visualState].default;
    }
  }, [plant, getPlantVisualState]);

  /**
   * Get streak-based encouragement
   * @returns {string} Streak message
   */
  const getStreakMessage = useCallback(() => {
    if (!plant) return '';

    const { currentStreak } = plant;

    if (currentStreak >= 10) return `🌟 ${currentStreak} days of mindful growth!`;
    if (currentStreak >= 7) return `✨ Week-long journey of reflection`;
    if (currentStreak >= 3) return `🌱 Building momentum with ${currentStreak} days`;
    if (currentStreak >= 1) return `🌿 Growing stronger each day`;
    
    return '';
  }, [plant]);

  /**
   * Calculate days until next stage
   * @returns {number|null} Days until next stage
   */
  const getDaysUntilNextStage = useCallback(() => {
    if (!plant) return null;

    const { stage, metadata } = plant;
    const growthPoints = metadata?.growthPoints || 0;

    const stageRequirements = {
      seed: { points: 1, streak: 1 },
      sprout: { points: 3, streak: 2 },
      plant: { points: 7, streak: 3 },
      blooming: { points: 15, streak: 5 },
      tree: { points: 25, streak: 7 },
      fruitingTree: { points: 40, streak: 10 }
    };

    const stages = Object.keys(stageRequirements);
    const currentIndex = stages.indexOf(stage);
    
    if (currentIndex === -1 || currentIndex === stages.length - 1) return null;

    const nextStage = stages[currentIndex + 1];
    const required = stageRequirements[nextStage];
    
    return Math.max(0, required.points - growthPoints);
  }, [plant]);

  /**
   * Get plant stage progress percentage
   * @returns {number} Progress percentage (0-100)
   */
  const getStageProgress = useCallback(() => {
    if (!plant) return 0;

    const { stage, metadata } = plant;
    const growthPoints = metadata?.growthPoints || 0;

    const stageRequirements = {
      seed: { points: 1 },
      sprout: { points: 3 },
      plant: { points: 7 },
      blooming: { points: 15 },
      tree: { points: 25 },
      fruitingTree: { points: 40 }
    };

    const stages = Object.keys(stageRequirements);
    const currentIndex = stages.indexOf(stage);
    
    if (currentIndex === -1) return 0;
    if (currentIndex === stages.length - 1) return 100;

    const currentPoints = stageRequirements[stage].points;
    const nextStage = stages[currentIndex + 1];
    const nextPoints = stageRequirements[nextStage].points;

    const progress = ((growthPoints - currentPoints) / (nextPoints - currentPoints)) * 100;
    return Math.max(0, Math.min(100, progress));
  }, [plant]);

  // Load plant data when user changes
  useEffect(() => {
    loadPlant();
  }, [loadPlant]);

  // Set up periodic health checks
  useEffect(() => {
    if (!user || !plant) return;

    // Check plant health every 5 minutes
    const interval = setInterval(updatePlantHealth, 5 * 60 * 1000);

    // Initial health check after 5 seconds
    const timeout = setTimeout(updatePlantHealth, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [updatePlantHealth, user, plant]);

  return {
    plant,
    loading,
    error,
    loadPlant,
    updatePlantHealth,
    getPlantVisualState,
    getEncouragementMessage,
    getStreakMessage,
    getDaysUntilNextStage,
    getStageProgress
  };
};