/**
 * Writing Prompts Library
 * Daily rotating prompts to inspire journaling
 */

export const GENERAL_PROMPTS = [
  "What brought you joy today, no matter how small?",
  "Describe a moment where you felt truly present.",
  "What challenge did you face, and how did you handle it?",
  "Write about a person who made a difference in your life.",
  "What are you grateful for right now?",
  "How did your body feel today?",
  "What would you tell your younger self?",
  "Describe your ideal day if you could design it.",
  "What's something you learned about yourself recently?",
  "Write a letter to someone (you don't have to send it).",
  "What would you do if fear wasn't a factor?",
  "How have you grown in the past year?",
  "What brings you peace?",
  "Describe a place where you feel safe.",
  "What's one thing you can't stop thinking about?"
];

export const MOOD_PROMPTS = {
  "😊": [
    "What made you smile today?",
    "Describe this moment of happiness in detail.",
    "What would make this day even better?"
  ],
  "😢": [
    "What do you need right now?",
    "It's okay to feel sad. What triggered this feeling?",
    "How can you show yourself compassion today?"
  ],
  "😴": [
    "How are you feeling about rest?",
    "What would help you recharge?",
    "Describe your ideal way to relax."
  ],
  "😡": [
    "What's really bothering you?",
    "If you could change one thing, what would it be?",
    "How can you express this feeling constructively?"
  ],
  "😱": [
    "What's making you anxious?",
    "What would help you feel more grounded?",
    "Break down what's worrying you into smaller pieces."
  ],
  "😌": [
    "What has your attention right now?",
    "Describe a moment of calm.",
    "What's on your mind?"
  ]
};

/**
 * Get daily prompt based on current date
 * Uses date as seed to ensure same prompt for entire day
 * @returns {string} Today's prompt
 */
export const getDailyPrompt = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const index = dayOfYear % GENERAL_PROMPTS.length;
  return GENERAL_PROMPTS[index];
};

/**
 * Get mood-based prompt
 * @param {string} mood - Emoji mood
 * @returns {string} Mood-specific prompt or general prompt
 */
export const getMoodPrompt = (mood) => {
  if (!mood || !MOOD_PROMPTS[mood]) {
    return getDailyPrompt();
  }

  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const prompts = MOOD_PROMPTS[mood];
  const index = dayOfYear % prompts.length;
  
  return prompts[index];
};

/**
 * Get a random prompt (for when user wants to skip to another)
 * @param {string} mood - Optional emoji mood for mood-based random
 * @returns {string} Random prompt
 */
export const getRandomPrompt = (mood = null) => {
  if (mood && MOOD_PROMPTS[mood]) {
    const prompts = MOOD_PROMPTS[mood];
    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  return GENERAL_PROMPTS[Math.floor(Math.random() * GENERAL_PROMPTS.length)];
};

/**
 * Sentence Starters Library
 * Helps overcome writer's block with easy starting phrases
 */
export const SENTENCE_STARTERS = {
  general: [
    "Today I noticed...",
    "I'm grateful for...",
    "Something that made me smile was...",
    "I've been thinking about...",
    "Right now I feel...",
    "One thing I learned today is...",
    "I'm looking forward to...",
    "Something I want to remember is...",
    "Today was different because...",
    "I realized that..."
  ],
  "😊": [
    "What made me happy was...",
    "I'm celebrating...",
    "The best part of today was...",
    "I feel so grateful because...",
    "This joy came from..."
  ],
  "😢": [
    "I'm feeling sad because...",
    "What I need right now is...",
    "This feeling reminds me of...",
    "I wish someone knew that...",
    "To comfort myself, I..."
  ],
  "😡": [
    "What's frustrating me is...",
    "I feel angry because...",
    "What I really want to say is...",
    "Behind this anger, I feel...",
    "To release this tension, I could..."
  ],
  "😴": [
    "I'm exhausted from...",
    "What I need to recharge is...",
    "Rest means to me...",
    "My body is telling me...",
    "To find peace, I will..."
  ],
  "😱": [
    "What's worrying me is...",
    "My anxiety comes from...",
    "To feel more grounded, I...",
    "The worst case scenario is... but realistically...",
    "One small step I can take is..."
  ],
  "😌": [
    "I feel calm because...",
    "What brings me peace is...",
    "In this moment, I'm aware of...",
    "My mind is clear about...",
    "I accept that..."
  ]
};

/**
 * Get sentence starters based on mood
 * @param {string} mood - Optional emoji mood
 * @returns {Array} List of sentence starters
 */
export const getSentenceStarters = (mood = null) => {
  if (mood && SENTENCE_STARTERS[mood]) {
    return [...SENTENCE_STARTERS[mood], ...SENTENCE_STARTERS.general.slice(0, 3)];
  }
  return SENTENCE_STARTERS.general;
};
