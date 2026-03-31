/**
 * Community Challenges Component
 * Group challenges like "30 Days of Gratitude"
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trophy, 
  Users,
  Calendar,
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
 * Available challenges
 */
const CHALLENGES = [
  {
    id: 'gratitude-30',
    name: '30 Days of Gratitude',
    description: 'Write one thing you\'re grateful for each day for 30 days',
    icon: Heart,
    color: 'pink',
    duration: 30,
    requirement: 'Write at least one gratitude entry per day',
    rewards: ['Gratitude Master badge', '300 XP', 'Special plant decoration'],
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
    name: '21 Day Morning Pages',
    description: 'Write 3 pages every morning for 21 days',
    icon: Sun,
    color: 'amber',
    duration: 21,
    requirement: 'Write at least 500 words each morning (before noon)',
    rewards: ['Early Bird badge', '210 XP', 'Sunrise plant theme'],
    tips: [
      'Write immediately after waking',
      'Don\'t edit or censor yourself',
      'Let thoughts flow freely',
      'Keep your journal by your bed'
    ],
    category: 'routine'
  },
  {
    id: 'mood-tracker-14',
    name: '14 Day Mood Journey',
    description: 'Track your mood consistently for 2 weeks',
    icon: Sparkles,
    color: 'violet',
    duration: 14,
    requirement: 'Log an entry with mood tag every day',
    rewards: ['Mood Explorer badge', '140 XP', 'Mood insights unlock'],
    tips: [
      'Check in at the same time daily',
      'Note what influenced your mood',
      'Look for patterns',
      'Be honest with yourself'
    ],
    category: 'tracking'
  },
  {
    id: 'night-reflection',
    name: '7 Day Evening Reflection',
    description: 'Reflect on your day every evening for a week',
    icon: Moon,
    color: 'indigo',
    duration: 7,
    requirement: 'Write an evening reflection (after 6 PM) each day',
    rewards: ['Night Owl badge', '70 XP', 'Moonlit garden theme'],
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
    name: '10 Day Word Warrior',
    description: 'Write at least 300 words every day for 10 days',
    icon: Target,
    color: 'emerald',
    duration: 10,
    requirement: 'Reach 300+ words in each daily entry',
    rewards: ['Word Warrior badge', '100 XP', 'Writing streak bonus'],
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
    name: 'Self-Care Week',
    description: 'Document one self-care activity each day for 7 days',
    icon: Heart,
    color: 'rose',
    duration: 7,
    requirement: 'Log a self-care activity with details',
    rewards: ['Self-Care Champion badge', '70 XP', 'Special heart flower'],
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
 * Challenge Card Component
 */
const ChallengeCard = ({ challenge, status, onJoin, onContinue }) => {
  const Icon = challenge.icon;
  const isActive = status?.isActive;
  const progress = status?.progress || 0;
  const completedDays = status?.completedDays || [];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-deep-700/50 rounded-xl p-4 border ${
        isActive ? `border-${challenge.color}-500/50` : 'border-deep-600'
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 bg-${challenge.color}-500/20 rounded-xl`}>
          <Icon className={`w-6 h-6 text-${challenge.color}-400`} />
        </div>
        <div className="flex-1">
          <h3 className="text-cream-100 font-bold">{challenge.name}</h3>
          <p className="text-cream-400 text-sm">{challenge.description}</p>
        </div>
        {isActive && (
          <span className={`text-xs px-2 py-1 rounded-full bg-${challenge.color}-500/20 text-${challenge.color}-400`}>
            Active
          </span>
        )}
      </div>
      
      {/* Details */}
      <div className="flex items-center gap-4 text-sm text-cream-500 mb-3">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {challenge.duration} days
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          {challenge.duration * 10} XP
        </span>
      </div>
      
      {/* Progress */}
      {isActive && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-cream-400 mb-1">
            <span>Progress</span>
            <span>{completedDays.length}/{challenge.duration} days</span>
          </div>
          <div className="h-2 bg-deep-600 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedDays.length / challenge.duration) * 100}%` }}
              className={`h-full bg-gradient-to-r from-${challenge.color}-500 to-${challenge.color}-400`}
            />
          </div>
        </div>
      )}
      
      {/* Rewards Preview */}
      <div className="bg-deep-600/50 rounded-lg p-3 mb-3">
        <span className="text-xs text-cream-500 block mb-1">Rewards:</span>
        <div className="flex flex-wrap gap-1">
          {challenge.rewards.map((reward, i) => (
            <span key={i} className="text-xs bg-deep-500/50 px-2 py-0.5 rounded text-cream-300">
              {reward}
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
            ? `bg-${challenge.color}-500/20 text-${challenge.color}-400 hover:bg-${challenge.color}-500/30`
            : `bg-gradient-to-r from-${challenge.color}-500 to-${challenge.color}-600 text-white`
        }`}
      >
        {isActive ? (
          <>
            <Play className="w-4 h-4" />
            Continue Challenge
          </>
        ) : (
          <>
            <Trophy className="w-4 h-4" />
            Start Challenge
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

/**
 * Active Challenge Detail View
 */
const ChallengeDetail = ({ challenge, status, onClose, onLogDay }) => {
  const Icon = challenge.icon;
  const completedDays = status?.completedDays || [];
  const todayKey = new Date().toISOString().split('T')[0];
  const isTodayCompleted = completedDays.includes(todayKey);
  
  // Generate calendar grid
  const startDate = status?.startDate ? new Date(status.startDate) : new Date();
  const calendarDays = Array.from({ length: challenge.duration }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];
    const isCompleted = completedDays.includes(dateKey);
    const isPast = date < new Date(todayKey);
    const isToday = dateKey === todayKey;
    const isFuture = date > new Date();
    
    return { day: i + 1, date, dateKey, isCompleted, isPast, isToday, isFuture };
  });
  
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
        <div className={`p-2 bg-${challenge.color}-500/20 rounded-xl`}>
          <Icon className={`w-6 h-6 text-${challenge.color}-400`} />
        </div>
        <h2 className="text-xl font-bold text-cream-100">{challenge.name}</h2>
      </div>
      
      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-deep-700/50 rounded-xl p-3 text-center">
          <span className={`text-2xl font-bold text-${challenge.color}-400`}>
            {completedDays.length}
          </span>
          <span className="text-xs text-cream-500 block">Days Done</span>
        </div>
        <div className="bg-deep-700/50 rounded-xl p-3 text-center">
          <span className="text-2xl font-bold text-cream-200">
            {challenge.duration - completedDays.length}
          </span>
          <span className="text-xs text-cream-500 block">Days Left</span>
        </div>
        <div className="bg-deep-700/50 rounded-xl p-3 text-center">
          <span className="text-2xl font-bold text-amber-400">
            {Math.round((completedDays.length / challenge.duration) * 100)}%
          </span>
          <span className="text-xs text-cream-500 block">Complete</span>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="bg-deep-700/50 rounded-xl p-4">
        <h3 className="text-cream-200 font-medium mb-3">Your Progress</h3>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map(day => (
            <div
              key={day.day}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm ${
                day.isCompleted
                  ? `bg-${challenge.color}-500/30 text-${challenge.color}-400`
                  : day.isToday
                  ? 'bg-deep-500 text-cream-200 ring-2 ring-cream-400'
                  : day.isPast
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-deep-600/50 text-cream-500'
              }`}
            >
              {day.isCompleted ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span>{day.day}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Today's Action */}
      <div className="bg-deep-700/50 rounded-xl p-4">
        <h3 className="text-cream-200 font-medium mb-2">Today</h3>
        {isTodayCompleted ? (
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
            <span>You've completed today's challenge!</span>
          </div>
        ) : (
          <>
            <p className="text-cream-400 text-sm mb-3">{challenge.requirement}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onLogDay(todayKey)}
              className={`w-full py-3 rounded-xl font-medium bg-gradient-to-r from-${challenge.color}-500 to-${challenge.color}-600 text-white flex items-center justify-center gap-2`}
            >
              <CheckCircle className="w-5 h-5" />
              Mark Today as Complete
            </motion.button>
          </>
        )}
      </div>
      
      {/* Tips */}
      <div className="bg-deep-700/50 rounded-xl p-4">
        <h3 className="text-cream-200 font-medium mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Tips for Success
        </h3>
        <ul className="space-y-2">
          {challenge.tips.map((tip, i) => (
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
 * Main Community Challenges Component
 */
const CommunityChallenges = ({ isOpen, onClose, entries = [] }) => {
  const [activeView, setActiveView] = useState('list'); // 'list' or 'detail'
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challengeStatuses, setChallengeStatuses] = useState({});
  const [completedChallenges, setCompletedChallenges] = useState([]);

  // Load saved challenge data
  useEffect(() => {
    const saved = localStorage.getItem('communityChallenges');
    if (saved) {
      const data = JSON.parse(saved);
      setChallengeStatuses(data.statuses || {});
      setCompletedChallenges(data.completed || []);
    }
  }, []);

  // Save challenge data
  const saveData = (statuses, completed) => {
    localStorage.setItem('communityChallenges', JSON.stringify({
      statuses,
      completed
    }));
  };

  const handleJoinChallenge = (challenge) => {
    const newStatuses = {
      ...challengeStatuses,
      [challenge.id]: {
        isActive: true,
        startDate: new Date().toISOString(),
        completedDays: []
      }
    };
    setChallengeStatuses(newStatuses);
    saveData(newStatuses, completedChallenges);
    setSelectedChallenge(challenge);
    setActiveView('detail');
  };

  const handleLogDay = (challengeId, dateKey) => {
    const status = challengeStatuses[challengeId];
    if (!status) return;
    
    const challenge = CHALLENGES.find(c => c.id === challengeId);
    const newCompletedDays = [...status.completedDays, dateKey];
    
    const newStatuses = {
      ...challengeStatuses,
      [challengeId]: {
        ...status,
        completedDays: newCompletedDays
      }
    };
    
    // Check if challenge is complete
    let newCompleted = completedChallenges;
    if (newCompletedDays.length >= challenge.duration) {
      newCompleted = [...completedChallenges, {
        challengeId,
        completedAt: new Date().toISOString()
      }];
      // Remove from active
      delete newStatuses[challengeId];
      setCompletedChallenges(newCompleted);
    }
    
    setChallengeStatuses(newStatuses);
    saveData(newStatuses, newCompleted);
  };

  const activeChallenges = CHALLENGES.filter(c => challengeStatuses[c.id]?.isActive);
  const availableChallenges = CHALLENGES.filter(c => !challengeStatuses[c.id]?.isActive);

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
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">Community Challenges</h2>
                  <p className="text-sm text-amber-200">Join challenges & earn rewards</p>
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
                {/* Active Challenges */}
                {activeChallenges.length > 0 && (
                  <div>
                    <h3 className="text-cream-200 font-medium mb-3 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-400" />
                      Your Active Challenges
                    </h3>
                    <div className="space-y-3">
                      {activeChallenges.map(challenge => (
                        <ChallengeCard
                          key={challenge.id}
                          challenge={challenge}
                          status={challengeStatuses[challenge.id]}
                          onJoin={() => handleJoinChallenge(challenge)}
                          onContinue={() => {
                            setSelectedChallenge(challenge);
                            setActiveView('detail');
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Completed Challenges */}
                {completedChallenges.length > 0 && (
                  <div>
                    <h3 className="text-cream-200 font-medium mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      Completed ({completedChallenges.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {completedChallenges.map((completed, i) => {
                        const challenge = CHALLENGES.find(c => c.id === completed.challengeId);
                        return (
                          <span key={i} className={`px-3 py-1 bg-${challenge?.color || 'amber'}-500/20 text-${challenge?.color || 'amber'}-400 rounded-full text-sm flex items-center gap-1`}>
                            <CheckCircle className="w-3 h-3" />
                            {challenge?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Available Challenges */}
                <div>
                  <h3 className="text-cream-200 font-medium mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-sage-400" />
                    Available Challenges
                  </h3>
                  <div className="grid gap-3">
                    {availableChallenges.map(challenge => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        status={null}
                        onJoin={() => handleJoinChallenge(challenge)}
                        onContinue={() => {}}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <ChallengeDetail
                challenge={selectedChallenge}
                status={challengeStatuses[selectedChallenge?.id]}
                onClose={() => setActiveView('list')}
                onLogDay={(dateKey) => handleLogDay(selectedChallenge.id, dateKey)}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommunityChallenges;
