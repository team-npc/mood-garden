/**
 * Wellness Insights and Trend Analysis Utilities
 */

/**
 * Analyze mood trends over time
 * @param {Array} entries - Journal entries
 * @param {number} daysBack - Number of days to analyze (default 30)
 * @returns {Object} Trend analysis
 */
export const analyzeMoodTrends = (entries, daysBack = 30) => {
  const now = new Date();
  const then = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  
  // Filter entries from the specified period
  const periodEntries = entries.filter(entry => {
    const entryDate = new Date(entry.createdAt);
    return entryDate >= then && entryDate <= now;
  });

  if (periodEntries.length === 0) {
    return {
      totalEntries: 0,
      moodCounts: {},
      dominantMood: null,
      moodVariety: 0,
      trend: 'insufficient-data',
      moodDistribution: []
    };
  }

  // Count moods
  const moodCounts = {};
  periodEntries.forEach(entry => {
    if (entry.mood) {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    }
  });

  // Calculate statistics
  const moods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
  const dominantMood = moods[0]?.[0] || null;
  const moodVariety = Object.keys(moodCounts).length;
  const totalWithMood = Object.values(moodCounts).reduce((a, b) => a + b, 0);

  // Determine trend
  let trend = 'stable';
  if (totalWithMood > 0) {
    const dominantCount = moodCounts[dominantMood] || 0;
    const dominantPercentage = (dominantCount / totalWithMood) * 100;
    
    if (dominantPercentage > 60) {
      // Check if dominant mood is positive or negative
      const positiveEmojis = ['😊', '🥰', '😄', '😌', '✨', '🌟', '😍'];
      const negativeEmojis = ['😢', '😢', '😡', '😰', '😫', '😔'];
      
      if (positiveEmojis.includes(dominantMood)) {
        trend = 'positive-dominated';
      } else if (negativeEmojis.includes(dominantMood)) {
        trend = 'negative-dominated';
      }
    } else if (moodVariety > 5) {
      trend = 'varied';
    }
  }

  // Create mood distribution array
  const moodDistribution = moods.slice(0, 5).map(([mood, count]) => ({
    mood,
    count,
    percentage: ((count / totalWithMood) * 100).toFixed(1)
  }));

  return {
    totalEntries: periodEntries.length,
   moodCounts,
    dominantMood,
    moodVariety,
    trend,
    moodDistribution
  };
};

/**
 * Get mood pattern insights
 * @param {Array} entries - Journal entries
 * @returns {Object} Pattern insights
 */
export const getMoodPatterns = (entries) => {
  if (entries.length < 3) {
    return {
      hasPattern: false,
      insights: [],
      recommendations: []
    };
  }

  const insights = [];
  const recommendations = [];
  const moods = entries.filter(e => e.mood);

  if (moods.length === 0) {
    return { hasPattern: false, insights, recommendations };
  }

  // Check for frequent negative moods
  const negativeEmojis = ['😢', '😡', '😰', '😫', '😔'];
  const negativeCount = moods.filter(e => negativeEmojis.includes(e.mood)).length;
  const negativePercentage = (negativeCount / moods.length) * 100;

  if (negativePercentage > 50) {
    insights.push('You\'ve been experiencing more intense emotions lately.');
    recommendations.push('Consider practicing grounding techniques or reaching out to someone you trust.');
  }

  // Check for mood streaks
  let currentMood = null;
  let moodStreak = 0;
  let maxStreak = 0;
  let maxStreakMood = null;

  entries.slice(-7).forEach(entry => {
    if (!entry.mood) return;
    
    if (entry.mood === currentMood) {
      moodStreak++;
    } else {
      if (moodStreak > maxStreak) {
        maxStreak = moodStreak;
        maxStreakMood = currentMood;
      }
      currentMood = entry.mood;
      moodStreak = 1;
    }
  });

  if (maxStreak >= 3) {
    insights.push(`You've been feeling ${maxStreakMood} consistently in recent entries.`);
    recommendations.push('Notice any triggers or patterns that might be influencing this mood?');
  }

  return {
    hasPattern: insights.length > 0,
    insights,
    recommendations
  };
};

/**
 * Get entry recommendations based on moods
 * @param {Array} entries - Journal entries
 * @param {number} daysBack - Days to check (default 30)
 * @returns {Object} Recommendations
 */
export const getEntryRecommendations = (entries, daysBack = 30) => {
  const now = new Date();
  const then = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  
  const recentEntries = entries.filter(entry => {
    const entryDate = new Date(entry.createdAt);
    return entryDate >= then && entryDate <= now;
  });

  const moodSet = new Set(recentEntries.filter(e => e.mood).map(e => e.mood));
  
  // All possible moods
  const allMoods = ['😊', '😢', '😡', '😰', '😌', '🥰', '😍', '😄', '✨', '🌟'];
  
  // Find moods not mentioned recently
  const missingMoods = allMoods.filter(m => !moodSet.has(m));

  return {
    hasMissingMoods: missingMoods.length > 0,
    missingMoods: missingMoods.slice(0, 3),
    lastMoodsDiversityScore: (moodSet.size / allMoods.length) * 100
  };
};

/**
 * Generate wellness summary
 * @param {Array} entries - Journal entries
 * @returns {Object} Wellness summary
 */
export const generateWellnessSummary = (entries) => {
  const trends = analyzeMoodTrends(entries, 30);
  const patterns = getMoodPatterns(entries);
  const recommendations = getEntryRecommendations(entries, 30);

  let wellnessScore = 50;
  let wellnessStatus = 'balanced';

  // Adjust based on trends
  if (trends.trend === 'positive-dominated') {
    wellnessScore += 20;
    wellnessStatus = 'thriving';
  } else if (trends.trend === 'negative-dominated') {
    wellnessScore -= 20;
    wellnessStatus = 'struggling';
  } else if (trends.trend === 'varied') {
    wellnessScore += 10;
    wellnessStatus = 'exploring';
  }

  // Adjust based on entry frequency
  const entriesPerWeek = entries.length / Math.max(1, Math.ceil((Date.now() - new Date(entries[entries.length - 1]?.createdAt)?.getTime() || Date.now()) / (7 * 24 * 60 * 60 * 1000)));
  
  if (entriesPerWeek < 2) {
    wellnessScore -= 10;
  } else if (entriesPerWeek > 5) {
    wellnessScore += 10;
  }

  // Cap score between 0 and 100
  wellnessScore = Math.max(0, Math.min(100, wellnessScore));

  return {
    score: wellnessScore,
    status: wellnessStatus,
    trends,
    patterns,
    recommendations,
    message: getWellnessMessage(wellnessStatus, wellnessScore)
  };
};

/**
 * Get personalized wellness message
 */
const getWellnessMessage = (status, score) => {
  const messages = {
    thriving: [
      'You\'re doing wonderfully! Keep nurturing your emotional growth.',
      'Your positive energy is beautiful. Keep journaling this journey.',
      'You\'re in a great place. Celebrate these feelings!'
    ],
    struggling: [
      'It seems like you\'re going through a tough time. Remember to be kind to yourself.',
      'Your feelings are valid. Consider reaching out for support if you need it.',
      'Difficult emotions are temporary. This too shall pass.'
    ],
    exploring: [
      'You\'re experiencing a rich emotional landscape. That\'s growth!',
      'Your varied emotions show depth. Keep exploring your feelings.',
      'You\'re on an interesting emotional journey. Keep going!'
    ],
    balanced: [
      'You\'re maintaining a healthy emotional balance.',
      'Your emotions are flowing naturally. That\'s wonderful.',
      'You\'re in a good place. Keep this momentum going.'
    ]
  };

  const messageList = messages[status] || messages.balanced;
  return messageList[Math.floor(Math.random() * messageList.length)];
};
