/**
 * Plant Theme Colors Utility
 * Changes plant colors based on dominant weekly mood
 */

/**
 * Mood color schemes for plants
 * Each mood has primary, secondary, accent colors for the plant visualization
 */
export const MOOD_PLANT_COLORS = {
  '😊': { // Happy
    name: 'Happy Gold',
    primary: '#fbbf24',    // amber-400
    secondary: '#f59e0b',  // amber-500
    accent: '#fde68a',     // amber-200
    glow: '#fcd34d'        // amber-300
  },
  '😢': { // Sad
    name: 'Calm Blue',
    primary: '#60a5fa',    // blue-400
    secondary: '#3b82f6',  // blue-500
    accent: '#93c5fd',     // blue-300
    glow: '#bfdbfe'        // blue-200
  },
  '😤': { // Angry
    name: 'Fierce Red',
    primary: '#f87171',    // red-400
    secondary: '#ef4444',  // red-500
    accent: '#fca5a5',     // red-300
    glow: '#fecaca'        // red-200
  },
  '😴': { // Tired
    name: 'Soft Purple',
    primary: '#a78bfa',    // violet-400
    secondary: '#8b5cf6',  // violet-500
    accent: '#c4b5fd',     // violet-300
    glow: '#ddd6fe'        // violet-200
  },
  '😰': { // Anxious
    name: 'Nervous Orange',
    primary: '#fb923c',    // orange-400
    secondary: '#f97316',  // orange-500
    accent: '#fdba74',     // orange-300
    glow: '#fed7aa'        // orange-200
  },
  '😌': { // Calm
    name: 'Serene Teal',
    primary: '#2dd4bf',    // teal-400
    secondary: '#14b8a6',  // teal-500
    accent: '#5eead4',     // teal-300
    glow: '#99f6e4'        // teal-200
  },
  // Default (neutral/balanced/no dominant mood)
  'default': {
    name: 'Garden Green',
    primary: '#22c55e',    // green-500
    secondary: '#15803d',  // green-700
    accent: '#86efac',     // green-300
    glow: '#4ade80'        // green-400
  }
};

/**
 * Analyze entries to find the dominant mood for the week
 * @param {Array} entries - Array of journal entries
 * @returns {Object} Object with dominant mood and color scheme
 */
export const getDominantWeeklyMood = (entries = []) => {
  // Get entries from the last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weeklyEntries = entries.filter(entry => {
    const entryDate = entry.createdAt?.toDate?.() || new Date(entry.createdAt);
    return entryDate >= oneWeekAgo;
  });

  if (weeklyEntries.length === 0) {
    return {
      mood: null,
      colorScheme: MOOD_PLANT_COLORS['default'],
      entryCount: 0,
      moodBreakdown: {}
    };
  }

  // Count moods
  const moodCounts = {};
  weeklyEntries.forEach(entry => {
    const mood = entry.mood;
    if (mood) {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    }
  });

  // Find dominant mood
  let dominantMood = null;
  let maxCount = 0;
  
  for (const [mood, count] of Object.entries(moodCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantMood = mood;
    }
  }

  // Calculate percentage breakdown
  const total = weeklyEntries.length;
  const moodBreakdown = {};
  for (const [mood, count] of Object.entries(moodCounts)) {
    moodBreakdown[mood] = {
      count,
      percentage: Math.round((count / total) * 100)
    };
  }

  const colorScheme = MOOD_PLANT_COLORS[dominantMood] || MOOD_PLANT_COLORS['default'];

  return {
    mood: dominantMood,
    colorScheme,
    entryCount: weeklyEntries.length,
    moodBreakdown
  };
};

/**
 * Get themed plant colors that blend based on mood distribution
 * Uses weighted average of colors based on mood percentages
 * @param {Object} moodBreakdown - Mood counts and percentages
 * @returns {Object} Blended color scheme
 */
export const getBlendedPlantColors = (moodBreakdown) => {
  if (!moodBreakdown || Object.keys(moodBreakdown).length === 0) {
    return MOOD_PLANT_COLORS['default'];
  }

  // For simplicity, return the dominant mood's colors
  // Could implement actual color blending for more advanced theming
  let dominantMood = null;
  let maxPercentage = 0;
  
  for (const [mood, data] of Object.entries(moodBreakdown)) {
    if (data.percentage > maxPercentage) {
      maxPercentage = data.percentage;
      dominantMood = mood;
    }
  }

  return MOOD_PLANT_COLORS[dominantMood] || MOOD_PLANT_COLORS['default'];
};

/**
 * Get all available mood color options
 * @returns {Array} Array of mood color options with metadata
 */
export const getAllMoodColorOptions = () => {
  return Object.entries(MOOD_PLANT_COLORS)
    .filter(([key]) => key !== 'default')
    .map(([mood, colors]) => ({
      mood,
      name: colors.name,
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent
      }
    }));
};

/**
 * Convert hex color to RGB object
 * @param {string} hex - Hex color string
 * @returns {Object} RGB object with r, g, b values
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Convert RGB to hex color string
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color string
 */
export const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Get CSS custom properties for plant theme
 * @param {Object} colorScheme - Color scheme object
 * @returns {Object} CSS custom properties object
 */
export const getPlantThemeCSSVars = (colorScheme) => {
  return {
    '--plant-primary': colorScheme.primary,
    '--plant-secondary': colorScheme.secondary,
    '--plant-accent': colorScheme.accent,
    '--plant-glow': colorScheme.glow
  };
};
