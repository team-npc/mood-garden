/**
 * Time Management Utilities
 * Helper functions for time-based calculations and updates
 */

/**
 * Calculate the number of days between two dates
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date (defaults to now)
 * @returns {number} Number of days between dates
 */
export const daysBetween = (date1, date2 = new Date()) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  // Reset time to start of day for accurate day calculation
  firstDate.setHours(0, 0, 0, 0);
  secondDate.setHours(0, 0, 0, 0);
  
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

/**
 * Check if two dates are on the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} Whether dates are on the same day
 */
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

/**
 * Check if a date is yesterday
 * @param {Date} date - Date to check
 * @returns {boolean} Whether date is yesterday
 */
export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
};

/**
 * Check if a date is today
 * @param {Date} date - Date to check
 * @returns {boolean} Whether date is today
 */
export const isToday = (date) => {
  return isSameDay(date, new Date());
};

/**
 * Get streak count from an array of dates
 * @param {Array<Date>} dates - Array of dates (should be sorted desc)
 * @returns {number} Current streak count
 */
export const calculateStreak = (dates) => {
  if (!dates || dates.length === 0) return 0;
  
  const sortedDates = dates
    .map(date => new Date(date))
    .sort((a, b) => b - a); // Most recent first
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const date of sortedDates) {
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);
    
    const dayDiff = daysBetween(entryDate, currentDate);
    
    if (dayDiff === streak) {
      // Consecutive day
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (dayDiff > streak) {
      // Gap in streak
      break;
    }
    // If dayDiff < streak, it's a duplicate day, continue
  }
  
  return streak;
};

/**
 * Calculate plant health based on time since last entry
 * @param {Date} lastEntryDate - Date of last journal entry
 * @param {number} currentHealth - Current plant health (0-100)
 * @returns {Object} Updated health info
 */
export const calculatePlantHealth = (lastEntryDate, currentHealth = 100) => {
  if (!lastEntryDate) {
    return {
      health: currentHealth,
      status: 'unknown',
      daysSinceEntry: 0
    };
  }
  
  const daysSince = daysBetween(lastEntryDate);
  let newHealth = currentHealth;
  let status = 'healthy';
  
  if (daysSince === 0) {
    // Entry today - boost health
    newHealth = Math.min(100, currentHealth + 5);
    status = 'healthy';
  } else if (daysSince === 1) {
    // One day - maintain health
    status = 'healthy';
  } else if (daysSince === 2) {
    // Two days - slight decline
    newHealth = Math.max(0, currentHealth - 5);
    status = 'slightly_wilting';
  } else if (daysSince >= 3 && daysSince < 7) {
    // 3-6 days - moderate decline
    const decline = (daysSince - 2) * 8;
    newHealth = Math.max(0, currentHealth - decline);
    status = 'wilting';
  } else if (daysSince >= 7) {
    // 7+ days - significant decline
    const decline = 30 + ((daysSince - 7) * 5);
    newHealth = Math.max(0, currentHealth - decline);
    status = 'severely_wilting';
  }
  
  return {
    health: Math.round(newHealth),
    status,
    daysSinceEntry: daysSince
  };
};

/**
 * Determine if it's time for a plant stage upgrade
 * @param {Object} plantData - Current plant data
 * @returns {string|null} New stage if upgrade available
 */
export const checkForStageUpgrade = (plantData) => {
  if (!plantData) return null;
  
  const { stage, metadata, currentStreak, totalEntries } = plantData;
  const growthPoints = metadata?.growthPoints || 0;
  
  const stageRequirements = {
    seed: { points: 1, entries: 1 },
    sprout: { points: 3, entries: 3, streak: 2 },
    plant: { points: 7, entries: 7, streak: 3 },
    blooming: { points: 15, entries: 15, streak: 5 },
    tree: { points: 25, entries: 25, streak: 7 },
    fruitingTree: { points: 40, entries: 40, streak: 10 }
  };
  
  const stages = Object.keys(stageRequirements);
  const currentIndex = stages.indexOf(stage);
  
  if (currentIndex === -1 || currentIndex === stages.length - 1) {
    return null; // Unknown stage or already at max
  }
  
  // Check next stage requirements
  for (let i = currentIndex + 1; i < stages.length; i++) {
    const nextStage = stages[i];
    const requirements = stageRequirements[nextStage];
    
    const meetsRequirements = 
      growthPoints >= requirements.points &&
      totalEntries >= requirements.entries &&
      (!requirements.streak || currentStreak >= requirements.streak);
    
    if (meetsRequirements) {
      return nextStage;
    } else {
      break; // Can't skip stages
    }
  }
  
  return null;
};

/**
 * Format a date for display in the app
 * @param {Date} date - Date to format
 * @param {string} style - Format style ('relative', 'short', 'long')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, style = 'relative') => {
  if (!date) return '';
  
  const now = new Date();
  const inputDate = new Date(date);
  
  if (style === 'relative') {
    if (isToday(inputDate)) {
      return 'Today';
    } else if (isYesterday(inputDate)) {
      return 'Yesterday';
    } else {
      const days = daysBetween(inputDate, now);
      if (days < 7) {
        return `${days} day${days === 1 ? '' : 's'} ago`;
      } else if (days < 30) {
        const weeks = Math.floor(days / 7);
        return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
      } else {
        return inputDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: inputDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
    }
  } else if (style === 'short') {
    return inputDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  } else if (style === 'long') {
    return inputDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  return inputDate.toLocaleDateString();
};

/**
 * Get next reminder time based on user preferences
 * @param {string} preferredTime - Preferred reminder time (HH:MM format)
 * @returns {Date} Next reminder date
 */
export const getNextReminderTime = (preferredTime = '20:00') => {
  const [hours, minutes] = preferredTime.split(':').map(Number);
  const now = new Date();
  const reminder = new Date();
  
  reminder.setHours(hours, minutes, 0, 0);
  
  // If the time has passed today, set for tomorrow
  if (reminder <= now) {
    reminder.setDate(reminder.getDate() + 1);
  }
  
  return reminder;
};

/**
 * Check if user needs a gentle nudge to journal
 * @param {Date} lastEntryDate - Date of last entry
 * @param {Object} userPreferences - User notification preferences
 * @returns {Object|null} Nudge information or null
 */
export const checkForNudge = (lastEntryDate, userPreferences = {}) => {
  if (!lastEntryDate || !userPreferences.notifications) {
    return null;
  }
  
  const daysSince = daysBetween(lastEntryDate);
  const reminderTime = userPreferences.reminderTime || '20:00';
  const now = new Date();
  const nextReminder = getNextReminderTime(reminderTime);
  
  // Only show nudges after reminder time
  const [hours] = reminderTime.split(':').map(Number);
  if (now.getHours() < hours) {
    return null;
  }
  
  if (daysSince >= 1) {
    return {
      type: daysSince === 1 ? 'gentle' : daysSince < 3 ? 'reminder' : 'urgent',
      daysSince,
      message: getNudgeMessage(daysSince)
    };
  }
  
  return null;
};

/**
 * Get nudge message based on days since last entry
 * @param {number} days - Days since last entry
 * @returns {string} Nudge message
 */
const getNudgeMessage = (days) => {
  if (days === 1) {
    return "Your garden misses your thoughts. Even a few words can brighten its day.";
  } else if (days === 2) {
    return "Two days of quiet. Your plant is patiently waiting for your return.";
  } else if (days >= 3 && days < 7) {
    return "Your mindful garden needs some attention. A moment of reflection will help it flourish.";
  } else {
    return "Every garden needs care to thrive. Your plant believes in your return.";
  }
};