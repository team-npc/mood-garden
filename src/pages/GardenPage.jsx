/**
 * Garden Page Component  
 * Main dashboard showing the user's plant and entry options
 */

import React, { useState } from 'react';
import { Plus, Calendar, TrendingUp, Award, Droplets } from 'lucide-react';
import { usePlantLogic } from '../hooks/usePlantLogic';
import { useJournal } from '../hooks/useJournal';
import PlantStage from '../components/PlantStage';
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
    return stageNames[stage] || 'Unknown';
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
  const plantInsights = getPlantInsights();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-earth-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Your Mind Garden
          </h1>
          <p className="text-gray-600">
            {encouragementMessage?.text || "Welcome to your peaceful space of growth"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plant Display - Central Column */}
          <div className="lg:col-span-2">
            <div className="card text-center">
              {/* Plant Visual */}
              <div className="mb-6">
                <PlantStage
                  stage={plant?.stage}
                  visualState={visualState}
                  flowers={plant?.flowers || []}
                  fruits={plant?.fruits || []}
                  specialEffects={plant?.specialEffects || []}
                  health={plant?.health || 0}
                />
              </div>

              {/* Plant Status */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {getStageDisplayName(plant?.stage)}
                </h2>
                
                {encouragementMessage && (
                  <div className="bg-sage-50 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-sage-800 mb-1">
                      {encouragementMessage.title}
                    </h3>
                    <p className="text-sage-700 text-sm">
                      {encouragementMessage.text}
                    </p>
                  </div>
                )}

                {streakMessage && (
                  <div className="inline-flex items-center px-3 py-1 bg-earth-100 text-earth-800 rounded-full text-sm font-medium mb-4">
                    {streakMessage}
                  </div>
                )}
              </div>

              {/* Health Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Plant Vitality</span>
                  <span>{plant?.health || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${getHealthBarColor(plant?.health || 0)}`}
                    style={{ width: `${plant?.health || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Growth Progress */}
              {daysUntilNext !== null && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Growth Progress</span>
                    <span>{daysUntilNext} entries until next stage</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-sage-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stageProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* New Entry Button */}
              <button
                onClick={() => setShowEntryForm(true)}
                className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>New Journal Entry</span>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Garden Statistics
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Current Streak</span>
                  </div>
                  <span className="font-medium">{plant?.currentStreak || 0} days</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Longest Streak</span>
                  </div>
                  <span className="font-medium">{plant?.longestStreak || 0} days</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Total Entries</span>
                  </div>
                  <span className="font-medium">{plant?.totalEntries || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Rewards Earned</span>
                  </div>
                  <span className="font-medium">
                    {(plant?.flowers?.length || 0) + (plant?.fruits?.length || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Rewards Display */}
            {((plant?.flowers?.length || 0) > 0 || (plant?.fruits?.length || 0) > 0) && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Rewards
                </h3>
                
                <div className="space-y-3">
                  {(plant?.flowers?.length || 0) > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Flowers Earned</p>
                      <div className="flex flex-wrap gap-2">
                        {plant.flowers.map((flower, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-lg"
                            title={`${flower.type} flower - ${flower.streak} day streak`}
                          >
                            🌸
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(plant?.fruits?.length || 0) > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Fruits Earned</p>
                      <div className="flex flex-wrap gap-2">
                        {plant.fruits.map((fruit, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-lg"
                            title={`${fruit.type} fruit - ${fruit.streak} day streak`}
                          >
                            🍎
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Last Entry Info */}
            {plant?.lastEntryDate && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Last Watered
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(plant.lastEntryDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                
                {plant.daysSinceLastEntry > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {plant.daysSinceLastEntry} day{plant.daysSinceLastEntry !== 1 ? 's' : ''} ago
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