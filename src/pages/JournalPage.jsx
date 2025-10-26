/**
 * Journal Page Component
 * Displays journal entries history and statistics
 */

import React, { useState } from 'react';
import { Plus, Search, Calendar, BarChart3, Filter } from 'lucide-react';
import { useJournal } from '../hooks/useJournal';
import JournalEntryItem from '../components/JournalEntryItem';
import JournalEntryForm from '../components/JournalEntryForm';

/**
 * Journal Page Component
 */
const JournalPage = () => {
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStats, setShowStats] = useState(false);
  
  const { 
    entries, 
    loading, 
    addEntry, 
    submitting, 
    getPlantInsights, 
    getEntriesByDate,
    formatEntryDate,
    getMoodGarden
  } = useJournal();

  /**
   * Handle new journal entry submission
   * @param {string} content - Entry content
   * @param {string} mood - Selected mood
   */
  const handleNewEntry = async (content, mood) => {
    await addEntry(content, mood);
  };

  /**
   * Filter entries based on search term
   * @param {Array} entries - Journal entries
   * @returns {Array} Filtered entries
   */
  const filteredEntries = entries.filter(entry =>
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const plantInsights = getPlantInsights();
  const moodGarden = getMoodGarden();
  const entriesByDate = getEntriesByDate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-earth-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen nature-gradient transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header - Enhanced */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Your Sacred Journal
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Every word plants a seed of wisdom
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setShowStats(!showStats)}
              className="btn-secondary inline-flex items-center space-x-2 shadow-lg"
            >
              <BarChart3 className="w-5 h-5" />
              <span>{showStats ? 'Hide' : 'Show'} Garden Insights</span>
            </button>
            
            <button
              onClick={() => setShowEntryForm(true)}
              className="btn-primary inline-flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Plant a Thought</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="card mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search your entries..."
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Plant Insights Panel (when visible) - Enhanced */}
            {showStats && (
              <div className="glass-morphism rounded-2xl p-8 mb-8 border-2 border-sage-200 dark:border-sage-800">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                  <span className="mr-3 text-3xl">🌱</span>
                  Garden Insights
                </h2>
                
                {/* Plant Status - Poetic */}
                <div className="bg-gradient-to-r from-sage-50 via-earth-50 to-sage-50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-2xl p-8 mb-8 shadow-inner">
                  <div className="text-center">
                    <div className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-3 leading-relaxed">
                      {plantInsights.plantMessage}
                    </div>
                    <div className="text-lg text-sage-700 dark:text-sage-300 italic font-serif">
                      "{plantInsights.encouragement}"
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <div className="inline-flex items-center px-5 py-2 rounded-full text-base bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-sage-200 dark:border-sage-700">
                      <span className="mr-2 text-xl">
                        {plantInsights.growthPhase === 'blooming' ? '🌸' :
                         plantInsights.growthPhase === 'developing' ? '🌿' :
                         plantInsights.growthPhase === 'sprouting' ? '🌱' :
                         '✨'}
                      </span>
                      <span className="font-medium capitalize">{plantInsights.growthPhase}</span>
                    </div>
                  </div>
                </div>

                {/* Activity & Mood Garden - Visual */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center text-lg">
                      <span className="mr-2">🌿</span>
                      Garden Activity
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full shadow-lg ${
                          plantInsights.recentActivity === 'flourishing' ? 'bg-green-500 animate-pulse' :
                          plantInsights.recentActivity === 'growing' ? 'bg-sage-500' :
                          plantInsights.recentActivity === 'budding' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`}></div>
                        <span className="text-base text-gray-700 dark:text-gray-300 capitalize font-medium">
                          {plantInsights.recentActivity}
                        </span>
                      </div>
                      
                      {plantInsights.hasRecentEntries && (
                        <div className="text-sm text-sage-700 dark:text-sage-300 bg-sage-50 dark:bg-sage-900/30 rounded-xl p-4 italic border-l-4 border-sage-400">
                          Your garden shows signs of regular tending and care
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center text-lg">
                      <span className="mr-2">🎨</span>
                      Emotional Palette
                    </h3>
                    <div className="space-y-4">
                      <div className="text-base text-gray-700 dark:text-gray-300">
                        {moodGarden.gardenMessage}
                      </div>
                      
                      {moodGarden.colorfulEntries && (
                        <div className="flex flex-wrap gap-2">
                          {moodGarden.recentMoods?.map((mood, index) => (
                            <span key={index} className="text-3xl transform hover:scale-125 transition-transform cursor-pointer">
                              {mood}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-sm text-sage-700 dark:text-sage-300 italic">
                        {moodGarden.suggestion}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Entries List */}
            {filteredEntries.length === 0 ? (
              <div className="card text-center py-12">
                {searchTerm ? (
                  <>
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No entries found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search term or clear the search to see all entries.
                    </p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="btn-secondary"
                    >
                      Clear Search
                    </button>
                  </>
                ) : (
                  <>
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Your journal is waiting
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start your mindful journey by writing your first entry.
                    </p>
                    <button
                      onClick={() => setShowEntryForm(true)}
                      className="btn-primary"
                    >
                      Write Your First Entry
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(entriesByDate)
                  .filter(([date, dateEntries]) => 
                    dateEntries.some(entry => 
                      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                  )
                  .map(([date, dateEntries]) => (
                    <div key={date}>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {date}
                      </h2>
                      <div className="space-y-4">
                        {dateEntries
                          .filter(entry => 
                            entry.content.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map(entry => (
                            <JournalEntryItem key={entry.id} entry={entry} />
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowEntryForm(true)}
                  className="w-full btn-primary text-left"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  New Entry
                </button>
                <button
                  onClick={() => setSearchTerm('')}
                  className="w-full btn-secondary text-left"
                >
                  <Search className="w-4 h-4 inline mr-2" />
                  Show All Entries
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            {entries.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {entries.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="border-l-4 border-sage-200 pl-3">
                      <div className="flex items-center space-x-2 mb-1">
                        {entry.mood && <span className="text-sm">{entry.mood}</span>}
                        <span className="text-xs text-gray-500">
                          {formatEntryDate(entry.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {entry.content.length > 80 
                          ? entry.content.substring(0, 80) + '...'
                          : entry.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Writing Tips */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Writing Inspiration
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="p-3 bg-sage-50 rounded-lg">
                  <p className="font-medium text-sage-800 mb-1">Daily Reflection</p>
                  <p>What brought you joy today?</p>
                </div>
                <div className="p-3 bg-earth-50 rounded-lg">
                  <p className="font-medium text-earth-800 mb-1">Mindful Moment</p>
                  <p>Describe a moment when you felt truly present.</p>
                </div>
                <div className="p-3 bg-sage-50 rounded-lg">
                  <p className="font-medium text-sage-800 mb-1">Growth Edge</p>
                  <p>What's one thing you learned about yourself recently?</p>
                </div>
              </div>
            </div>
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

export default JournalPage;