/**
 * Community Journeys Component
 * Mindful practices like "Gratitude Practice" - following No Quantification philosophy
 * Numbers are kept internally for tracking but hidden from user-facing UI
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Compass, 
  Users,
  Leaf,
  Target,
  CheckCircle,
  Clock,
  Star,
  Flame,
  Heart,
  Sun,
  Moon,
  Sparkles,
  Award,
  Play,
  Pause
} from 'lucide-react';

/**
 * Available journeys/practices
 * Internal duration values are kept for tracking but not displayed to users
 */
const JOURNEYS = [
  {
    id: 'gratitude-30',
    name: 'Gratitude Practice',
    description: 'Cultivate appreciation by noticing the good in your life',
    icon: Heart,
    color: 'pink',
    duration: 30, // Internal tracking only
    displayDescription: 'An ongoing journey of thankfulness',
    requirement: 'Reflect on something you\'re grateful for',
    benefits: ['Deepen your appreciation', 'Notice life\'s gifts', 'Grow your gratitude garden'],
    tips: [
      'Start small - even one word counts',
      'Be specific about what you\'re grateful for',
      'Include why you\'re grateful',
      'Look for unexpected blessings'
    ],
    category: 'gratitude'
  },
  {
    id: 'morning-pages',
    name: 'Morning Pages Practice',
    description: 'Start your day with reflective writing',
    icon: Sun,
    color: 'amber',
    duration: 21, // Internal tracking only
    displayDescription: 'A morning ritual of free-flowing thoughts',
    requirement: 'Write freely each morning',
    benefits: ['Clear your mind', 'Start fresh each day', 'Unlock creativity'],
    tips: [
      'Write soon after waking',
      'Don\'t edit or censor yourself',
      'Let thoughts flow freely',
      'Keep your journal by your bed'
    ],
    category: 'routine'
  },
  {
    id: 'mood-tracker-14',
    name: 'Mood Awareness Journey',
    description: 'Develop deeper awareness of your emotional landscape',
    icon: Sparkles,
    color: 'violet',
    duration: 14, // Internal tracking only
    displayDescription: 'Building emotional self-awareness',
    requirement: 'Check in with how you\'re feeling',
    benefits: ['Understand yourself better', 'Recognize patterns', 'Honor your feelings'],
    tips: [
      'Check in at a consistent time',
      'Note what influenced your mood',
      'Look for patterns',
      'Be honest with yourself'
    ],
    category: 'tracking'
  },
  {
    id: 'night-reflection',
    name: 'Evening Reflection Practice',
    description: 'Close each day with mindful reflection',
    icon: Moon,
    color: 'indigo',
    duration: 7, // Internal tracking only
    displayDescription: 'A peaceful evening ritual',
    requirement: 'Reflect on your day each evening',
    benefits: ['Find closure', 'Process your experiences', 'Rest more peacefully'],
    tips: [
      'Review your day\'s highlights',
      'Note what you learned',
      'Set intentions for tomorrow',
      'Practice letting go of negativity'
    ],
    category: 'reflection'
  },
  {
    id: 'word-warrior',
    name: 'Expressive Writing Practice',
    description: 'Express yourself fully through writing',
    icon: Target,
    color: 'emerald',
    duration: 10, // Internal tracking only
    displayDescription: 'Let your words flow without limits',
    requirement: 'Write freely and expressively',
    benefits: ['Find your voice', 'Express yourself fully', 'Build a writing habit'],
    tips: [
      'Don\'t worry about quality',
      'Use prompts if stuck',
      'Write about anything',
      'Keep going even on hard days'
    ],
    category: 'writing'
  },
  {
    id: 'self-care-week',
    name: 'Self-Care Practice',
    description: 'Nurture yourself with intentional self-care',
    icon: Heart,
    color: 'rose',
    duration: 7, // Internal tracking only
    displayDescription: 'An ongoing commitment to your wellbeing',
    requirement: 'Practice one act of self-care',
    benefits: ['Prioritize your wellbeing', 'Build healthy habits', 'Show yourself love'],
    tips: [
      'Include physical, mental, and emotional care',
      'Small acts count too',
      'Note how it made you feel',
      'Try something new'
    ],
    category: 'wellness'
  }
];

/**
 * Journey Card Component
 * Shows journey info without numerical targets or XP
 */
const JourneyCard = ({ journey, status, onJoin, onContinue }) => {
  const Icon = journey.icon;
  const isActive = status?.isActive;
  const completedDays = status?.completedDays || [];
  
  // Calculate progress internally but display as visual indicator only
  const progressPercent = journey.duration > 0 
    ? Math.min((completedDays.length / journey.duration) * 100, 100)
    : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-deep-700/50 rounded-xl p-4 border ${
        isActive ? `border-${journey.color}-500/50` : 'border-deep-600'
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 bg-${journey.color}-500/20 rounded-xl`}>
          <Icon className={`w-6 h-6 text-${journey.color}-400`} />
        </div>
        <div className="flex-1">
          <h3 className="text-cream-100 font-bold">{journey.name}</h3>
          <p className="text-cream-400 text-sm">{journey.displayDescription || journey.description}</p>
        </div>
        {isActive && (
          <span className={`text-xs px-2 py-1 rounded-full bg-${journey.color}-500/20 text-${journey.color}-400`}>
            Active
          </span>
        )}
      </div>
      
      {/* Visual Progress Indicator (no numbers) */}
      {isActive && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-cream-400 mb-1">
            <span>Your Journey</span>
            <span className="flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              Growing
            </span>
          </div>
          <div className="h-2 bg-deep-600 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className={`h-full bg-gradient-to-r from-${journey.color}-500 to-${journey.color}-400`}
            />
          </div>
        </div>
      )}
      
      {/* Benefits Preview (replaces rewards) */}
      <div className="bg-deep-600/50 rounded-lg p-3 mb-3">
        <span className="text-xs text-cream-500 block mb-1">What you'll cultivate:</span>
        <div className="flex flex-wrap gap-1">
          {journey.benefits.map((benefit, i) => (
            <span key={i} className="text-xs bg-deep-500/50 px-2 py-0.5 rounded text-cream-300">
              {benefit}
            </span>
          ))}
        </div>
      </div>
      
      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={isActive ? onContinue : onJoin}
        className={`w-full py-2 rounded-xl font-medium flex items-center justify-center gap-2 ${
          isActive
            ? `bg-${journey.color}-500/20 text-${journey.color}-400 hover:bg-${journey.color}-500/30`
            : `bg-gradient-to-r from-${journey.color}-500 to-${journey.color}-600 text-white`
        }`}
      >
        {isActive ? (
          <>
            <Play className="w-4 h-4" />
            Continue Practice
          </>
        ) : (
          <>
            <Compass className="w-4 h-4" />
            Begin Journey
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

/**
 * Active Journey Detail View
 * Shows progress visually without numerical stats
 */
const JourneyDetail = ({ journey, status, onClose, onLogDay }) => {
  const Icon = journey.icon;
  const completedDays = status?.completedDays || [];
  const todayKey = new Date().toISOString().split('T')[0];
  const isTodayCompleted = completedDays.includes(todayKey);
  
  // Generate calendar grid (internal tracking, displayed visually)
  const startDate = status?.startDate ? new Date(status.startDate) : new Date();
  const calendarDays = Array.from({ length: journey.duration }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];
    const isCompleted = completedDays.includes(dateKey);
    const isPast = date < new Date(todayKey);
    const isToday = dateKey === todayKey;
    const isFuture = date > new Date();
    
    return { day: i + 1, date, dateKey, isCompleted, isPast, isToday, isFuture };
  });
  
  // Calculate visual progress stages
  const progressPercent = journey.duration > 0 
    ? Math.min((completedDays.length / journey.duration) * 100, 100)
    : 0;
  const getProgressStage = () => {
    if (progressPercent >= 100) return 'Blooming';
    if (progressPercent >= 75) return 'Flourishing';
    if (progressPercent >= 50) return 'Growing Strong';
    if (progressPercent >= 25) return 'Taking Root';
    return 'Just Planted';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-2 hover:bg-deep-600 rounded-xl"
        >
          <X className="w-5 h-5 text-cream-400" />
        </button>
        <div className={`p-2 bg-${journey.color}-500/20 rounded-xl`}>
          <Icon className={`w-6 h-6 text-${journey.color}-400`} />
        </div>
        <h2 className="text-xl font-bold text-cream-100">{journey.name}</h2>
      </div>
      
      {/* Journey Progress - Visual Only */}
      <div className="bg-deep-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-cream-200 font-medium">Your Growth</span>
          <span className={`text-${journey.color}-400 text-sm flex items-center gap-1`}>
            <Leaf className="w-4 h-4" />
            {getProgressStage()}
          </span>
        </div>
        <div className="h-3 bg-deep-600 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className={`h-full bg-gradient-to-r from-${journey.color}-500 to-${journey.color}-400`}
          />
        </div>
      </div>
      
      {/* Practice Garden Grid - Visual Progress */}
      <div className="bg-deep-700/50 rounded-xl p-4">
        <h3 className="text-cream-200 font-medium mb-3">Your Practice Garden</h3>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map(day => (
            <div
              key={day.day}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm ${
                day.isCompleted
                  ? `bg-${journey.color}-500/30 text-${journey.color}-400`
                  : day.isToday
                  ? 'bg-deep-500 text-cream-200 ring-2 ring-cream-400'
                  : day.isPast
                  ? 'bg-deep-600/30 text-cream-600'
                  : 'bg-deep-600/50 text-cream-500'
              }`}
              title={day.isCompleted ? 'Practice completed' : day.isToday ? 'Today' : ''}
            >
              {day.isCompleted ? (
                <Sparkles className="w-4 h-4" />
              ) : day.isToday ? (
                <Sun className="w-4 h-4" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-current opacity-30" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Today's Practice */}
      <div className="bg-deep-700/50 rounded-xl p-4">
        <h3 className="text-cream-200 font-medium mb-2">Today's Practice</h3>
        {isTodayCompleted ? (
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
            <span>You've practiced today — well done!</span>
          </div>
        ) : (
          <>
            <p className="text-cream-400 text-sm mb-3">{journey.requirement}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onLogDay(todayKey)}
              className={`w-full py-3 rounded-xl font-medium bg-gradient-to-r from-${journey.color}-500 to-${journey.color}-600 text-white flex items-center justify-center gap-2`}
            >
              <CheckCircle className="w-5 h-5" />
              I Practiced Today
            </motion.button>
          </>
        )}
      </div>
      
      {/* Tips */}
      <div className="bg-deep-700/50 rounded-xl p-4">
        <h3 className="text-cream-200 font-medium mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Guidance for Your Journey
        </h3>
        <ul className="space-y-2">
          {journey.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-cream-400">
              <span className="text-amber-400">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

/**
 * Main Community Journeys Component
 * Renamed from Challenges to Journeys for gentler framing
 */
const CommunityChallenges = ({ isOpen, onClose, entries = [] }) => {
  const [activeView, setActiveView] = useState('list'); // 'list' or 'detail'
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [journeyStatuses, setJourneyStatuses] = useState({});
  const [completedJourneys, setCompletedJourneys] = useState([]);

  // Load saved journey data
  useEffect(() => {
    const saved = localStorage.getItem('communityChallenges');
    if (saved) {
      const data = JSON.parse(saved);
      setJourneyStatuses(data.statuses || {});
      setCompletedJourneys(data.completed || []);
    }
  }, []);

  // Save journey data
  const saveData = (statuses, completed) => {
    localStorage.setItem('communityChallenges', JSON.stringify({
      statuses,
      completed
    }));
  };

  const handleJoinJourney = (journey) => {
    const newStatuses = {
      ...journeyStatuses,
      [journey.id]: {
        isActive: true,
        startDate: new Date().toISOString(),
        completedDays: []
      }
    };
    setJourneyStatuses(newStatuses);
    saveData(newStatuses, completedJourneys);
    setSelectedJourney(journey);
    setActiveView('detail');
  };

  const handleLogDay = (journeyId, dateKey) => {
    const status = journeyStatuses[journeyId];
    if (!status) return;
    
    const journey = JOURNEYS.find(j => j.id === journeyId);
    const newCompletedDays = [...status.completedDays, dateKey];
    
    const newStatuses = {
      ...journeyStatuses,
      [journeyId]: {
        ...status,
        completedDays: newCompletedDays
      }
    };
    
    // Check if journey is complete (internal tracking)
    let newCompleted = completedJourneys;
    if (newCompletedDays.length >= journey.duration) {
      newCompleted = [...completedJourneys, {
        journeyId: journeyId,
        completedAt: new Date().toISOString()
      }];
      // Remove from active
      delete newStatuses[journeyId];
      setCompletedJourneys(newCompleted);
    }
    
    setJourneyStatuses(newStatuses);
    saveData(newStatuses, newCompleted);
  };

  const activeJourneys = JOURNEYS.filter(j => journeyStatuses[j.id]?.isActive);
  const availableJourneys = JOURNEYS.filter(j => !journeyStatuses[j.id]?.isActive);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-deep-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sage-600 to-emerald-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Compass className="w-6 h-6 text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">Mindful Journeys</h2>
                  <p className="text-sm text-sage-200">Explore practices for your wellbeing</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[70vh]">
            {activeView === 'list' ? (
              <div className="space-y-6">
                {/* Active Journeys */}
                {activeJourneys.length > 0 && (
                  <div>
                    <h3 className="text-cream-200 font-medium mb-3 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-400" />
                      Your Active Practices
                    </h3>
                    <div className="space-y-3">
                      {activeJourneys.map(journey => (
                        <JourneyCard
                          key={journey.id}
                          journey={journey}
                          status={journeyStatuses[journey.id]}
                          onJoin={() => handleJoinJourney(journey)}
                          onContinue={() => {
                            setSelectedJourney(journey);
                            setActiveView('detail');
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Completed Journeys */}
                {completedJourneys.length > 0 && (
                  <div>
                    <h3 className="text-cream-200 font-medium mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      Journeys Completed
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {completedJourneys.map((completed, i) => {
                        const journey = JOURNEYS.find(j => j.id === completed.journeyId || j.id === completed.challengeId);
                        return (
                          <span key={i} className={`px-3 py-1 bg-${journey?.color || 'amber'}-500/20 text-${journey?.color || 'amber'}-400 rounded-full text-sm flex items-center gap-1`}>
                            <CheckCircle className="w-3 h-3" />
                            {journey?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Available Journeys */}
                <div>
                  <h3 className="text-cream-200 font-medium mb-3 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-sage-400" />
                    Begin a New Journey
                  </h3>
                  <div className="grid gap-3">
                    {availableJourneys.map(journey => (
                      <JourneyCard
                        key={journey.id}
                        journey={journey}
                        status={null}
                        onJoin={() => handleJoinJourney(journey)}
                        onContinue={() => {}}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <JourneyDetail
                journey={selectedJourney}
                status={journeyStatuses[selectedJourney?.id]}
                onClose={() => setActiveView('list')}
                onLogDay={(dateKey) => handleLogDay(selectedJourney.id, dateKey)}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommunityChallenges;
