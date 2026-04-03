/**
 * AI Writing Coach
 * Personalized writing insights and suggestions
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Brain,
  TrendingUp,
  Heart,
  Sun,
  Cloud,
  CloudRain,
  Zap,
  Target,
  MessageSquare,
  Lightbulb,
  PenTool,
  BarChart3,
  Repeat,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  X,
  RefreshCw
} from 'lucide-react';

// Emotion keywords for analysis
const EMOTION_KEYWORDS = {
  joy: ['happy', 'joy', 'excited', 'wonderful', 'amazing', 'great', 'love', 'grateful', 'blessed', 'smile', 'laugh', 'delighted', 'thrilled', 'elated', 'cheerful'],
  sadness: ['sad', 'unhappy', 'depressed', 'down', 'lonely', 'hurt', 'cry', 'tears', 'miss', 'lost', 'grief', 'sorrow', 'disappointed', 'melancholy'],
  anger: ['angry', 'frustrated', 'annoyed', 'mad', 'furious', 'irritated', 'upset', 'rage', 'hate', 'resent', 'outraged', 'bitter'],
  fear: ['afraid', 'scared', 'anxious', 'worried', 'nervous', 'panic', 'fear', 'terrified', 'overwhelmed', 'stressed', 'uneasy'],
  surprise: ['surprised', 'shocked', 'amazed', 'unexpected', 'sudden', 'astonished', 'stunned', 'incredible'],
  love: ['love', 'adore', 'cherish', 'care', 'appreciate', 'affection', 'fond', 'devoted', 'tender', 'warmth'],
  gratitude: ['thankful', 'grateful', 'appreciate', 'blessed', 'fortunate', 'lucky', 'thanks', 'gratitude'],
  hope: ['hope', 'optimistic', 'looking forward', 'excited about', 'anticipate', 'positive', 'believe', 'faith'],
  peace: ['calm', 'peaceful', 'serene', 'tranquil', 'relaxed', 'content', 'at ease', 'mindful', 'centered'],
  confusion: ['confused', 'uncertain', 'lost', 'unclear', 'unsure', 'puzzled', 'torn', 'conflicted'],
};

// Theme categories
const THEME_KEYWORDS = {
  relationships: ['friend', 'family', 'partner', 'love', 'connection', 'together', 'relationship', 'bond', 'support', 'communication'],
  work: ['work', 'job', 'career', 'project', 'meeting', 'deadline', 'colleague', 'boss', 'office', 'professional'],
  health: ['health', 'exercise', 'sleep', 'energy', 'tired', 'sick', 'wellness', 'fitness', 'doctor', 'medicine'],
  growth: ['learn', 'grow', 'improve', 'develop', 'change', 'progress', 'goal', 'achievement', 'milestone', 'challenge'],
  creativity: ['create', 'art', 'music', 'write', 'design', 'imagine', 'express', 'idea', 'inspire', 'creative'],
  nature: ['nature', 'outside', 'garden', 'tree', 'flower', 'sun', 'rain', 'walk', 'park', 'sky'],
  mindfulness: ['meditate', 'breathe', 'present', 'moment', 'awareness', 'mindful', 'focus', 'attention', 'observe'],
};

// Writing style indicators
const STYLE_PATTERNS = {
  descriptive: /\b(beautiful|colorful|soft|bright|dark|warm|cold|smooth|rough)\b/gi,
  analytical: /\b(because|therefore|however|although|since|despite|consequently)\b/gi,
  emotional: /\b(feel|felt|feeling|emotion|heart|soul|deeply)\b/gi,
  narrative: /\b(then|after|before|while|suddenly|finally|first|next)\b/gi,
};

// Custom Hook for Writing Analysis
const useWritingAnalysis = (entries = []) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeEntries = useCallback(() => {
    if (entries.length === 0) {
      setAnalysis(null);
      return;
    }

    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      const allText = entries.map(e => e.content || '').join(' ').toLowerCase();
      const words = allText.split(/\s+/);
      const wordCount = words.length;

      // Emotion analysis
      const emotionScores = {};
      Object.entries(EMOTION_KEYWORDS).forEach(([emotion, keywords]) => {
        const count = keywords.reduce((sum, keyword) => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          return sum + (allText.match(regex) || []).length;
        }, 0);
        emotionScores[emotion] = count;
      });

      // Theme analysis
      const themeScores = {};
      Object.entries(THEME_KEYWORDS).forEach(([theme, keywords]) => {
        const count = keywords.reduce((sum, keyword) => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          return sum + (allText.match(regex) || []).length;
        }, 0);
        themeScores[theme] = count;
      });

      // Writing style analysis
      const styleScores = {};
      Object.entries(STYLE_PATTERNS).forEach(([style, pattern]) => {
        styleScores[style] = (allText.match(pattern) || []).length;
      });

      // Calculate averages and trends
      const avgWordCount = entries.length > 0 ? wordCount / entries.length : 0;
      const recentEntries = entries.slice(-7);
      const olderEntries = entries.slice(-14, -7);

      const recentAvg = recentEntries.reduce((sum, e) => sum + (e.content?.split(/\s+/).length || 0), 0) / (recentEntries.length || 1);
      const olderAvg = olderEntries.reduce((sum, e) => sum + (e.content?.split(/\s+/).length || 0), 0) / (olderEntries.length || 1);
      const writingTrend = recentAvg > olderAvg ? 'increasing' : recentAvg < olderAvg ? 'decreasing' : 'stable';

      // Dominant emotion
      const dominantEmotion = Object.entries(emotionScores).sort((a, b) => b[1] - a[1])[0];
      
      // Dominant theme
      const dominantTheme = Object.entries(themeScores).sort((a, b) => b[1] - a[1])[0];

      // Writing consistency
      const daysWithEntries = new Set(entries.map(e => new Date(e.date).toDateString())).size;
      const totalDays = entries.length > 0 
        ? Math.ceil((new Date() - new Date(entries[0].date)) / (1000 * 60 * 60 * 24)) 
        : 0;
      const consistency = totalDays > 0 ? (daysWithEntries / totalDays) * 100 : 0;

      setAnalysis({
        totalEntries: entries.length,
        totalWords: wordCount,
        avgWordCount: Math.round(avgWordCount),
        writingTrend,
        emotionScores,
        dominantEmotion: dominantEmotion?.[0] || 'neutral',
        dominantEmotionScore: dominantEmotion?.[1] || 0,
        themeScores,
        dominantTheme: dominantTheme?.[0] || 'general',
        dominantThemeScore: dominantTheme?.[1] || 0,
        styleScores,
        consistency: Math.round(consistency),
        recentTrend: writingTrend,
      });

      setIsAnalyzing(false);
    }, 800);
  }, [entries]);

  useEffect(() => {
    analyzeEntries();
  }, [analyzeEntries]);

  return { analysis, isAnalyzing, refresh: analyzeEntries };
};

// Generate personalized insights
const generateInsights = (analysis) => {
  if (!analysis) return [];

  const insights = [];

  // Emotional insights
  if (analysis.dominantEmotion === 'joy' && analysis.dominantEmotionScore > 5) {
    insights.push({
      type: 'positive',
      icon: Sun,
      title: 'Radiating Positivity',
      message: 'Your recent entries are filled with joy and positive energy. Your garden is thriving on your happiness!',
    });
  } else if (analysis.dominantEmotion === 'sadness' && analysis.dominantEmotionScore > 3) {
    insights.push({
      type: 'support',
      icon: Heart,
      title: 'Processing Emotions',
      message: 'You\'ve been exploring some difficult feelings lately. Writing about them is a healthy way to process. Consider reaching out to someone you trust.',
    });
  } else if (analysis.dominantEmotion === 'fear' || analysis.dominantEmotion === 'confusion') {
    insights.push({
      type: 'support',
      icon: AlertCircle,
      title: 'Finding Clarity',
      message: 'Uncertainty can be uncomfortable, but awareness is the first step. Try writing about what specific aspects feel unclear.',
    });
  }

  // Writing pattern insights
  if (analysis.writingTrend === 'increasing') {
    insights.push({
      type: 'achievement',
      icon: TrendingUp,
      title: 'Growing Expressiveness',
      message: 'You\'re writing more each day! Your thoughts are flowing more freely, nurturing deeper self-reflection.',
    });
  }

  // Consistency insights
  if (analysis.consistency > 70) {
    insights.push({
      type: 'achievement',
      icon: CheckCircle,
      title: 'Consistent Practice',
      message: `Your dedication to journaling is truly inspiring. You've built a beautiful rhythm!`,
    });
  } else if (analysis.consistency < 30 && analysis.totalEntries > 3) {
    insights.push({
      type: 'encouragement',
      icon: Repeat,
      title: 'Building Momentum',
      message: 'Try setting a small daily goal—even just 3 sentences. Consistency helps your garden flourish!',
    });
  }

  // Theme insights
  if (analysis.dominantTheme === 'growth') {
    insights.push({
      type: 'positive',
      icon: Sparkles,
      title: 'Growth Mindset',
      message: 'Your entries show a beautiful focus on personal development. You\'re cultivating real growth!',
    });
  } else if (analysis.dominantTheme === 'relationships') {
    insights.push({
      type: 'insight',
      icon: Heart,
      title: 'Connection Focus',
      message: 'Relationships are a central theme in your writing. Consider writing about what makes these connections meaningful.',
    });
  }

  return insights.slice(0, 4); // Max 4 insights
};

// Generate writing prompts based on analysis
const generatePrompts = (analysis) => {
  if (!analysis) return [];

  const prompts = [];
  const underexploredEmotions = Object.entries(analysis.emotionScores)
    .filter(([, score]) => score < 2)
    .map(([emotion]) => emotion);

  const underexploredThemes = Object.entries(analysis.themeScores)
    .filter(([, score]) => score < 2)
    .map(([theme]) => theme);

  // Prompts for underexplored emotions
  if (underexploredEmotions.includes('gratitude')) {
    prompts.push({
      category: 'Gratitude',
      prompt: 'What are three small things that brought you comfort today?',
      reason: 'You haven\'t explored gratitude much recently',
    });
  }

  if (underexploredEmotions.includes('hope')) {
    prompts.push({
      category: 'Hope',
      prompt: 'What are you looking forward to, even if it\'s something small?',
      reason: 'Adding hopeful thoughts can boost your mood',
    });
  }

  if (underexploredEmotions.includes('peace')) {
    prompts.push({
      category: 'Peace',
      prompt: 'Describe a moment today when you felt calm or at ease.',
      reason: 'Reflecting on peaceful moments promotes relaxation',
    });
  }

  // Prompts for underexplored themes
  if (underexploredThemes.includes('creativity')) {
    prompts.push({
      category: 'Creativity',
      prompt: 'If you could create anything without limits, what would it be?',
      reason: 'Creative thinking nurtures your garden\'s unique growth',
    });
  }

  if (underexploredThemes.includes('nature')) {
    prompts.push({
      category: 'Nature',
      prompt: 'Describe something beautiful you noticed outside recently.',
      reason: 'Connecting with nature enhances wellbeing',
    });
  }

  if (underexploredThemes.includes('mindfulness')) {
    prompts.push({
      category: 'Mindfulness',
      prompt: 'What are you sensing right now? (sounds, feelings, sights)',
      reason: 'Present-moment awareness calms the mind',
    });
  }

  // General prompts
  prompts.push({
    category: 'Reflection',
    prompt: 'What did you learn about yourself this week?',
    reason: 'Weekly reflection deepens self-understanding',
  });

  return prompts.slice(0, 5);
};

// Emotion Wheel Component
const EmotionWheel = ({ scores }) => {
  const emotions = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const maxScore = Math.max(...emotions.map(([, score]) => score), 1);

  const emotionColors = {
    joy: '#FFD700',
    love: '#FF69B4',
    gratitude: '#90EE90',
    hope: '#87CEEB',
    peace: '#98FB98',
    surprise: '#FFA500',
    sadness: '#6495ED',
    fear: '#9370DB',
    anger: '#FF6347',
    confusion: '#A9A9A9',
  };

  return (
    <div className="space-y-2">
      {emotions.slice(0, 5).map(([emotion, score]) => (
        <div key={emotion} className="flex items-center gap-2">
          <span className="w-20 text-xs text-gray-600 dark:text-gray-400 capitalize">
            {emotion}
          </span>
          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(score / maxScore) * 100}%` }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h-full rounded-full"
              style={{ backgroundColor: emotionColors[emotion] || '#88A77F' }}
            />
          </div>
          <span className="w-6 text-xs text-gray-500 dark:text-gray-400 text-right">
            {score}
          </span>
        </div>
      ))}
    </div>
  );
};

// Insight Card Component
const InsightCard = ({ insight }) => {
  const Icon = insight.icon;
  
  const typeStyles = {
    positive: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    support: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    achievement: 'bg-sage-50 dark:bg-sage-900/20 border-sage-200 dark:border-sage-800',
    encouragement: 'bg-sage-50 dark:bg-sage-900/20 border-sage-200 dark:border-sage-800',
    insight: 'bg-sage-50 dark:bg-sage-900/20 border-sage-200 dark:border-sage-800',
  };

  const iconStyles = {
    positive: 'text-green-500',
    support: 'text-blue-500',
    achievement: 'text-sage-500',
    encouragement: 'text-sage-500',
    insight: 'text-sage-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border ${typeStyles[insight.type]}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 ${iconStyles[insight.type]}`} />
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
            {insight.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {insight.message}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Prompt Card Component
const PromptCard = ({ prompt, onUse }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <span className="text-xs font-medium text-sage-600 dark:text-sage-400 uppercase tracking-wide">
            {prompt.category}
          </span>
          <p className="text-gray-900 dark:text-gray-100 mt-1 mb-2">
            "{prompt.prompt}"
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            {prompt.reason}
          </p>
        </div>
        <button
          onClick={() => onUse?.(prompt)}
          className="p-2 bg-sage-100 dark:bg-sage-900/30 text-sage-600 dark:text-sage-400 rounded-lg hover:bg-sage-200 dark:hover:bg-sage-800/50 transition-colors"
          title="Use this prompt"
        >
          <PenTool className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Main AI Writing Coach Component
const AIWritingCoach = ({ 
  entries = [], 
  isOpen, 
  onClose,
  onUsePrompt 
}) => {
  const { analysis, isAnalyzing, refresh } = useWritingAnalysis(entries);
  const [activeTab, setActiveTab] = useState('insights');

  const insights = useMemo(() => generateInsights(analysis), [analysis]);
  const prompts = useMemo(() => generatePrompts(analysis), [analysis]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-gray-800 rounded-3xl shadow-luxury-lg overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Brain className="w-7 h-7 text-sage-500" />
              Writing Coach
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={refresh}
                disabled={isAnalyzing}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
                title="Refresh analysis"
              >
                <RefreshCw className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'insights', label: 'Insights', icon: Lightbulb },
              { id: 'emotions', label: 'Emotions', icon: Heart },
              { id: 'prompts', label: 'Prompts', icon: MessageSquare },
              { id: 'stats', label: 'Stats', icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {isAnalyzing ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 mx-auto mb-4"
                >
                  <Brain className="w-12 h-12 text-sage-500" />
                </motion.div>
                <p className="text-gray-500 dark:text-gray-400">Analyzing your writing...</p>
              </div>
            </div>
          ) : !analysis ? (
            <div className="text-center py-12">
              <PenTool className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Start Writing
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Create a few journal entries and I'll provide personalized insights!
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'insights' && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {insights.length > 0 ? (
                    insights.map((insight, index) => (
                      <InsightCard key={index} insight={insight} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Sparkles className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Keep writing to unlock personalized insights!
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'emotions' && (
                <motion.div
                  key="emotions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Emotional Landscape
                    </h3>
                    <EmotionWheel scores={analysis.emotionScores} />
                  </div>

                  <div className="p-4 bg-sage-50 dark:bg-sage-900/20 rounded-xl">
                    <p className="text-sm text-sage-700 dark:text-sage-300">
                      <strong>Dominant emotion:</strong> {analysis.dominantEmotion}
                    </p>
                    <p className="text-xs text-sage-600 dark:text-sage-400 mt-1">
                      This emotion appears most frequently in your recent writing
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'prompts' && (
                <motion.div
                  key="prompts"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Personalized prompts based on your writing patterns:
                  </p>
                  {prompts.map((prompt, index) => (
                    <PromptCard 
                      key={index} 
                      prompt={prompt} 
                      onUse={onUsePrompt}
                    />
                  ))}
                </motion.div>
              )}

              {activeTab === 'stats' && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-sage-50 dark:bg-sage-900/20 rounded-xl text-center">
                      <p className="text-2xl font-bold text-sage-600 dark:text-sage-400">
                        {analysis.totalEntries <= 10 ? 'Beginning' : 
                         analysis.totalEntries <= 30 ? 'Growing' : 
                         analysis.totalEntries <= 100 ? 'Flourishing' : 'Abundant'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Your Garden</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {analysis.avgWordCount < 50 ? 'Brief' : 
                         analysis.avgWordCount < 150 ? 'Thoughtful' : 
                         analysis.avgWordCount < 300 ? 'Deep' : 'Expansive'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Reflections</p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {analysis.consistency < 30 ? 'Exploring' :
                         analysis.consistency < 60 ? 'Building' :
                         analysis.consistency < 80 ? 'Consistent' : 'Devoted'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Practice</p>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-center">
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 capitalize">
                        {analysis.dominantTheme}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Main Theme</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      {analysis.writingTrend === 'increasing' ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <BarChart3 className="w-5 h-5 text-gray-500" />
                      )}
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        Writing Trend
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your writing volume is <strong>{analysis.writingTrend}</strong> compared to last week.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export { useWritingAnalysis, generateInsights, generatePrompts, EmotionWheel };
export default AIWritingCoach;
