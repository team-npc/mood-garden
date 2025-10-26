/**
 * ML Insights Hook
 * Analyzes journal entries and moods to provide personalized writing inspiration
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Sentiment Analysis using word matching algorithm
 */
const analyzeSentiment = (text) => {
  const positiveWords = ['happy', 'joy', 'love', 'grateful', 'excited', 'wonderful', 'amazing', 'blessed', 'peaceful', 'calm', 'great', 'beautiful', 'good', 'better', 'best', 'excellent', 'awesome', 'fantastic', 'brilliant', 'sunshine', 'smile', 'laugh'];
  const negativeWords = ['sad', 'angry', 'frustrated', 'upset', 'worried', 'anxious', 'stressed', 'terrible', 'awful', 'hate', 'pain', 'hurt', 'difficult', 'hard', 'struggle', 'tired', 'exhausted', 'alone', 'lonely', 'depressed'];
  const reflectiveWords = ['think', 'feel', 'wonder', 'realize', 'understand', 'learn', 'grow', 'reflect', 'consider', 'ponder', 'question', 'explore'];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  let reflectiveCount = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
    if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    if (reflectiveWords.some(rw => word.includes(rw))) reflectiveCount++;
  });
  
  return {
    positive: positiveCount,
    negative: negativeCount,
    reflective: reflectiveCount,
    sentiment: positiveCount > negativeCount ? 'positive' : negativeCount > positiveCount ? 'negative' : 'neutral',
    depth: reflectiveCount
  };
};

/**
 * Pattern Detection - finds writing patterns
 */
const detectPatterns = (entries) => {
  if (!entries || entries.length === 0) return null;
  
  const patterns = {
    wordCount: entries.map(e => e.wordCount || 0),
    sentiments: entries.map(e => analyzeSentiment(e.content)),
    moods: entries.map(e => e.mood),
    times: entries.map(e => new Date(e.createdAt?.toDate ? e.createdAt.toDate() : e.createdAt)),
    avgWordCount: 0,
    dominantSentiment: 'neutral',
    commonMood: '😊',
    preferredTime: 'evening',
    writingTrend: 'stable',
    emotionalTrend: 'stable'
  };
  
  // Calculate average word count
  patterns.avgWordCount = Math.round(
    patterns.wordCount.reduce((a, b) => a + b, 0) / patterns.wordCount.length
  );
  
  // Detect dominant sentiment
  const sentimentCounts = patterns.sentiments.reduce((acc, s) => {
    acc[s.sentiment] = (acc[s.sentiment] || 0) + 1;
    return acc;
  }, {});
  patterns.dominantSentiment = Object.keys(sentimentCounts).reduce((a, b) => 
    sentimentCounts[a] > sentimentCounts[b] ? a : b
  );
  
  // Find most common mood
  const moodCounts = patterns.moods.reduce((acc, m) => {
    if (m) acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {});
  patterns.commonMood = Object.keys(moodCounts).length > 0 
    ? Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b)
    : '😊';
  
  // Detect preferred writing time
  const hours = patterns.times.map(t => t.getHours());
  const avgHour = Math.round(hours.reduce((a, b) => a + b, 0) / hours.length);
  if (avgHour >= 5 && avgHour < 12) patterns.preferredTime = 'morning';
  else if (avgHour >= 12 && avgHour < 17) patterns.preferredTime = 'afternoon';
  else if (avgHour >= 17 && avgHour < 21) patterns.preferredTime = 'evening';
  else patterns.preferredTime = 'night';
  
  // Detect writing trend (word count increasing/decreasing)
  if (patterns.wordCount.length >= 3) {
    const recent = patterns.wordCount.slice(-3);
    const older = patterns.wordCount.slice(0, 3);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    if (recentAvg > olderAvg * 1.2) patterns.writingTrend = 'increasing';
    else if (recentAvg < olderAvg * 0.8) patterns.writingTrend = 'decreasing';
  }
  
  // Detect emotional trend
  if (patterns.sentiments.length >= 3) {
    const recentPositive = patterns.sentiments.slice(-3).filter(s => s.sentiment === 'positive').length;
    const olderPositive = patterns.sentiments.slice(0, 3).filter(s => s.sentiment === 'positive').length;
    
    if (recentPositive > olderPositive) patterns.emotionalTrend = 'improving';
    else if (recentPositive < olderPositive) patterns.emotionalTrend = 'declining';
  }
  
  return patterns;
};

/**
 * Generate personalized writing prompts based on patterns
 */
const generatePrompts = (patterns, entries) => {
  if (!patterns) return getDefaultPrompts();
  
  const prompts = [];
  
  // Based on sentiment trends
  if (patterns.emotionalTrend === 'improving') {
    prompts.push({
      type: 'celebration',
      emoji: '🌟',
      title: 'Celebrate Your Progress',
      prompt: "I've noticed your recent entries feel more positive! What specific moments or changes have contributed to this shift?",
      motivation: "Your emotional growth is blooming beautifully. Let's capture this momentum!"
    });
  } else if (patterns.emotionalTrend === 'declining') {
    prompts.push({
      type: 'support',
      emoji: '🤗',
      title: 'Let It Out',
      prompt: "It seems like things have been challenging lately. What's weighing on your mind? Sometimes just writing it down helps.",
      motivation: "Your plant grows through all seasons. This reflection will nurture your roots."
    });
  }
  
  // Based on writing patterns
  if (patterns.writingTrend === 'increasing') {
    prompts.push({
      type: 'encouragement',
      emoji: '✨',
      title: 'Your Writing Flourishes',
      prompt: `You've been writing more deeply lately (avg ${patterns.avgWordCount} words)! What topics are you most excited to explore today?`,
      motivation: "Your dedication to reflection is remarkable. Keep this beautiful momentum going!"
    });
  } else if (patterns.writingTrend === 'decreasing') {
    prompts.push({
      type: 'gentle',
      emoji: '🌱',
      title: 'Small Seeds Matter',
      prompt: "Even a few words can make a difference. What's one thing you noticed today?",
      motivation: "Short entries water your garden just as well. Every reflection counts."
    });
  }
  
  // Based on dominant sentiment
  if (patterns.dominantSentiment === 'positive') {
    prompts.push({
      type: 'gratitude',
      emoji: '🙏',
      title: 'Gratitude Practice',
      prompt: "You often write about positive experiences! What are three things you're grateful for right now?",
      motivation: "Your optimistic reflections create a garden of appreciation."
    });
  } else if (patterns.dominantSentiment === 'negative') {
    prompts.push({
      type: 'reframe',
      emoji: '🌈',
      title: 'Finding Light',
      prompt: "I see you're processing some tough emotions. What's one small thing that went well today, even if it seems tiny?",
      motivation: "Acknowledging challenges helps your plant grow stronger roots."
    });
  }
  
  // Based on common mood
  if (patterns.commonMood) {
    const moodPrompts = {
      '😊': "You often feel content! What brings you this sense of peace?",
      '😔': "I notice you've been feeling down. What would help you feel a bit lighter today?",
      '😰': "You seem stressed lately. What's one thing you could let go of today?",
      '😡': "I see frustration in your recent entries. What needs to be said that hasn't been?",
      '😴': "Feeling tired? What does rest mean to you right now?",
      '🤔': "You're in a reflective mood! What question is on your mind today?"
    };
    
    if (moodPrompts[patterns.commonMood]) {
      prompts.push({
        type: 'mood-based',
        emoji: patterns.commonMood,
        title: 'Understanding Your Mood',
        prompt: moodPrompts[patterns.commonMood],
        motivation: "Your emotional awareness is a gift. Let's explore it together."
      });
    }
  }
  
  // Based on preferred time
  const timeOfDay = new Date().getHours();
  const isPreferredTime = 
    (patterns.preferredTime === 'morning' && timeOfDay >= 5 && timeOfDay < 12) ||
    (patterns.preferredTime === 'afternoon' && timeOfDay >= 12 && timeOfDay < 17) ||
    (patterns.preferredTime === 'evening' && timeOfDay >= 17 && timeOfDay < 21) ||
    (patterns.preferredTime === 'night' && (timeOfDay >= 21 || timeOfDay < 5));
  
  if (isPreferredTime) {
    prompts.push({
      type: 'timing',
      emoji: '⏰',
      title: `Perfect ${patterns.preferredTime.charAt(0).toUpperCase() + patterns.preferredTime.slice(1)} Time`,
      prompt: `This is your usual ${patterns.preferredTime} writing time! What's on your mind right now?`,
      motivation: `Your ${patterns.preferredTime} reflections have been meaningful. Let's continue this ritual.`
    });
  }
  
  // Topic suggestions based on past entries
  if (entries && entries.length > 0) {
    const lastEntry = entries[0];
    const daysSinceLastEntry = Math.floor((new Date() - new Date(lastEntry.createdAt?.toDate ? lastEntry.createdAt.toDate() : lastEntry.createdAt)) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastEntry > 3) {
      prompts.push({
        type: 'reconnect',
        emoji: '🌿',
        title: 'Welcome Back',
        prompt: "It's been a few days! What's happened since your last entry? Even brief updates help your plant grow.",
        motivation: "Your garden has been waiting for you. No judgment, just growth."
      });
    } else if (daysSinceLastEntry === 0) {
      prompts.push({
        type: 'deepening',
        emoji: '🌳',
        title: 'Dive Deeper',
        prompt: "You wrote earlier today! Want to explore those thoughts further, or is there something new on your mind?",
        motivation: "Multiple entries in one day show beautiful dedication to self-reflection."
      });
    }
  }
  
  // Always add some general prompts
  prompts.push(...getContextualPrompts());
  
  // Return 5 most relevant prompts
  return prompts.slice(0, 5);
};

/**
 * Get contextual prompts based on current time/day
 */
const getContextualPrompts = () => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  const prompts = [];
  
  // Time-based
  if (hour >= 5 && hour < 12) {
    prompts.push({
      type: 'morning',
      emoji: '☀️',
      title: 'Morning Reflection',
      prompt: "Good morning! What intentions do you want to set for today?",
      motivation: "Morning reflections set the tone for a mindful day."
    });
  } else if (hour >= 21 || hour < 5) {
    prompts.push({
      type: 'night',
      emoji: '🌙',
      title: 'Evening Review',
      prompt: "As the day ends, what moment stands out most? What did you learn?",
      motivation: "Nighttime journaling helps process the day and invite restful sleep."
    });
  }
  
  // Day-based
  if (day === 1) { // Monday
    prompts.push({
      type: 'weekly',
      emoji: '🎯',
      title: 'Week Ahead',
      prompt: "It's Monday! What's one thing you want to focus on this week?",
      motivation: "Starting the week with intention helps your garden flourish."
    });
  } else if (day === 0) { // Sunday
    prompts.push({
      type: 'weekly',
      emoji: '🌸',
      title: 'Weekly Review',
      prompt: "Sunday reflection: What did this week teach you? What are you proud of?",
      motivation: "Weekly reviews help you see how much your garden has grown."
    });
  }
  
  return prompts;
};

/**
 * Default prompts for new users
 */
const getDefaultPrompts = () => {
  return [
    {
      type: 'starter',
      emoji: '🌱',
      title: 'Begin Your Journey',
      prompt: "Welcome to Mood Garden! What brought you here today? What do you hope to explore through journaling?",
      motivation: "Every great garden starts with a single seed. Your first entry will plant that seed."
    },
    {
      type: 'simple',
      emoji: '✍️',
      title: 'Today\'s Moment',
      prompt: "What's one thing that happened today? It doesn't have to be big or profound.",
      motivation: "Small moments make the most beautiful gardens."
    },
    {
      type: 'feeling',
      emoji: '💭',
      title: 'Check In',
      prompt: "How are you feeling right now? What sensations do you notice in your body?",
      motivation: "Tuning into your feelings waters your inner garden."
    },
    {
      type: 'gratitude',
      emoji: '🙏',
      title: 'Three Good Things',
      prompt: "What are three things you're grateful for today, no matter how small?",
      motivation: "Gratitude is sunshine for your soul's garden."
    },
    {
      type: 'open',
      emoji: '🌈',
      title: 'Free Write',
      prompt: "Let your thoughts flow freely. Write whatever comes to mind without judgment.",
      motivation: "Free writing lets your creativity blossom naturally."
    }
  ];
};

/**
 * Custom hook for ML-powered insights
 */
export const useMLInsights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState(null);
  const [prompts, setPrompts] = useState(getDefaultPrompts());
  const [loading, setLoading] = useState(true);
  const [patterns, setPatterns] = useState(null);
  
  /**
   * Analyze user's journal entries
   */
  const analyzeEntries = useCallback(async () => {
    if (!user) {
      setInsights(null);
      setPrompts(getDefaultPrompts());
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Fetch recent entries (last 30)
      const entriesRef = collection(db, 'users', user.uid, 'entries');
      const q = query(entriesRef, orderBy('createdAt', 'desc'), limit(30));
      const snapshot = await getDocs(q);
      
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`[ML Analysis] User: ${user.uid}, Entries found: ${entries.length}`);
      
      if (entries.length === 0) {
        console.log('[ML Analysis] No entries found, using defaults');
        setInsights(null);
        setPatterns(null);
        setPrompts(getDefaultPrompts());
        setLoading(false);
        return;
      }
      
      // Detect patterns
      console.log('[ML Analysis] Starting pattern detection...');
      const detectedPatterns = detectPatterns(entries);
      console.log('[ML Analysis] Patterns detected:', detectedPatterns);
      setPatterns(detectedPatterns);
      
      // Generate insights
      const analysisInsights = {
        totalEntries: entries.length,
        avgWordCount: detectedPatterns.avgWordCount,
        dominantSentiment: detectedPatterns.dominantSentiment,
        emotionalTrend: detectedPatterns.emotionalTrend,
        writingTrend: detectedPatterns.writingTrend,
        preferredTime: detectedPatterns.preferredTime,
        commonMood: detectedPatterns.commonMood,
        lastEntryDate: entries[0].createdAt?.toDate ? entries[0].createdAt.toDate() : new Date(entries[0].createdAt),
        consistencyScore: Math.min(100, (entries.length / 30) * 100) // Entries in last 30 days
      };
      
      setInsights(analysisInsights);
      
      // Generate personalized prompts
      const personalizedPrompts = generatePrompts(detectedPatterns, entries);
      setPrompts(personalizedPrompts);
      
    } catch (error) {
      console.error('Error analyzing entries:', error);
      setPrompts(getDefaultPrompts());
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  /**
   * Analyze single entry sentiment
   */
  const analyzeSingleEntry = useCallback((content) => {
    return analyzeSentiment(content);
  }, []);
  
  /**
   * Get motivation message based on entry
   */
  const getMotivationMessage = useCallback((content, sentiment) => {
    const messages = {
      positive: [
        "Your positive energy is radiating through your words! 🌟",
        "This beautiful reflection will nourish your garden wonderfully! ✨",
        "Your optimism is helping your plant grow strong and vibrant! 🌈",
        "What a lovely perspective! Your garden is blooming! 🌸"
      ],
      negative: [
        "Thank you for being honest with yourself. Your courage helps your roots grow deeper. 🌿",
        "Processing difficult emotions is how we grow stronger. Your plant appreciates this care. 💚",
        "Even in challenging times, your reflection is valuable. Your garden holds space for all feelings. 🌱",
        "Writing through hard times takes strength. Your plant is here with you. 🤗"
      ],
      neutral: [
        "Every entry, big or small, nourishes your inner garden. 🌿",
        "Your consistent reflection is building something beautiful. 🌱",
        "Thank you for showing up today. Your plant is growing! ✨",
        "Your words are watering your garden perfectly. 🌸"
      ]
    };
    
    // Use provided sentiment or analyze content
    const sentimentType = sentiment?.sentiment || analyzeSentiment(content).sentiment;
    const relevantMessages = messages[sentimentType] || messages.neutral;
    return relevantMessages[Math.floor(Math.random() * relevantMessages.length)];
  }, []);
  
  // Analyze entries when user changes - reset state first
  useEffect(() => {
    if (!user) {
      console.log('[ML Insights] No user logged in, clearing state');
      setInsights(null);
      setPatterns(null);
      setPrompts(getDefaultPrompts());
      setLoading(false);
      return;
    }
    
    console.log(`[ML Insights] User changed: ${user.uid}, resetting state and analyzing...`);
    // Clear previous user's data before analyzing
    setInsights(null);
    setPatterns(null);
    setLoading(true);
    
    analyzeEntries();
  }, [user, analyzeEntries]);
  
  return {
    insights,
    prompts,
    patterns,
    loading,
    analyzeEntries,
    analyzeSingleEntry,
    getMotivationMessage
  };
};

export default useMLInsights;
