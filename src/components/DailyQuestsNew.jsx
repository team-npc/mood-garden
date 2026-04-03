/**
 * Daily Invitations Component
 * Gentle suggestions for journaling practice - No XP, no pressure
 * Philosophy: No quantification - just optional invitations
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  Star, 
  Heart,
  CheckCircle,
  Sun,
  Moon,
  Leaf,
  Coffee
} from 'lucide-react';

const INVITATIONS_KEY = 'mood-garden-invitations';

/**
 * Daily Invitations - Gentle, non-pressuring suggestions
 */
const DAILY_INVITATIONS = [
  {
    id: 'write-today',
    name: 'Plant a Thought',
    description: 'Take a moment to reflect today',
    icon: '🌱',
    encouragement: 'Every seed planted grows'
  },
  {
    id: 'deeper-reflection',
    name: 'Go Deeper',
    description: 'Explore what\'s on your mind more fully',
    icon: '🌊',
    encouragement: 'Depth brings clarity'
  },
  {
    id: 'add-feeling',
    name: 'Name Your Feeling',
    description: 'Add an emotion to your reflection',
    icon: '💭',
    encouragement: 'Naming feelings helps us understand them'
  },
  {
    id: 'morning-light',
    name: 'Morning Light',
    description: 'Capture thoughts as the day begins',
    icon: '🌅',
    encouragement: 'Fresh mornings, fresh perspectives'
  },
  {
    id: 'evening-calm',
    name: 'Evening Calm',
    description: 'Reflect as the day winds down',
    icon: '🌙',
    encouragement: 'Evening reflections bring peace'
  },
  {
    id: 'gratitude-moment',
    name: 'Gratitude Moment',
    description: 'Notice something you\'re thankful for',
    icon: '🙏',
    encouragement: 'Gratitude opens the heart'
  }
];

/**
 * Weekly Themes - Ongoing journeys, not requirements
 */
const WEEKLY_THEMES = [
  {
    id: 'consistency',
    name: 'Finding Rhythm',
    description: 'Build a natural writing practice',
    icon: '🎵',
    encouragement: 'Rhythm comes naturally with time'
  },
  {
    id: 'exploration',
    name: 'Emotional Explorer',
    description: 'Notice different feelings this week',
    icon: '🗺️',
    encouragement: 'Every emotion has something to teach'
  },
  {
    id: 'presence',
    name: 'Being Present',
    description: 'Show up for yourself regularly',
    icon: '🧘',
    encouragement: 'Presence is its own reward'
  }
];

/**
 * Journey levels - qualitative growth stages (no XP)
 */
const JOURNEY_STAGES = [
  { stage: 'seedling', title: 'Seedling', message: 'Just beginning to grow' },
  { stage: 'sprout', title: 'Sprout', message: 'Taking root' },
  { stage: 'sapling', title: 'Sapling', message: 'Growing stronger' },
  { stage: 'blooming', title: 'Blooming', message: 'Finding your voice' },
  { stage: 'flourishing', title: 'Flourishing', message: 'Your practice is thriving' }
];

/**
 * Get journey stage from practice (qualitative assessment)
 */
const getJourneyStage = (completedCount) => {
  if (completedCount >= 50) return JOURNEY_STAGES[4];
  if (completedCount >= 25) return JOURNEY_STAGES[3];
  if (completedCount >= 10) return JOURNEY_STAGES[2];
  if (completedCount >= 3) return JOURNEY_STAGES[1];
  return JOURNEY_STAGES[0];
};

/**
 * Invitation Card Component - No progress bars or percentages
 */
const InvitationCard = ({ invitation, isAccepted }) => {
  return (
    <motion.div
      layout
      className={`p-4 rounded-xl border transition-all ${
        isAccepted
          ? 'bg-gradient-to-r from-leaf-500/20 to-sage-500/20 border-leaf-500/30'
          : 'bg-deep-700 border-deep-600 hover:border-sage-500/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          isAccepted ? 'bg-leaf-500/30' : 'bg-deep-600'
        }`}>
          {isAccepted ? '✨' : invitation.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-cream-100">{invitation.name}</span>
            {isAccepted && (
              <CheckCircle className="w-4 h-4 text-leaf-400" />
            )}
          </div>
          <p className="text-xs text-cream-500">{invitation.description}</p>
        </div>
        
        {!isAccepted && (
          <Heart className="w-5 h-5 text-cream-600" />
        )}
      </div>
      
      {isAccepted && (
        <div className="mt-2 text-xs text-sage-400 italic">
          ✓ {invitation.encouragement}
        </div>
      )}
    </motion.div>
  );
};

/**
 * Journey Progress - Visual, non-numerical
 */
const JourneyProgress = ({ stage }) => {
  return (
    <div className="p-4 bg-gradient-to-r from-sage-500/20 to-leaf-500/20 rounded-xl border border-sage-500/30 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-leaf-400" />
          <span className="font-bold text-cream-100">{stage.title}</span>
        </div>
        <span className="text-2xl">🌱</span>
      </div>
      
      <p className="text-sm text-cream-400">{stage.message}</p>
      
      {/* Visual growth indicator - not numerical */}
      <div className="mt-3 flex gap-1">
        {JOURNEY_STAGES.map((s, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              JOURNEY_STAGES.indexOf(stage) >= i
                ? 'bg-leaf-500'
                : 'bg-deep-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Main Daily Invitations Component
 */
const DailyQuests = ({ isOpen, onClose, entries = [], plantData = {} }) => {
  const [invitationData, setInvitationData] = useState({
    acceptedInvitations: [],
    totalAccepted: 0
  });
  
  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(INVITATIONS_KEY);
    if (saved) {
      try {
        setInvitationData(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading invitation data:', e);
      }
    }
  }, []);
  
  // Check for daily reset
  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    if (invitationData.lastReset !== today) {
      const newData = {
        ...invitationData,
        acceptedInvitations: [],
        lastReset: today
      };
      setInvitationData(newData);
      localStorage.setItem(INVITATIONS_KEY, JSON.stringify(newData));
    }
  }, [invitationData]);
  
  // Calculate which invitations are "accepted" based on today's activity
  const todayStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = entries.filter(e => {
      const date = e.createdAt?.toDate?.() || new Date(e.createdAt);
      return date.toISOString().split('T')[0] === today;
    });
    
    const hasEntry = todayEntries.length > 0;
    const hasMood = todayEntries.some(e => e.mood);
    const morningEntry = todayEntries.some(e => {
      const date = e.createdAt?.toDate?.() || new Date(e.createdAt);
      return date.getHours() < 10;
    });
    const eveningEntry = todayEntries.some(e => {
      const date = e.createdAt?.toDate?.() || new Date(e.createdAt);
      return date.getHours() >= 20;
    });
    
    return { hasEntry, hasMood, morningEntry, eveningEntry };
  }, [entries]);
  
  const isAccepted = (invitationId) => {
    switch (invitationId) {
      case 'write-today':
        return todayStats.hasEntry;
      case 'add-feeling':
        return todayStats.hasMood;
      case 'morning-light':
        return todayStats.morningEntry;
      case 'evening-calm':
        return todayStats.eveningEntry;
      default:
        return invitationData.acceptedInvitations.includes(invitationId);
    }
  };
  
  const journeyStage = getJourneyStage(invitationData.totalAccepted || 0);
  const acceptedToday = DAILY_INVITATIONS.filter(i => isAccepted(i.id)).length;
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bento-item max-w-lg w-full my-8 p-0 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header - Warm, inviting, no pressure */}
        <div className="bg-gradient-to-r from-sage-600 to-leaf-600 p-6 text-cream-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Today's Invitations</h2>
                <p className="text-sm text-sage-200">
                  Gentle suggestions for your practice
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {/* Journey Stage - No XP, just growth narrative */}
          <JourneyProgress stage={journeyStage} />
          
          {/* Daily Invitations */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-cream-100 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                Today
              </h3>
              {acceptedToday > 0 && (
                <span className="text-sm text-leaf-400">
                  🌿 Growing beautifully
                </span>
              )}
            </div>
            <div className="space-y-3">
              {DAILY_INVITATIONS.map(invitation => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  isAccepted={isAccepted(invitation.id)}
                />
              ))}
            </div>
          </div>
          
          {/* Weekly Themes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-cream-100 flex items-center gap-2">
                <Moon className="w-4 h-4 text-purple-400" />
                This Week's Themes
              </h3>
            </div>
            <div className="space-y-3">
              {WEEKLY_THEMES.map(theme => (
                <div
                  key={theme.id}
                  className="p-4 rounded-xl bg-deep-700/50 border border-deep-600"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{theme.icon}</span>
                    <div>
                      <div className="font-medium text-cream-100">{theme.name}</div>
                      <p className="text-xs text-cream-500">{theme.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Encouraging message */}
          <div className="mt-6 p-4 bg-deep-700/30 rounded-xl text-center">
            <p className="text-cream-400 text-sm">
              These are just gentle invitations, not requirements. 💚<br/>
              <span className="text-cream-500">Write when it feels right.</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DailyQuests;
