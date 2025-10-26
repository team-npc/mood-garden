/**
 * Garden Page Component  
 * Main dashboard showing the user's plant and entry options
 */

import React, { useState } from 'react';
import { Plus, Calendar, TrendingUp, Award, Droplets } from 'lucide-react';
import { usePlantLogic } from '../hooks/usePlantLogic';
import { useJournal } from '../hooks/useJournal';
import PlantStageNew from '../components/PlantStageNew';
import JournalEntryForm from '../components/JournalEntryForm';

/**
 * Garden Page Component
 */
const GardenPage = () => {
  const [showEntryForm, setShowEntryForm] = useState(false);
  const { 
    plant, 
    loading: plantLoading, 
    getPlantVisualState, 
    getEncouragementMessage,
    getStreakMessage,
    getDaysUntilNextStage,
    getStageProgress
  } = usePlantLogic();
  
  const { addEntry, submitting, getPlantInsights } = useJournal();

  /**
   * Handle new journal entry submission
   * @param {string} content - Entry content
   * @param {string} mood - Selected mood
   */
  const handleNewEntry = async (content, mood) => {
    await addEntry(content, mood);
  };

  /**
   * Get health bar color based on plant health
   * @param {number} health - Plant health (0-100)
   * @returns {string} Color class
   */
  // eslint-disable-next-line no-unused-vars
  const getHealthBarColor = (health) => {
    if (health >= 70) return 'bg-green-500';
    if (health >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  /**
   * Get stage display name
   * @param {string} stage - Plant stage
   * @returns {string} Display name
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

  if (plantLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-earth-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your garden...</p>
        </div>
      </div>
    );
  }

  const encouragementMessage = getEncouragementMessage();
  const streakMessage = getStreakMessage();
  const visualState = getPlantVisualState();
  const daysUntilNext = getDaysUntilNextStage();
  const stageProgress = getStageProgress();
  // eslint-disable-next-line no-unused-vars
  const plantInsights = getPlantInsights();

  return (
    <div className="min-h-screen nature-gradient transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header with flowing animation */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3 animate-float">
            Your Mind Garden
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-balance">
            {encouragementMessage?.text || "Welcome to your peaceful space of growth"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plant Display - Central Column */}
          <div className="lg:col-span-2">
            <div className="glass-morphism rounded-2xl p-8 text-center">
              {/* Plant Visual with glow effect */}
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-sage-200/20 dark:bg-sage-800/20 rounded-full blur-3xl"></div>
                <PlantStageNew
                  stage={plant?.stage || 'seed'}
                  visualState={visualState}
                  flowers={plant?.flowers || []}
                  fruits={plant?.fruits || []}
                  specialEffects={plant?.specialEffects || []}
                  health={plant?.health || 0}
                />
              </div>

              {/* Plant Status */}
              <div className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {getStageDisplayName(plant?.stage || 'seed')}
                </h2>
                
                {encouragementMessage && (
                  <div className="bg-gradient-to-r from-sage-50 via-earth-50 to-sage-50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-2xl p-6 mb-6 border-2 border-sage-200 dark:border-sage-700 shadow-lg">
                    <h3 className="font-semibold text-sage-800 dark:text-sage-200 mb-2 text-lg">
                      {encouragementMessage.title}
                    </h3>
                    <p className="text-sage-700 dark:text-sage-300 text-base leading-relaxed">
                      {encouragementMessage.text}
                    </p>
                  </div>
                )}

                {streakMessage && (
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-earth-100 to-sage-100 dark:from-earth-900 dark:to-sage-900 text-earth-800 dark:text-earth-200 rounded-full text-sm font-medium mb-6 shadow-md border border-earth-200 dark:border-earth-700">
                    {streakMessage}
                  </div>
                )}
              </div>

              {/* Vitality Indicator - Qualitative instead of numbers */}
              <div className="mb-8">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mr-3">Plant Vitality</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((leaf) => (
                      <div
                        key={leaf}
                        className={`transition-all duration-300 ${
                          (plant?.health || 0) >= leaf * 20
                            ? 'text-green-500 scale-110'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-center italic text-gray-600 dark:text-gray-400">
                  {(plant?.health || 0) > 80 ? "Vibrant and thriving" :
                   (plant?.health || 0) > 60 ? "Growing steadily" :
                   (plant?.health || 0) > 40 ? "Resting gently" :
                   (plant?.health || 0) > 20 ? "Needs your care" :
                   "Dreaming of your return"}
                </p>
              </div>

              {/* Growth Progress - Qualitative */}
              {daysUntilNext !== null && (
                <div className="mb-8">
                  <div className="flex items-center justify-center mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Growth Journey</span>
                  </div>
                  <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-sage-400 via-earth-400 to-sage-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${stageProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400 italic">
                    {stageProgress < 30 ? "Seeds of potential are planted" :
                     stageProgress < 60 ? "New growth is emerging" :
                     stageProgress < 90 ? "Almost ready to blossom" :
                     "A beautiful transformation awaits"}
                  </p>
                </div>
              )}

              {/* New Entry Button - Enhanced */}
              <button
                onClick={() => setShowEntryForm(true)}
                className="btn-primary text-lg px-10 py-4 inline-flex items-center space-x-3 font-semibold shadow-xl"
              >
                <Plus className="w-6 h-6" />
                <span>Water Your Garden</span>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Garden Journey Stats - Qualitative */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="mr-2">🌿</span>
                Your Garden Journey
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-sage-50 dark:bg-sage-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-sage-600 dark:text-sage-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Growth Rhythm</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {plant?.currentStreak === 0 ? "Resting" :
                       plant?.currentStreak === 1 ? "Beginning again" :
                       plant?.currentStreak <= 3 ? "Finding momentum" :
                       plant?.currentStreak <= 7 ? "Flowing beautifully" :
                       plant?.currentStreak <= 14 ? "Deeply rooted" :
                       "Magnificent consistency"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-earth-50 dark:bg-earth-900/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-earth-600 dark:text-earth-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Longest Journey</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {plant?.longestStreak === 0 ? "Just beginning" :
                       plant?.longestStreak <= 3 ? "Early steps taken" :
                       plant?.longestStreak <= 7 ? "A memorable week" :
                       plant?.longestStreak <= 21 ? "Seasons of dedication" :
                       "A legendary path"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-sage-50 dark:bg-sage-900/30 rounded-lg">
                  <Droplets className="w-5 h-5 text-sage-600 dark:text-sage-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Garden Depth</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {(plant?.totalEntries || 0) === 0 ? "Soil awaits seeds" :
                       (plant?.totalEntries || 0) <= 5 ? "First seedlings" :
                       (plant?.totalEntries || 0) <= 15 ? "Growing grove" :
                       (plant?.totalEntries || 0) <= 30 ? "Flourishing garden" :
                       (plant?.totalEntries || 0) <= 50 ? "Abundant forest" :
                       "Ancient woodland"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-earth-50 dark:bg-earth-900/30 rounded-lg">
                  <Award className="w-5 h-5 text-earth-600 dark:text-earth-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Natural Rewards</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {((plant?.flowers?.length || 0) + (plant?.fruits?.length || 0)) === 0 ? "Blooms will come" :
                       ((plant?.flowers?.length || 0) + (plant?.fruits?.length || 0)) <= 3 ? "First flowers appear" :
                       ((plant?.flowers?.length || 0) + (plant?.fruits?.length || 0)) <= 8 ? "Garden in bloom" :
                       "Abundant harvest"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rewards Display - Enhanced */}
            {((plant?.flowers?.length || 0) > 0 || (plant?.fruits?.length || 0) > 0) && (
              <div className="card bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-blue-900/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <span className="mr-2">🎁</span>
                  Garden Gifts
                </h3>
                
                <div className="space-y-4">
                  {(plant?.flowers?.length || 0) > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Flowers of Dedication</p>
                      <div className="flex flex-wrap gap-3">
                        {plant.flowers.map((flower, index) => (
                          <div
                            key={index}
                            className="group relative"
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 rounded-full flex items-center justify-center text-2xl shadow-lg transform transition-transform hover:scale-125 hover:rotate-12 cursor-pointer">
                              🌸
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Earned through care
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(plant?.fruits?.length || 0) > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Fruits of Patience</p>
                      <div className="flex flex-wrap gap-3">
                        {plant.fruits.map((fruit, index) => (
                          <div
                            key={index}
                            className="group relative"
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900 dark:to-orange-900 rounded-full flex items-center justify-center text-2xl shadow-lg transform transition-transform hover:scale-125 hover:rotate-12 cursor-pointer">
                              🍎
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Fruit of persistence
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Last Tended Info - Poetic */}
            {plant?.lastEntryDate && (
              <div className="card bg-gradient-to-br from-sage-50 to-earth-50 dark:from-sage-900/30 dark:to-earth-900/30">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <span className="mr-2">💧</span>
                  Last Tended
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {new Date(plant.lastEntryDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                
                {plant.daysSinceLastEntry > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                    {plant.daysSinceLastEntry === 1 ? "Yesterday's care still lingers" :
                     plant.daysSinceLastEntry <= 3 ? "Your garden remembers you fondly" :
                     plant.daysSinceLastEntry <= 7 ? "The soil awaits your return" :
                     "Your garden dreams of your words"}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Journal Entry Modal */}
      <JournalEntryForm
        isOpen={showEntryForm}
        onClose={() => setShowEntryForm(false)}
        onSubmit={handleNewEntry}
        isSubmitting={submitting}
      />
    </div>
  );
};

export default GardenPage;