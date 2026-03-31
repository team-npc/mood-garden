/**
 * Garden Page Component  
 * Main dashboard showing the user's plant and entry options
 * Enhanced with bento grid layout and forest theme
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  TrendingUp, 
  Award, 
  Droplets,
  Target,
  Sparkles,
  Maximize2,
  BarChart3,
  Leaf,
  CloudSun,
  Music,
  Flower2,
  Apple,
  Clock
} from 'lucide-react';
import { usePlantLogic } from '../hooks/usePlantLogic';
import { useJournal } from '../hooks/useJournal';
import PlantStageNew from '../components/PlantStageNew';
import JournalEntryForm from '../components/JournalEntryForm';
import { getDominantWeeklyMood } from '../utils/plantThemeUtils';

// New Feature Components
import { ParticleSystem, AmbientGlow } from '../components/ParticleSystem';
import AmbientSoundscape from '../components/AmbientSoundscape';
import { useAchievements, AchievementNotification, AchievementGallery } from '../components/AchievementSystem';
import { usePlantSpecies, PlantSelectionModal } from '../components/PlantSpecies';
import MoodTimeline from '../components/MoodTimeline';
import FocusMode, { useFocusMode } from '../components/FocusMode';
import { WeatherWidget, WeatherPrompt, WeatherProvider } from '../components/WeatherIntegration';
import { ChallengesWidget, DailyChallengesPanel, ChallengeProvider } from '../components/DailyChallenges';

/**
 * Stat Card Component for Bento Grid
 */
const StatCard = ({ icon: Icon, value, label, accent = false, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bento-item ${className}`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className={`text-3xl md:text-4xl font-bold ${accent ? 'text-leaf-600 dark:text-leaf-400' : 'text-earth-800 dark:text-cream-200'}`}>
          {value}
        </p>
        <p className="text-sm text-earth-600 dark:text-cream-600 mt-1">{label}</p>
      </div>
      <div className="p-3 rounded-2xl bg-sage-100 dark:bg-deep-600/50">
        <Icon className={`w-5 h-5 ${accent ? 'text-leaf-600 dark:text-leaf-400' : 'text-earth-600 dark:text-cream-400'}`} />
      </div>
    </div>
  </motion.div>
);

/**
 * Garden Page Component
 */
const GardenPageContent = () => {
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showMoodTimeline, setShowMoodTimeline] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showPlantSelection, setShowPlantSelection] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const { 
    plant, 
    loading: plantLoading, 
    getPlantVisualState, 
    getEncouragementMessage,
    getStreakMessage,
    getDaysUntilNextStage,
    getStageProgress
  } = usePlantLogic();
  
  const { entries, addEntry, submitting, getPlantInsights } = useJournal();
  
  // New hooks
  const { checkAchievements, unlockedAchievements } = useAchievements();
  const { selectedSpecies, getSpeciesConfig } = usePlantSpecies();
  const { isOpen: isFocusMode, enterFocusMode, exitFocusMode } = useFocusMode();

  // Calculate mood theme for plant colors based on weekly mood
  const moodTheme = useMemo(() => {
    const weeklyMood = getDominantWeeklyMood(entries);
    return weeklyMood.colorScheme;
  }, [entries]);
  
  // Check achievements when entries change
  useEffect(() => {
    if (entries.length > 0 && plant) {
      const userData = {
        streak: plant.currentStreak || 0,
        totalWords: entries.reduce((sum, e) => sum + (e.content?.split(/\s+/).length || 0), 0),
        plantStage: plant.stage,
        uniqueMoods: new Set(entries.map(e => e.mood).filter(Boolean)).size,
        flowers: plant.flowers?.length || 0,
        fruits: plant.fruits?.length || 0
      };
      
      const newAchievements = checkAchievements(entries, userData);
      if (newAchievements.length > 0) {
        setNotification(newAchievements[0]);
      }
    }
  }, [entries, plant]);

  /**
   * Handle new journal entry submission
   */
  const handleNewEntry = async (content, mood) => {
    await addEntry(content, mood);
  };

  /**
   * Get stage display name
   */
  const getStageDisplayName = (stage) => {
    const stageNames = {
      seed: 'Seed',
      sprout: 'Sprout',
      plant: 'Young Plant',
      blooming: 'Blooming Plant',
      tree: 'Mature Tree',
      fruitingTree: 'Fruit-bearing Tree'
    };
    return stageNames[stage] || stageNames['seed'] || 'Seed';
  };

  /**
   * Get vitality text
   */
  const getVitalityText = (health) => {
    if (health > 80) return { text: "Thriving", emoji: "✨" };
    if (health > 60) return { text: "Growing", emoji: "🌱" };
    if (health > 40) return { text: "Resting", emoji: "💤" };
    if (health > 20) return { text: "Needs care", emoji: "💧" };
    return { text: "Dreaming", emoji: "🌙" };
  };

  if (plantLoading) {
    return (
      <div className="min-h-screen nature-gradient flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="w-20 h-20 mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Leaf className="w-full h-full text-leaf-600 dark:text-leaf-400" />
          </motion.div>
          <p className="text-earth-600 dark:text-cream-400 text-lg">Loading your garden...</p>
        </motion.div>
      </div>
    );
  }

  const encouragementMessage = getEncouragementMessage();
  const streakMessage = getStreakMessage();
  const visualState = getPlantVisualState();
  const stageProgress = getStageProgress();
  const vitality = getVitalityText(plant?.health || 0);

  return (
    <div className="min-h-screen nature-gradient transition-colors duration-300 relative overflow-hidden">
      {/* Subtle Background Particles */}
      <ParticleSystem 
        type="sparkles" 
        density={8} 
        className="pointer-events-none opacity-30"
      />
      
      {/* Achievement Notification */}
      <AnimatePresence>
        {notification && (
          <AchievementNotification
            achievement={notification}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-earth-900 dark:text-cream-100">
                Your Mind Garden
              </h1>
              <p className="text-earth-600 dark:text-cream-500 mt-1">
                {encouragementMessage?.text || "Welcome to your peaceful space"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <WeatherWidget minimal />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAchievements(true)}
                className="btn-icon"
              >
                <Award className="w-5 h-5 text-leaf-600 dark:text-leaf-400" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* === BENTO GRID LAYOUT === */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(120px,auto)]">
          
          {/* Featured Plant Card - Large */}
          <motion.div 
            className="col-span-2 row-span-2 bento-item relative overflow-hidden cursor-pointer group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => setShowPlantSelection(true)}
          >
            {/* Ambient Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full bg-leaf-500/10 blur-3xl"></div>
            </div>
            
            {/* Plant Stage Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="badge-accent">
                {getStageDisplayName(plant?.stage || 'seed')}
              </span>
            </div>

            {/* Vitality Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className="badge">
                {vitality.emoji} {vitality.text}
              </span>
            </div>
            
            {/* Plant Visual */}
            <div className="flex items-center justify-center h-full pt-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <PlantStageNew
                  stage={plant?.stage || 'seed'}
                  visualState={visualState}
                  flowers={plant?.flowers || []}
                  fruits={plant?.fruits || []}
                  specialEffects={plant?.specialEffects || []}
                  health={plant?.health || 0}
                  moodTheme={moodTheme}
                />
              </motion.div>
            </div>

            {/* Progress Bar at Bottom */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between text-xs text-earth-600 dark:text-cream-500 mb-2">
                <span>Growth Progress</span>
                <span>{Math.round(stageProgress)}%</span>
              </div>
              <div className="h-2 bg-sage-200 dark:bg-deep-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-leaf-600 to-leaf-500 dark:from-leaf-500 dark:to-leaf-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${stageProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-leaf-500/0 group-hover:bg-leaf-500/5 transition-colors rounded-3xl" />
          </motion.div>

          {/* Quick Action - Water Garden */}
          <motion.div 
            className="col-span-1 bento-item bg-gradient-to-br from-leaf-100 to-leaf-200 dark:from-leaf-700/30 dark:to-leaf-800/30 hover:from-leaf-200 hover:to-leaf-300 dark:hover:from-leaf-600/40 dark:hover:to-leaf-700/40 cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowEntryForm(true)}
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 rounded-2xl bg-leaf-200 dark:bg-leaf-500/20 mb-3 group-hover:bg-leaf-300 dark:group-hover:bg-leaf-500/30 transition-colors">
                <Plus className="w-8 h-8 text-leaf-700 dark:text-leaf-300" />
              </div>
              <p className="font-semibold text-leaf-900 dark:text-cream-100">Water Garden</p>
              <p className="text-xs text-leaf-700 dark:text-cream-500 mt-1">Add a journal entry</p>
            </div>
          </motion.div>

          {/* Focus Mode */}
          <motion.div 
            className="col-span-1 bento-item cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={enterFocusMode}
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 rounded-2xl bg-sage-100 dark:bg-deep-600 mb-3 group-hover:bg-sage-200 dark:group-hover:bg-deep-500 transition-colors">
                <Maximize2 className="w-7 h-7 text-sage-700 dark:text-cream-300" />
              </div>
              <p className="font-semibold text-earth-800 dark:text-cream-100">Focus Mode</p>
              <p className="text-xs text-earth-600 dark:text-cream-500 mt-1">Distraction-free</p>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div 
            className="col-span-1 bento-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-auto">
                <div className="p-2 rounded-xl bg-sage-100 dark:bg-deep-600">
                  <TrendingUp className="w-4 h-4 text-leaf-600 dark:text-leaf-400" />
                </div>
                <span className="text-xs text-earth-600 dark:text-cream-500">Current Streak</span>
              </div>
              <div className="mt-3">
                <p className="text-4xl font-bold text-leaf-600 dark:text-leaf-300">{plant?.currentStreak || 0}</p>
                <p className="text-xs text-earth-600 dark:text-cream-500 mt-1">
                  {plant?.currentStreak === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Entries Count */}
          <motion.div 
            className="col-span-1 bento-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-auto">
                <div className="p-2 rounded-xl bg-sage-100 dark:bg-deep-600">
                  <Droplets className="w-4 h-4 text-earth-600 dark:text-cream-400" />
                </div>
                <span className="text-xs text-earth-600 dark:text-cream-500">Total Entries</span>
              </div>
              <div className="mt-3">
                <p className="text-4xl font-bold text-earth-800 dark:text-cream-200">{plant?.totalEntries || 0}</p>
                <p className="text-xs text-earth-600 dark:text-cream-500 mt-1">reflections</p>
              </div>
            </div>
          </motion.div>

          {/* Achievements Overview */}
          <motion.div 
            className="col-span-2 bento-item cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => setShowAchievements(true)}
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-amber-100 dark:bg-gradient-to-br dark:from-yellow-600/30 dark:to-amber-700/30">
                  <Award className="w-6 h-6 text-amber-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="font-semibold text-earth-800 dark:text-cream-100">Achievements</p>
                  <p className="text-sm text-earth-600 dark:text-cream-500">
                    {unlockedAchievements.length} badges unlocked
                  </p>
                </div>
              </div>
              <div className="flex -space-x-2">
                {[...Array(Math.min(unlockedAchievements.length, 4))].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-amber-100 dark:bg-deep-500 border-2 border-amber-200 dark:border-deep-700 flex items-center justify-center text-lg">
                    🏆
                  </div>
                ))}
                {unlockedAchievements.length > 4 && (
                  <div className="w-10 h-10 rounded-full bg-sage-100 dark:bg-deep-600 border-2 border-sage-200 dark:border-deep-700 flex items-center justify-center text-xs text-earth-700 dark:text-cream-400 font-medium">
                    +{unlockedAchievements.length - 4}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Flowers & Fruits */}
          {((plant?.flowers?.length || 0) > 0 || (plant?.fruits?.length || 0) > 0) && (
            <motion.div 
              className="col-span-2 bento-item bg-gradient-to-br from-pink-50 to-rose-50 dark:from-deep-600/50 dark:to-deep-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="flex items-center gap-6">
                {(plant?.flowers?.length || 0) > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-500/20">
                      <Flower2 className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-pink-600 dark:text-pink-300">{plant.flowers.length}</p>
                      <p className="text-xs text-earth-600 dark:text-cream-500">Flowers</p>
                    </div>
                  </div>
                )}
                {(plant?.fruits?.length || 0) > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-red-100 dark:bg-red-500/20">
                      <Apple className="w-5 h-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-300">{plant.fruits.length}</p>
                      <p className="text-xs text-earth-600 dark:text-cream-500">Fruits</p>
                    </div>
                  </div>
                )}
                <div className="ml-auto flex gap-2">
                  {plant?.flowers?.slice(0, 3).map((_, i) => (
                    <span key={`f-${i}`} className="text-2xl">🌸</span>
                  ))}
                  {plant?.fruits?.slice(0, 3).map((_, i) => (
                    <span key={`fr-${i}`} className="text-2xl">🍎</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Timeline Button */}
          <motion.div 
            className="col-span-1 bento-item cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowMoodTimeline(true)}
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-3 rounded-2xl bg-sage-100 dark:bg-deep-600 mb-2 group-hover:bg-sage-200 dark:group-hover:bg-deep-500 transition-colors">
                <BarChart3 className="w-6 h-6 text-sage-700 dark:text-cream-300" />
              </div>
              <p className="font-medium text-earth-800 dark:text-cream-200 text-sm">Timeline</p>
            </div>
          </motion.div>

          {/* Challenges */}
          <motion.div 
            className="col-span-1 bento-item cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowChallenges(true)}
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-3 rounded-2xl bg-sage-100 dark:bg-deep-600 mb-2 group-hover:bg-sage-200 dark:group-hover:bg-deep-500 transition-colors">
                <Target className="w-6 h-6 text-sage-700 dark:text-cream-300" />
              </div>
              <p className="font-medium text-earth-800 dark:text-cream-200 text-sm">Challenges</p>
            </div>
          </motion.div>

          {/* Last Tended */}
          {plant?.lastEntryDate && (
            <motion.div 
              className="col-span-2 bento-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-sage-100 dark:bg-deep-600">
                  <Clock className="w-5 h-5 text-earth-600 dark:text-cream-400" />
                </div>
                <div>
                  <p className="text-sm text-earth-600 dark:text-cream-500">Last tended</p>
                  <p className="font-medium text-earth-800 dark:text-cream-200">
                    {new Date(plant.lastEntryDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {plant.daysSinceLastEntry > 0 && (
                  <p className="ml-auto text-sm text-earth-600 dark:text-cream-500 italic">
                    {plant.daysSinceLastEntry === 1 ? "Yesterday" :
                     `${plant.daysSinceLastEntry} days ago`}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Encouragement Message */}
          {encouragementMessage && (
            <motion.div 
              className="col-span-2 md:col-span-4 bento-item bg-gradient-to-r from-leaf-100 via-sage-50 to-leaf-100 dark:from-leaf-800/20 dark:via-deep-700/30 dark:to-leaf-800/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-leaf-200 dark:bg-leaf-500/20 shrink-0">
                  <Sparkles className="w-5 h-5 text-leaf-600 dark:text-leaf-400" />
                </div>
                <div>
                  <p className="font-semibold text-earth-800 dark:text-cream-100 mb-1">{encouragementMessage.title}</p>
                  <p className="text-sm text-earth-600 dark:text-cream-400 leading-relaxed">{encouragementMessage.text}</p>
                </div>
              </div>
              {streakMessage && (
                <div className="mt-4 pt-4 border-t border-sage-200 dark:border-deep-600">
                  <span className="inline-flex items-center gap-2 text-sm text-earth-700 dark:text-cream-300">
                    🔥 {streakMessage}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Journal Entry Modal */}
      <JournalEntryForm
        isOpen={showEntryForm}
        onClose={() => setShowEntryForm(false)}
        onSubmit={handleNewEntry}
        isSubmitting={submitting}
      />
      
      {/* Mood Timeline Modal */}
      <AnimatePresence>
        {showMoodTimeline && (
          <MoodTimeline
            entries={entries}
            isOpen={showMoodTimeline}
            onClose={() => setShowMoodTimeline(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Achievement Gallery Modal */}
      <AnimatePresence>
        {showAchievements && (
          <AchievementGallery
            isOpen={showAchievements}
            onClose={() => setShowAchievements(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Plant Selection Modal */}
      <AnimatePresence>
        {showPlantSelection && (
          <PlantSelectionModal
            isOpen={showPlantSelection}
            onClose={() => setShowPlantSelection(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Daily Challenges Panel */}
      <AnimatePresence>
        {showChallenges && (
          <DailyChallengesPanel
            entries={entries}
            userData={{ streak: plant?.currentStreak || 0 }}
            isOpen={showChallenges}
            onClose={() => setShowChallenges(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Focus Mode */}
      <AnimatePresence>
        {isFocusMode && (
          <FocusMode
            isOpen={isFocusMode}
            onClose={exitFocusMode}
          >
            <JournalEntryForm
              isOpen={true}
              onClose={exitFocusMode}
              onSubmit={async (content, mood) => {
                await handleNewEntry(content, mood);
                exitFocusMode();
              }}
              isSubmitting={submitting}
              focusMode={true}
            />
          </FocusMode>
        )}
      </AnimatePresence>
    </div>
  );
};

// Wrap with providers
const GardenPage = () => {
  return (
    <WeatherProvider>
      <ChallengeProvider>
        <GardenPageContent />
      </ChallengeProvider>
    </WeatherProvider>
  );
};

export default GardenPage;