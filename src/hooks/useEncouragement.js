/**
 * Encouragement Messages Hook
 * Provides contextual, gentle feedback messages
 */

import { useMemo } from 'react';

/**
 * Hook for generating encouragement messages
 * @param {Object} plantData - Current plant data
 * @returns {Object} Encouragement utilities
 */
export const useEncouragement = (plantData) => {
  
  /**
   * Get daily affirmations based on plant state
   */
  const getDailyAffirmation = useMemo(() => {
    const affirmations = {
      healthy: [
        "Your thoughts are seeds of wisdom growing into beautiful insights.",
        "Each word you write nurtures the garden of your mind.",
        "Your reflection today adds another ring of growth to your inner tree.",
        "Like morning dew, your words refresh and revitalize your spirit.",
        "Your mindful practice is creating roots that will support you always."
      ],
      wilting: [
        "Even the strongest gardens have quiet seasons. Your return brings new life.",
        "A gentle word is all your garden needs to remember how to flourish.",
        "Your plant remembers your care and waits patiently for your return.",
        "Every master gardener knows that growth comes in cycles. Welcome back.",
        "The soil of your mind is still rich and ready for new seeds of thought."
      ],
      recovering: [
        "See how quickly life returns to your garden with just a little attention.",
        "Your plant is already perking up, grateful for your mindful presence.",
        "Like after rain, your garden shows signs of renewed vitality.",
        "Your consistency is breathing life back into every leaf and branch.",
        "The resilience of your garden mirrors the strength within you."
      ]
    };

    const state = plantData?.health > 60 ? 'healthy' : 
                  plantData?.health > 30 ? 'recovering' : 'wilting';
    
    const messages = affirmations[state];
    return messages[Math.floor(Math.random() * messages.length)];
  }, [plantData?.health]);

  /**
   * Get writing prompts based on current mood and plant state
   */
  const getWritingPrompts = useMemo(() => {
    const prompts = {
      beginner: [
        "What brought a smile to your face today?",
        "Describe a moment when you felt completely at peace.",
        "What are three things you're grateful for right now?",
        "How did you show kindness to yourself or others today?",
        "What's one thing you learned about yourself recently?"
      ],
      intermediate: [
        "What patterns in your thoughts have you noticed lately?",
        "How have you grown from a challenge you faced this week?",
        "What would you tell your past self from one year ago?",
        "Describe a time when you felt truly connected to something larger than yourself.",
        "What aspects of your life feel most aligned with your values?"
      ],
      advanced: [
        "How has your relationship with uncertainty evolved lately?",
        "What unconscious beliefs might be shaping your current experiences?",
        "In what ways do you sense your inner wisdom speaking to you?",
        "How do you balance accepting yourself as you are while growing?",
        "What patterns of thought serve your highest good, and which ones don't?"
      ]
    };

    const level = plantData?.totalEntries < 10 ? 'beginner' :
                  plantData?.totalEntries < 50 ? 'intermediate' : 'advanced';
    
    return prompts[level];
  }, [plantData?.totalEntries]);

  /**
   * Get gentle nudges based on time since last entry
   */
  const getGentleNudge = useMemo(() => {
    if (!plantData?.daysSinceLastEntry) return null;

    const days = plantData.daysSinceLastEntry;

    if (days === 1) {
      return {
        title: "Your garden misses you",
        message: "One day of rest is natural. Your plant is ready to grow with your next reflection.",
        urgency: "low"
      };
    } else if (days === 2) {
      return {
        title: "A gentle reminder",
        message: "Your mindful garden is patiently waiting. Even a few words can rekindle its vitality.",
        urgency: "medium"
      };
    } else if (days >= 3 && days < 7) {
      return {
        title: "Your plant needs tending",
        message: "The leaves are starting to droop, but with your return, they'll flourish again.",
        urgency: "medium"
      };
    } else if (days >= 7) {
      return {
        title: "New beginnings await",
        message: "Every master gardener knows: it's never too late to plant new seeds of reflection.",
        urgency: "high"
      };
    }

    return null;
  }, [plantData?.daysSinceLastEntry]);

  /**
   * Get achievement messages for milestones
   */
  const getAchievementMessage = (achievement) => {
    const messages = {
      firstEntry: {
        title: "Your journey begins! 🌱",
        message: "You've planted the first seed in your mindful garden. Watch it grow with each reflection."
      },
      threeStreak: {
        title: "Consistency blooms! 🌸",
        message: "Three days of reflection have earned you a beautiful flower. Your dedication is taking root."
      },
      weekStreak: {
        title: "Seven days of growth! 🌿",
        message: "A full week of mindful practice. Your inner garden is flourishing with wisdom."
      },
      firstFruit: {
        title: "Sweet rewards! 🍎",
        message: "Your consistent care has grown the first fruit of your labor. Taste the sweetness of dedication."
      },
      stageEvolution: {
        title: "Beautiful transformation! 🌳",
        message: `Your plant has evolved to the ${achievement.newStage} stage. Witness the power of gentle persistence.`
      },
      monthMilestone: {
        title: "A month of mindfulness! ✨",
        message: "Thirty days of reflection have created a garden of extraordinary beauty and depth."
      }
    };

    return messages[achievement.type] || {
      title: "Wonderful progress!",
      message: "Your mindful practice continues to create beautiful moments of growth."
    };
  };

  /**
   * Get seasonal encouragement based on current date
   */
  const getSeasonalMessage = () => {
    const now = new Date();
    const month = now.getMonth();
    
    if (month >= 2 && month <= 4) { // Spring
      return "Like spring's return, your words bring new life to dormant thoughts.";
    } else if (month >= 5 && month <= 7) { // Summer
      return "In this season of growth, your reflections bloom in the warm light of awareness.";
    } else if (month >= 8 && month <= 10) { // Fall
      return "As nature harvests its bounty, you gather the wisdom from your daily reflections.";
    } else { // Winter
      return "In winter's quiet, your inner garden grows strong roots of contemplation.";
    }
  };

  /**
   * Get motivational boost based on plant state and user history
   */
  const getMotivationalBoost = () => {
    if (!plantData) return null;

    const { currentStreak, longestStreak, health, stage } = plantData;

    if (currentStreak === 0 && longestStreak > 0) {
      return {
        type: "comeback",
        message: `You've done this before with a ${longestStreak}-day streak. Your garden remembers your care and is ready to flourish again.`
      };
    }

    if (currentStreak >= longestStreak && longestStreak > 0) {
      return {
        type: "record",
        message: `You're at your longest streak ever! Each day of reflection is uncharted territory in your growth.`
      };
    }

    if (health < 30) {
      return {
        type: "recovery",
        message: "Even the most beautiful gardens have seasons of rest. Your plant trusts in your return."
      };
    }

    if (stage === 'fruitingTree') {
      return {
        type: "mastery",
        message: "Your garden has reached its full potential, just as your practice has cultivated deep wisdom."
      };
    }

    return {
      type: "progress",
      message: "Every word you write is a vote for the person you're becoming."
    };
  };

  return {
    getDailyAffirmation,
    getWritingPrompts,
    getGentleNudge,
    getAchievementMessage,
    getSeasonalMessage,
    getMotivationalBoost
  };
};