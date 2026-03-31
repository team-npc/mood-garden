/**
 * Emotion Detection Utility
 * Auto-suggest mood based on writing sentiment analysis
 */

/**
 * Sentiment keywords and their associated moods
 */
const SENTIMENT_KEYWORDS = {
  happy: {
    mood: '😊',
    words: [
      'happy', 'joy', 'joyful', 'excited', 'thrilled', 'delighted', 'wonderful',
      'amazing', 'fantastic', 'great', 'awesome', 'love', 'loving', 'blessed',
      'grateful', 'thankful', 'appreciate', 'celebration', 'celebrate', 'success',
      'accomplished', 'proud', 'winning', 'perfect', 'beautiful', 'brilliant',
      'fun', 'laugh', 'laughing', 'smile', 'smiling', 'cheerful', 'elated',
      'ecstatic', 'overjoyed', 'blissful', 'content', 'satisfied', 'pleased'
    ],
    phrases: [
      'so happy', 'best day', 'great day', 'wonderful time', 'feel good',
      'feeling good', 'good mood', 'on top of the world', 'over the moon',
      'couldn\'t be happier', 'made my day'
    ],
    weight: 1.0
  },
  sad: {
    mood: '😢',
    words: [
      'sad', 'unhappy', 'depressed', 'down', 'blue', 'miserable', 'gloomy',
      'heartbroken', 'devastated', 'crushed', 'disappointed', 'hopeless',
      'despair', 'grief', 'grieving', 'mourning', 'loss', 'lost', 'lonely',
      'alone', 'isolated', 'empty', 'hollow', 'numb', 'crying', 'cried',
      'tears', 'weeping', 'sobbing', 'hurt', 'hurting', 'pain', 'painful',
      'aching', 'sorrow', 'sorrowful', 'melancholy', 'dejected', 'downcast'
    ],
    phrases: [
      'feel sad', 'feeling down', 'so sad', 'really down', 'can\'t stop crying',
      'breaking down', 'falling apart', 'heart hurts', 'miss them', 'miss you',
      'wish things were different', 'hard to cope'
    ],
    weight: 1.0
  },
  angry: {
    mood: '😤',
    words: [
      'angry', 'mad', 'furious', 'frustrated', 'annoyed', 'irritated', 'upset',
      'rage', 'raging', 'fuming', 'livid', 'outraged', 'infuriated', 'enraged',
      'hostile', 'bitter', 'resentful', 'hate', 'hating', 'despise', 'loathe',
      'disgusted', 'fed up', 'pissed', 'aggravated', 'exasperated', 'bothered',
      'irked', 'vexed', 'indignant', 'offended', 'provoked'
    ],
    phrases: [
      'so angry', 'really mad', 'can\'t stand', 'sick of', 'tired of this',
      'had enough', 'drives me crazy', 'makes me mad', 'so frustrating',
      'lost my temper', 'blew up', 'seeing red'
    ],
    weight: 1.0
  },
  tired: {
    mood: '😴',
    words: [
      'tired', 'exhausted', 'drained', 'weary', 'fatigued', 'sleepy', 'drowsy',
      'worn out', 'burnt out', 'burnout', 'depleted', 'spent', 'sluggish',
      'lethargic', 'lazy', 'unmotivated', 'low energy', 'weak', 'heavy',
      'overwhelmed', 'overworked', 'stressed', 'strained', 'taxed'
    ],
    phrases: [
      'so tired', 'need sleep', 'can\'t keep going', 'running on empty',
      'need a break', 'too much', 'burning out', 'falling asleep',
      'barely awake', 'no energy', 'wiped out'
    ],
    weight: 1.0
  },
  anxious: {
    mood: '😰',
    words: [
      'anxious', 'worried', 'nervous', 'scared', 'afraid', 'fearful', 'panicked',
      'panic', 'panicking', 'stressed', 'tense', 'uneasy', 'restless', 'jittery',
      'edgy', 'apprehensive', 'dread', 'dreading', 'terrified', 'frightened',
      'paranoid', 'obsessing', 'overthinking', 'ruminating', 'spiraling',
      'overwhelmed', 'pressure', 'uncertain', 'insecure', 'doubtful'
    ],
    phrases: [
      'so anxious', 'freaking out', 'can\'t stop worrying', 'what if',
      'going to happen', 'might go wrong', 'scared of', 'afraid of',
      'panicking about', 'stressed about', 'worried about', 'keeping me up',
      'can\'t relax', 'on edge'
    ],
    weight: 1.0
  },
  calm: {
    mood: '😌',
    words: [
      'calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'content', 'centered',
      'balanced', 'grounded', 'mindful', 'present', 'zen', 'chill', 'mellow',
      'soothing', 'comfortable', 'cozy', 'safe', 'secure', 'settled', 'still',
      'quiet', 'rested', 'refreshed', 'rejuvenated', 'meditative', 'reflective'
    ],
    phrases: [
      'at peace', 'feeling calm', 'nice and relaxed', 'finally relaxing',
      'taking it easy', 'unwinding', 'letting go', 'in the moment',
      'breathing easy', 'nothing to worry about', 'all is well'
    ],
    weight: 1.0
  }
};

/**
 * Negation words that flip sentiment
 */
const NEGATION_WORDS = [
  'not', 'no', 'never', "don't", "doesn't", "didn't", "won't", "wouldn't",
  "can't", "cannot", "couldn't", "shouldn't", "isn't", "aren't", "wasn't",
  "weren't", "barely", "hardly", "rarely", "seldom"
];

/**
 * Intensifier words that boost sentiment
 */
const INTENSIFIERS = {
  boost: ['very', 'really', 'so', 'extremely', 'incredibly', 'absolutely', 'completely', 'totally', 'super'],
  reduce: ['slightly', 'somewhat', 'kind of', 'a bit', 'a little', 'sort of']
};

/**
 * Analyze text and detect emotion/mood
 * @param {string} text - The text to analyze
 * @returns {Object} - Analysis result with suggested mood and confidence
 */
export const detectEmotion = (text) => {
  if (!text || text.trim().length < 10) {
    return { mood: null, confidence: 0, scores: {} };
  }

  const normalizedText = text.toLowerCase();
  const words = normalizedText.split(/\s+/);
  
  // Initialize scores for each emotion
  const scores = {};
  Object.keys(SENTIMENT_KEYWORDS).forEach(emotion => {
    scores[emotion] = 0;
  });

  // Check for negation context
  const checkNegation = (wordIndex) => {
    // Check previous 3 words for negation
    for (let i = Math.max(0, wordIndex - 3); i < wordIndex; i++) {
      if (NEGATION_WORDS.some(neg => words[i].includes(neg))) {
        return true;
      }
    }
    return false;
  };

  // Check for intensifiers
  const checkIntensifier = (wordIndex) => {
    if (wordIndex > 0) {
      const prevWord = words[wordIndex - 1];
      if (INTENSIFIERS.boost.includes(prevWord)) return 1.5;
      if (INTENSIFIERS.reduce.some(r => prevWord.includes(r))) return 0.5;
    }
    return 1.0;
  };

  // Score individual words
  words.forEach((word, index) => {
    Object.entries(SENTIMENT_KEYWORDS).forEach(([emotion, data]) => {
      if (data.words.some(kw => word.includes(kw) || kw.includes(word))) {
        const isNegated = checkNegation(index);
        const intensifier = checkIntensifier(index);
        
        if (isNegated) {
          // Negation flips the sentiment
          const opposites = {
            happy: 'sad',
            sad: 'happy',
            calm: 'anxious',
            anxious: 'calm',
            angry: 'calm',
            tired: 'happy'
          };
          const opposite = opposites[emotion];
          if (opposite) {
            scores[opposite] += data.weight * intensifier * 0.7;
          }
        } else {
          scores[emotion] += data.weight * intensifier;
        }
      }
    });
  });

  // Score phrases
  Object.entries(SENTIMENT_KEYWORDS).forEach(([emotion, data]) => {
    data.phrases.forEach(phrase => {
      if (normalizedText.includes(phrase)) {
        scores[emotion] += data.weight * 1.5; // Phrases are weighted higher
      }
    });
  });

  // Find dominant emotion
  const sortedEmotions = Object.entries(scores)
    .sort(([,a], [,b]) => b - a);
  
  const topEmotion = sortedEmotions[0];
  const secondEmotion = sortedEmotions[1];
  
  // Calculate confidence
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);
  
  if (totalScore === 0) {
    return { mood: null, confidence: 0, scores };
  }

  const confidence = Math.min(
    Math.round((topEmotion[1] / Math.max(totalScore, 1)) * 100),
    95
  );

  // Only suggest if confidence is above threshold
  if (confidence < 25 || topEmotion[1] < 1) {
    return { mood: null, confidence: 0, scores };
  }

  return {
    mood: SENTIMENT_KEYWORDS[topEmotion[0]].mood,
    emotion: topEmotion[0],
    confidence,
    scores,
    secondaryMood: secondEmotion[1] > 0 ? SENTIMENT_KEYWORDS[secondEmotion[0]].mood : null
  };
};

/**
 * Get mood suggestion with explanation
 */
export const getMoodSuggestion = (text) => {
  const analysis = detectEmotion(text);
  
  if (!analysis.mood) {
    return null;
  }

  const explanations = {
    happy: 'Your words suggest positive emotions',
    sad: 'Your writing reflects some sadness',
    angry: 'There seems to be some frustration in your words',
    tired: 'You might be feeling worn out',
    anxious: 'Your words suggest some worry or stress',
    calm: 'Your writing has a peaceful tone'
  };

  return {
    ...analysis,
    explanation: explanations[analysis.emotion] || 'Based on your words'
  };
};

/**
 * React hook for real-time emotion detection
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export const useEmotionDetection = (text, options = {}) => {
  const { debounceMs = 500, minLength = 20 } = options;
  const [suggestion, setSuggestion] = useState(null);
  const timeoutRef = useRef(null);

  const analyze = useCallback(() => {
    if (text && text.length >= minLength) {
      const result = getMoodSuggestion(text);
      setSuggestion(result);
    } else {
      setSuggestion(null);
    }
  }, [text, minLength]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(analyze, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, analyze, debounceMs]);

  return suggestion;
};

export default detectEmotion;
