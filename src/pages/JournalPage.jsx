/**
 * Journal Page Component
 * Displays journal entries history and statistics
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Search, Calendar, BarChart3, Download, Sliders, HelpCircle, Heart, Folder, Upload, SortAsc, BookOpen, Bell, Lightbulb } from 'lucide-react';
import { useJournal } from '../hooks/useJournal';
import { useGlobalKeyboardShortcuts } from '../hooks/useGlobalKeyboardShortcuts';
import JournalEntryItem from '../components/JournalEntryItem';
import JournalEntryForm from '../components/JournalEntryForm';
import WritingInspiration from '../components/WritingInspiration';
import AdvancedFilterPanel from '../components/AdvancedFilterPanel';
import KeyboardShortcutsModal from '../components/KeyboardShortcutsModal';
import CalendarView from '../components/CalendarView';
import WellnessInsights from '../components/WellnessInsights';
import MoodStatsDashboard from '../components/MoodStatsDashboard';
import SmartCollections from '../components/SmartCollections';
import ImportEntries from '../components/ImportEntries';
import ReflectionMode from '../components/ReflectionMode';
import ScheduledReminders from '../components/ScheduledReminders';
import EntryRecommendations from '../components/EntryRecommendations';
import ShareEntryModal from '../components/ShareEntryModal';
import { GardenLoader } from '../components/LazyLoading';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { exportAsJSON, exportAsCSV, exportAsText } from '../utils/exportData';
import { fullTextSearch, applyAdvancedFilters, getHashtagSuggestions } from '../utils/searchUtils';
import { generateWellnessSummary } from '../utils/wellnessUtils';
import { sortEntries, SORT_OPTIONS, detectDuplicateEntry } from '../utils/collectionsUtils';

/**
 * Journal Page Component
 */
const JournalPage = () => {
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [showStats, setShowStats] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportRange, setExportRange] = useState('all');
  const [prefillContent, setPrefillContent] = useState('');
  const [entryPendingDelete, setEntryPendingDelete] = useState(null);
  const [selectedExportMood, setSelectedExportMood] = useState('all');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'pinned', 'archived'
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtagSuggestions, setHashtagSuggestions] = useState([]);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [showWellnessInsights, setShowWellnessInsights] = useState(false);
  const [showMoodStats, setShowMoodStats] = useState(false);
  const [showSmartCollections, setShowSmartCollections] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showReflectionMode, setShowReflectionMode] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [shareEntry, setShareEntry] = useState(null);
  const [currentSort, setCurrentSort] = useState('date-desc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();
  const exportMenuRef = useRef(null);
  const sortMenuRef = useRef(null);
  
  const {
    entries, 
    loading, 
    loadingMore,
    hasMoreEntries,
    addEntry, 
    submitting,
    loadMoreEntries,
    loadAllEntries,
    getPlantInsights, 
    updateEntry,
    deleteEntry,
    deleteEntryWithUndo,
    restoreEntry,
    retryMutation,
    togglePin,
    failedMutations,
    getEntriesByDate,
    formatEntryDate,
    getMoodGarden,
    selectedEntries,
    toggleSelectEntry,
    toggleSelectAll,
    bulkDelete,
    bulkArchive,
    archiveEntryFn,
    restoreArchivedEntry,
    archivedEntries,
    togglePrivacy
  } = useJournal();

  // Global keyboard shortcuts (must be after useJournal to access submitting)
  useGlobalKeyboardShortcuts({
    onNewEntry: () => {
      setPrefillContent('');
      setShowEntryForm(true);
    },
    onClose: () => {
      if (showEntryForm) setShowEntryForm(false);
      if (showAdvancedFilter) setShowAdvancedFilter(false);
      if (showKeyboardShortcuts) setShowKeyboardShortcuts(false);
      if (showCalendarView) setShowCalendarView(false);
    },
    enabled: !submitting
  });

  /**
   * Close export menu when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  /**
   * Handle new journal entry submission
   * @param {string} content - Entry content
   * @param {string} mood - Selected mood
   */
  const handleNewEntry = async (content, mood, tags = []) => {
    try {
      await addEntry(content, mood, tags);
      addToast({
        type: 'success',
        title: 'Entry Saved',
        message: 'Your thoughts have been added to your journal.'
      });
    } catch (error) {
      const mutationId = `add-${Date.now()}`;
      const failedMutation = failedMutations.find(m => m.id === mutationId);

      addToast({
        type: 'error',
        title: 'Save Failed',
        message: error.message || 'Could not save this entry.',
        action: failedMutation ? {
          label: 'Retry',
          callback: async () => {
            try {
              await retryMutation(mutationId);
              addToast({
                type: 'success',
                title: 'Entry Saved',
                message: 'Your entry has been saved.'
              });
            } catch (retryError) {
              addToast({
                type: 'error',
                title: 'Retry Failed',
                message: retryError.message || 'Please try again.'
              });
            }
          }
        } : undefined
      });
    }
  };

  const handleEditEntry = async (entryId, content, mood, tags = []) => {
    try {
      await updateEntry(entryId, content, mood, tags);
      addToast({
        type: 'success',
        title: 'Entry Updated',
        message: 'Your journal entry has been updated.'
      });
    } catch (error) {
      const mutationId = `update-${entryId}`;
      const failedMutation = failedMutations.find(m => m.id === mutationId);
      
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Could not update this entry.',
        action: failedMutation ? {
          label: 'Retry',
          callback: async () => {
            try {
              await retryMutation(mutationId);
              addToast({
                type: 'success',
                title: 'Update Succeeded',
                message: 'Your entry has been updated.'
              });
            } catch (retryError) {
              addToast({
                type: 'error',
                title: 'Retry Failed',
                message: retryError.message || 'Please try again.'
              });
            }
          }
        } : undefined
      });
    }
  };

  const handleDeleteEntry = (entryId) => {
    setEntryPendingDelete(entryId);
  };

  const handlePinToggle = async (entryId) => {
    try {
      await togglePin(entryId);
      const entry = entries.find(e => e.id === entryId);
      addToast({
        type: 'success',
        title: entry?.isPinned ? 'Pinned' : 'Unpinned',
        message: entry?.isPinned ? 'Entry added to favorites' : 'Entry removed from favorites'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Pin Failed',
        message: error.message || 'Could not update pin status'
      });
    }
  };

  /**
   * Handle bulk delete of selected entries
   */
  const handleBulkDelete = async () => {
    if (selectedEntries.length === 0) return;
    if (!window.confirm(`Delete ${selectedEntries.length} selected entries?`)) return;

    try {
      await bulkDelete();
      addToast({
        type: 'success',
        title: 'Entries Deleted',
        message: `${selectedEntries.length} entries have been deleted.`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: error.message || 'Could not delete selected entries'
      });
    }
  };

  /**
   * Handle bulk archive of selected entries
   */
  const handleBulkArchive = async () => {
    if (selectedEntries.length === 0) return;
    if (!window.confirm(`Archive ${selectedEntries.length} selected entries?`)) return;

    try {
      await bulkArchive();
      addToast({
        type: 'success',
        title: 'Entries Archived',
        message: `${selectedEntries.length} entries have been archived.`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Archive Failed',
        message: error.message || 'Could not archive selected entries'
      });
    }
  };

  /**
   * Handle hashtag/tag input for autocomplete
   */
  const handleHashtagInput = (value) => {
    setHashtagInput(value);
    if (value.startsWith('#')) {
      const suggestions = getHashtagSuggestions(value, availableTags, 8);
      setHashtagSuggestions(suggestions);
    } else {
      setHashtagSuggestions([]);
    }
  };

  /**
   * Apply advanced filters
   */
  const handleApplyAdvancedFilters = (filters) => {
    setAdvancedFilters(filters);
  };

  /**
   * Handle privacy toggle
   */
  const handlePrivacyToggle = async (entryId) => {
    try {
      await togglePrivacy(entryId);
      const entry = entries.find(e => e.id === entryId);
      addToast({
        type: 'success',
        title: entry?.isPrivate ? 'Entry is now private' : 'Entry is now public',
        message: entry?.isPrivate ? 'Only you can see this entry' : 'This entry is visible in your journal'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Privacy Update Failed',
        message: error.message || 'Could not update privacy status'
      });
    }
  };

  /**
   * Handle archive action for entry
   */
  const handleArchiveEntry = async (entryId) => {
    try {
      await archiveEntryFn(entryId);
      addToast({
        type: 'success',
        title: 'Entry Archived',
        message: 'The entry has been moved to archive.'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Archive Failed',
        message: error.message || 'Could not archive entry'
      });
    }
  };

  /**
   * Handle restore action for archived entry
   */
  const handleRestoreEntry = async (entryId) => {
    try {
      await restoreArchivedEntry(entryId);
      addToast({
        type: 'success',
        title: 'Entry Restored',
        message: 'The entry has been restored from archive.'
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Restore Failed',
        message: error.message || 'Could not restore entry'
      });
    }
  };

  /**
   * Handle calendar date selection - filters entries to selected date
   */
  const handleCalendarDateSelect = (date) => {
    if (date) {
      // Format date for filtering
      const dateStr = date.toISOString().split('T')[0];
      setAdvancedFilters(prev => ({
        ...prev,
        dateFrom: dateStr,
        dateTo: dateStr
      }));
      setShowCalendarView(false);
      addToast({
        type: 'info',
        title: 'Date Selected',
        message: `Showing entries from ${date.toLocaleDateString()}`
      });
    }
  };

  const confirmDeleteEntry = async () => {
    if (!entryPendingDelete) return;
    try {
      const { undoFunc } = await deleteEntryWithUndo(entryPendingDelete);
      
      // Show toast with undo action
      addToast({
        type: 'success',
        title: 'Entry Deleted',
        message: 'The journal entry has been removed.',
        action: {
          label: 'Undo',
          callback: async () => {
            try {
              await undoFunc();
              addToast({
                type: 'info',
                title: 'Restored',
                message: 'Your entry has been restored.'
              });
            } catch (error) {
              console.error('Error restoring entry:', error);
            }
          }
        }
      });
      setEntryPendingDelete(null);
    } catch (error) {
      const mutationId = `delete-${entryPendingDelete}`;
      const failedMutation = failedMutations.find(m => m.id === mutationId);

      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: error.message || 'Could not delete this entry.',
        action: failedMutation ? {
          label: 'Retry',
          callback: async () => {
            try {
              const { undoFunc } = await deleteEntryWithUndo(entryPendingDelete);
              addToast({
                type: 'success',
                title: 'Entry Deleted',
                message: 'The journal entry has been removed.',
                action: {
                  label: 'Undo',
                  callback: undoFunc
                }
              });
            } catch (retryError) {
              addToast({
                type: 'error',
                title: 'Retry Failed',
                message: retryError.message || 'Please try again.'
              });
            }
          }
        } : undefined
      });
    }
  };

  /**
   * Filter entries based on export range preference and mood
   * @param {Array} allEntries - All journal entries
   * @returns {Array} Entries in selected date range and mood
   */
  const getEntriesForRange = (allEntries) => {
    let filtered = allEntries;

    // Apply date range filter
    if (exportRange !== 'all') {
      const days = exportRange === '7d' ? 7 : 30;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);

      filtered = filtered.filter((entry) => {
        const entryDate = entry.createdAt?.toDate
          ? entry.createdAt.toDate()
          : new Date(entry.createdAt);
        return entryDate >= cutoff;
      });
    }

    // Apply mood filter
    if (selectedExportMood !== 'all') {
      filtered = filtered.filter((entry) => entry.mood === selectedExportMood);
    }

    return filtered;
  };

  /**
   * Export all journal data as JSON
   */
  const handleExportData = async (format = 'json') => {
    try {
      setIsExporting(true);
      let success = false;
      const allEntries = await loadAllEntries();
      const entriesToExport = getEntriesForRange(allEntries);

      if (entriesToExport.length === 0) {
        addToast({
          type: 'warning',
          title: 'No Entries in Range',
          message: 'Try selecting a wider export range.'
        });
        setShowExportMenu(false);
        return;
      }
      
      switch (format) {
        case 'json':
          success = exportAsJSON(user, entriesToExport);
          break;
        case 'csv':
          success = exportAsCSV(user, entriesToExport);
          break;
        case 'txt':
          success = exportAsText(user, entriesToExport);
          break;
        default:
          success = exportAsJSON(user, entriesToExport);
      }

      if (success) {
        addToast({
          type: 'success',
          title: 'Export Complete',
          message: `${entriesToExport.length} entries exported as ${format.toUpperCase()}.`
        });
      } else {
        addToast({
          type: 'error',
          title: 'Export Failed',
          message: 'Failed to export data. Please try again.'
        });
      }
      
      setShowExportMenu(false);
    } catch (error) {
      console.error('Error exporting data:', error);
      addToast({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export data. Please try again.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Filter entries based on search term, tags, pin status, and view mode
   * @param {Array} entries - Journal entries
   * @returns {Array} Filtered entries
   */
  const entriesToDisplay = viewMode === 'archived' ? archivedEntries : entries;
  
  // Apply all filters in sequence
  let filteredEntries = entriesToDisplay
    .filter(entry =>
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
      && (selectedTag === 'all' || (entry.tags || []).includes(selectedTag))
      && (viewMode !== 'pinned' || entry.isPinned)
    );

  // Apply full-text search
  if (searchTerm.trim()) {
    filteredEntries = fullTextSearch(filteredEntries, searchTerm);
  }

  // Apply advanced filters
  if (Object.keys(advancedFilters).length > 0) {
    filteredEntries = applyAdvancedFilters(filteredEntries, advancedFilters);
  }

  // Apply sorting
  filteredEntries = sortEntries(filteredEntries, currentSort);

  const availableTags = [...new Set(
    entries.flatMap((entry) => entry.tags || [])
  )].sort();

  const availableMoods = [...new Set(
    entries.filter((entry) => entry.mood).map((entry) => entry.mood)
  )].sort();

  const plantInsights = getPlantInsights();
  const moodGarden = getMoodGarden();
  
  // Generate wellness summary
  const wellnessSummary = generateWellnessSummary(entries);
  
  // Recompute entriesByDate based on filtered entries
  const entriesByDateForView = () => {
    const grouped = {};
    filteredEntries.forEach(entry => {
      const date = new Date(entry.createdAt);
      const dateKey = date.toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(entry);
    });
    return grouped;
  };
  
  const entriesByDate = entriesByDateForView();

  if (loading) {
    return <GardenLoader message="Loading your journal..." size="large" fullScreen={true} />;
  }

  return (
    <div className="min-h-screen nature-gradient transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header - Compact & Clean */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            {/* Title Section */}
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-earth-800 dark:text-cream-100 mb-2">
                Your Sacred Journal
              </h1>
              <p className="text-lg text-earth-600 dark:text-cream-400">
                Every word plants a seed of wisdom
              </p>
            </div>
            
            {/* Primary Action */}
            <button
              onClick={() => {
                setPrefillContent('');
                setShowEntryForm(true);
              }}
              className="btn-primary inline-flex items-center space-x-2 shadow-lg text-lg px-6 py-3 self-start lg:self-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Plant a Thought</span>
            </button>
          </div>
          
          {/* Toolbar - Organized in Categories */}
          <div className="mt-6 flex flex-wrap gap-2">
            {/* Data & Export */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="btn-secondary inline-flex items-center space-x-2 text-sm"
                title="Export your journal data"
                disabled={isExporting}
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
              </button>
              
              {showExportMenu && (
                <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-deep-700 rounded-xl shadow-xl border border-sage-200 dark:border-deep-500 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-sage-200 dark:border-deep-500">
                      <p className="text-xs font-semibold text-earth-600 dark:text-cream-500 mb-2">Date Range</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setExportRange('all')}
                          className={`text-xs px-2 py-1 rounded ${exportRange === 'all' ? 'bg-leaf-100 dark:bg-leaf-600/40 text-leaf-700 dark:text-leaf-300' : 'bg-sage-100 dark:bg-deep-600 text-earth-600 dark:text-cream-400'}`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setExportRange('30d')}
                          className={`text-xs px-2 py-1 rounded ${exportRange === '30d' ? 'bg-leaf-100 dark:bg-leaf-600/40 text-leaf-700 dark:text-leaf-300' : 'bg-sage-100 dark:bg-deep-600 text-earth-600 dark:text-cream-400'}`}
                        >
                          30d
                        </button>
                        <button
                          onClick={() => setExportRange('7d')}
                          className={`text-xs px-2 py-1 rounded ${exportRange === '7d' ? 'bg-leaf-100 dark:bg-leaf-600/40 text-leaf-700 dark:text-leaf-300' : 'bg-sage-100 dark:bg-deep-600 text-earth-600 dark:text-cream-400'}`}
                        >
                          7d
                        </button>
                      </div>
                    </div>
                    
                    <div className="px-4 py-2 border-b border-sage-200 dark:border-deep-500">
                      <p className="text-xs font-semibold text-earth-600 dark:text-cream-500 mb-2">Mood Filter</p>
                      <select
                        value={selectedExportMood}
                        onChange={(e) => setSelectedExportMood(e.target.value)}
                        className="w-full text-xs px-2 py-1 border border-sage-200 dark:border-deep-500 rounded bg-white dark:bg-deep-600 text-earth-700 dark:text-cream-200"
                      >
                        <option value="all">All Moods</option>
                        {availableMoods && availableMoods.length > 0 ? (
                          availableMoods.map((mood) => (
                            <option key={mood} value={mood}>{mood} Entries</option>
                          ))
                        ) : null}
                      </select>
                    </div>

                    <button
                      onClick={() => handleExportData('json')}
                      className="w-full text-left px-4 py-2 text-sm text-earth-700 dark:text-cream-300 hover:bg-sage-100 dark:hover:bg-deep-600 transition-colors"
                    >
                      📄 Export as JSON
                    </button>
                    <button
                      onClick={() => handleExportData('csv')}
                      className="w-full text-left px-4 py-2 text-sm text-earth-700 dark:text-cream-300 hover:bg-sage-100 dark:hover:bg-deep-600 transition-colors"
                    >
                      📊 Export as CSV
                    </button>
                    <button
                      onClick={() => handleExportData('txt')}
                      className="w-full text-left px-4 py-2 text-sm text-earth-700 dark:text-cream-300 hover:bg-sage-100 dark:hover:bg-deep-600 transition-colors"
                    >
                      📝 Export as Text
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowStats(!showStats)}
              className="btn-secondary inline-flex items-center space-x-2 text-sm"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{showStats ? 'Hide' : 'Show'} Insights</span>
            </button>

            <button
              onClick={() => setShowWellnessInsights(true)}
              className="btn-secondary inline-flex items-center space-x-2 text-sm"
            >
              <Heart className="w-4 h-4" />
              <span>💚 Wellness</span>
            </button>
            
            <button
              onClick={() => setShowCalendarView(true)}
              className="btn-secondary inline-flex items-center space-x-2 text-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>📆 Calendar</span>
            </button>

            <button
              onClick={() => setShowKeyboardShortcuts(true)}
              className="btn-secondary inline-flex items-center space-x-2 text-sm"
            >
              <HelpCircle className="w-4 h-4" />
              <span>⌨️ Shortcuts</span>
            </button>

            <button
              onClick={() => setShowMoodStats(true)}
              className="btn-secondary inline-flex items-center space-x-2 text-sm"
              title="View mood statistics"
            >
              <BarChart3 className="w-4 h-4" />
              <span>📊 Stats</span>
            </button>

            <button
              onClick={() => setShowSmartCollections(true)}
              className="btn-secondary inline-flex items-center space-x-2 text-sm"
              title="View smart collections"
            >
              <Folder className="w-4 h-4" />
              <span>📁 Collections</span>
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="btn-secondary inline-flex items-center space-x-2 text-sm"
              title="Import entries from file"
            >
              <Upload className="w-4 h-4" />
              <span>📥 Import</span>
            </button>

            <button
              onClick={() => setShowReflectionMode(true)}
              className="btn-secondary inline-flex items-center space-x-2 text-sm"
              title="Read your entries in reflection mode"
            >
              <BookOpen className="w-4 h-4" />
              <span>📖 Reflect</span>
            </button>

            <button
              onClick={() => setShowReminders(true)}
              className="btn-secondary inline-flex items-center space-x-2 text-sm"
              title="Set journaling reminders"
            >
              <Bell className="w-4 h-4" />
              <span>🔔 Reminders</span>
            </button>

            <button
              onClick={() => setShowRecommendations(true)}
              className="btn-secondary inline-flex items-center space-x-2 text-sm"
              title="Get writing recommendations"
            >
              <Lightbulb className="w-4 h-4" />
              <span>💡 Ideas</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="bento-item p-5 mb-6">
              <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cream-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search your entries... (try #hashtag)"
                    className="input-field pl-10"
                  />
                  {/* Hashtag Suggestions */}
                  {hashtagSuggestions.length > 0 && (
                    <div className="absolute top-full mt-1 left-0 bg-deep-700 border border-deep-500 rounded-xl shadow-lg z-10 w-full">
                      {hashtagSuggestions.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSelectedTag(tag);
                            setHashtagInput('');
                            setHashtagSuggestions([]);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-deep-600 transition-colors text-sm text-cream-300"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="input-field md:max-w-[220px]"
                >
                  <option value="all">All Tags</option>
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>#{tag}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowAdvancedFilter(true)}
                  className="flex items-center space-x-2 btn-primary"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                
                {/* Sort Dropdown */}
                <div className="relative" ref={sortMenuRef}>
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center space-x-2 btn-secondary"
                    title="Sort entries"
                  >
                    <SortAsc className="w-4 h-4" />
                    <span>Sort</span>
                  </button>
                  
                  {showSortMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-deep-700 border border-deep-500 rounded-xl shadow-lg z-20 min-w-[180px]">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setCurrentSort(option.id);
                            setShowSortMenu(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center space-x-2 ${
                            currentSort === option.id 
                              ? 'bg-leaf-600/30 text-leaf-300' 
                              : 'text-cream-300 hover:bg-deep-600'
                          }`}
                        >
                          <span>{option.icon}</span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Plant Insights Panel (when visible) - Enhanced */}
            {showStats && (
              <div className="bento-item p-8 mb-8 border-2 border-leaf-300 dark:border-leaf-700/50">
                <h2 className="text-2xl font-semibold text-earth-800 dark:text-cream-100 mb-6 flex items-center">
                  <span className="mr-3 text-3xl">🌱</span>
                  Garden Insights
                </h2>
                
                {/* Plant Status - Poetic */}
                <div className="bg-gradient-to-r from-sage-100 via-sage-50 to-sage-100 dark:from-deep-600 dark:via-deep-700 dark:to-deep-600 rounded-2xl p-8 mb-8 shadow-inner border border-sage-200 dark:border-deep-500">
                  <div className="text-center">
                    <div className="text-2xl font-medium text-earth-800 dark:text-cream-100 mb-3 leading-relaxed">
                      {plantInsights.plantMessage}
                    </div>
                    <div className="text-lg text-leaf-600 dark:text-leaf-400 italic font-serif">
                      "{plantInsights.encouragement}"
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <div className="inline-flex items-center px-5 py-2 rounded-full text-base bg-white/70 dark:bg-deep-700/70 backdrop-blur-sm shadow-md border border-leaf-300 dark:border-leaf-600/30">
                      <span className="mr-2 text-xl">
                        {plantInsights.growthPhase === 'blooming' ? '🌸' :
                         plantInsights.growthPhase === 'developing' ? '🌿' :
                         plantInsights.growthPhase === 'sprouting' ? '🌱' :
                         '✨'}
                      </span>
                      <span className="font-medium capitalize text-earth-700 dark:text-cream-200">{plantInsights.growthPhase}</span>
                    </div>
                  </div>
                </div>

                {/* Activity & Mood Garden - Visual */}
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Streak Counter */}
                  <div>
                    <h3 className="font-semibold text-earth-800 dark:text-cream-100 mb-4 flex items-center text-lg">
                      <span className="mr-2">🔥</span>
                      Journaling Streak
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-sage-100 to-sage-200 dark:from-deep-600 dark:to-deep-700 rounded-xl p-6 border border-sage-300 dark:border-leaf-700/30">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-leaf-600 dark:text-leaf-400 mb-2">
                            {plantInsights.currentStreak || 0}
                          </div>
                          <div className="text-sm text-earth-600 dark:text-cream-400 font-medium">
                            {plantInsights.currentStreak === 1 ? 'Day streak' : 'Days in a row'}
                          </div>
                        </div>
                      </div>
                      
                      {plantInsights.longestStreak > 1 && (
                        <div className="text-sm text-leaf-700 dark:text-leaf-400 bg-leaf-100 dark:bg-leaf-900/30 rounded-lg p-3 text-center border-l-4 border-leaf-500">
                          <div className="font-medium">Personal Best</div>
                          <div className="text-lg">{plantInsights.longestStreak} days</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-earth-800 dark:text-cream-100 mb-4 flex items-center text-lg">
                      <span className="mr-2">🌿</span>
                      Garden Activity
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full shadow-lg ${
                          plantInsights.recentActivity === 'flourishing' ? 'bg-leaf-500 animate-pulse' :
                          plantInsights.recentActivity === 'growing' ? 'bg-leaf-600' :
                          plantInsights.recentActivity === 'budding' ? 'bg-leaf-700' :
                          'bg-cream-600'
                        }`}></div>
                        <span className="text-base text-earth-700 dark:text-cream-300 capitalize font-medium">
                          {plantInsights.recentActivity}
                        </span>
                      </div>
                      
                      {plantInsights.hasRecentEntries && (
                        <div className="text-sm text-leaf-700 dark:text-leaf-400 bg-leaf-100 dark:bg-leaf-900/30 rounded-xl p-4 italic border-l-4 border-leaf-500">
                          Your garden shows signs of regular tending and care
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-earth-800 dark:text-cream-100 mb-4 flex items-center text-lg">
                      <span className="mr-2">🎨</span>
                      Emotional Palette
                    </h3>
                    <div className="space-y-4">
                      <div className="text-base text-earth-700 dark:text-cream-300">
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
                      
                      <div className="text-sm text-leaf-400 italic">
                        {moodGarden.suggestion}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View Mode Tabs */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => {
                  setViewMode('all');
                  setSearchTerm('');
                  setSelectedTag('all');
                }}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  viewMode === 'all'
                    ? 'bg-leaf-600 text-cream-100'
                    : 'bg-deep-700 text-cream-400 hover:bg-deep-600'
                }`}
              >
                All Entries ({entries.length})
              </button>
              <button
                onClick={() => {
                  setViewMode('pinned');
                  setSearchTerm('');
                  setSelectedTag('all');
                }}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  viewMode === 'pinned'
                    ? 'bg-leaf-600 text-cream-100'
                    : 'bg-deep-700 text-cream-400 hover:bg-deep-600'
                }`}
              >
                ⭐ Favorites ({entries.filter(e => e.isPinned).length})
              </button>
              <button
                onClick={() => {
                  setViewMode('archived');
                  setSearchTerm('');
                  setSelectedTag('all');
                }}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  viewMode === 'archived'
                    ? 'bg-deep-600 text-cream-100'
                    : 'bg-deep-700 text-cream-400 hover:bg-deep-600'
                }`}
              >
                📦 Archive ({archivedEntries.length})
              </button>
            </div>

            {/* Bulk Selection Controls */}
            {filteredEntries.length > 0 && (
              <div className="bg-deep-700/50 border border-leaf-700/30 rounded-xl p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEntries.length === filteredEntries.length && filteredEntries.length > 0}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="w-5 h-5 rounded border-deep-500 text-leaf-600 focus:ring-leaf-500 bg-deep-700"
                    />
                    <span className="text-sm font-medium text-cream-300">
                      Select All ({selectedEntries.length}/{filteredEntries.length})
                    </span>
                  </label>
                </div>
                
                {selectedEntries.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {viewMode !== 'archived' && (
                      <>
                        <button
                          onClick={handleBulkArchive}
                          className="px-4 py-2 bg-deep-600 hover:bg-deep-500 text-cream-200 rounded-lg text-sm font-medium transition-colors"
                        >
                          📦 Archive ({selectedEntries.length})
                        </button>
                        <button
                          onClick={handleBulkDelete}
                          className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          🗑️ Delete ({selectedEntries.length})
                        </button>
                      </>
                    )}
                    {viewMode === 'archived' && (
                      <button
                        onClick={() => {
                          selectedEntries.forEach(id => handleRestoreEntry(id));
                          toggleSelectAll(false);
                        }}
                        className="px-4 py-2 bg-leaf-600 hover:bg-leaf-500 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        ↩️ Restore ({selectedEntries.length})
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Entries List */}
            {filteredEntries.length === 0 ? (
              <div className="bento-item text-center py-12">
                {searchTerm ? (
                  <>
                    <Search className="w-12 h-12 text-earth-400 dark:text-cream-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-earth-800 dark:text-cream-100 mb-2">
                      No entries found
                    </h3>
                    <p className="text-earth-600 dark:text-cream-400 mb-4">
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
                    <Calendar className="w-12 h-12 text-earth-400 dark:text-cream-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-earth-800 dark:text-cream-100 mb-2">
                      Your journal is waiting
                    </h3>
                    <p className="text-earth-600 dark:text-cream-400 mb-4">
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
                      && (selectedTag === 'all' || (entry.tags || []).includes(selectedTag))
                    )
                  )
                  .map(([date, dateEntries]) => (
                    <div key={date} data-date={date}>
                      <h2 className="text-lg font-semibold text-earth-700 dark:text-cream-200 mb-4 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {date}
                      </h2>
                      <div className="space-y-4">
                        {dateEntries
                          .filter(entry => 
                            entry.content.toLowerCase().includes(searchTerm.toLowerCase())
                            && (selectedTag === 'all' || (entry.tags || []).includes(selectedTag))
                          )
                          .map(entry => (
                            <JournalEntryItem
                              key={entry.id}
                              entry={entry}
                              onEdit={viewMode === 'archived' ? undefined : handleEditEntry}
                              onDelete={viewMode === 'archived' ? undefined : handleDeleteEntry}
                              onPin={viewMode === 'archived' ? undefined : handlePinToggle}
                              isSelected={selectedEntries.includes(entry.id)}
                              onSelect={toggleSelectEntry}
                              onPrivacyToggle={viewMode === 'archived' ? undefined : handlePrivacyToggle}
                              onShare={setShareEntry}
                            />
                          ))}
                      </div>
                    </div>
                  ))}

                {hasMoreEntries && !searchTerm && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={loadMoreEntries}
                      disabled={loadingMore}
                      className="btn-secondary"
                    >
                      {loadingMore ? 'Loading...' : 'Load Older Entries'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bento-item">
              <h3 className="text-lg font-semibold text-earth-800 dark:text-cream-100 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setPrefillContent('');
                    setShowEntryForm(true);
                  }}
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
                {selectedTag !== 'all' && (
                  <button
                    onClick={() => setSelectedTag('all')}
                    className="w-full btn-secondary text-left"
                  >
                    Clear Tag Filter
                  </button>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            {entries.length > 0 && (
              <div className="bento-item">
                <h3 className="text-lg font-semibold text-earth-800 dark:text-cream-100 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {entries.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="border-l-4 border-leaf-600 pl-3">
                      <div className="flex items-center space-x-2 mb-1">
                        {entry.mood && <span className="text-sm">{entry.mood}</span>}
                        <span className="text-xs text-earth-500 dark:text-cream-500">
                          {formatEntryDate(entry.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-earth-700 dark:text-cream-300 line-clamp-2">
                        {entry.content.length > 80 
                          ? entry.content.substring(0, 80) + '...'
                          : entry.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <WritingInspiration
              onPromptSelect={(prompt) => {
                setPrefillContent(prompt.prompt);
                setShowEntryForm(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* Journal Entry Modal */}
      <JournalEntryForm
        isOpen={showEntryForm}
        onClose={() => {
          setShowEntryForm(false);
          setPrefillContent('');
        }}
        onSubmit={handleNewEntry}
        isSubmitting={submitting}
        initialContent={prefillContent}
      />

      {/* Advanced Filter Modal */}
      <AdvancedFilterPanel
        isOpen={showAdvancedFilter}
        onClose={() => setShowAdvancedFilter(false)}
        moods={availableMoods}
        tags={availableTags}
        onApplyFilters={handleApplyAdvancedFilters}
        currentFilters={advancedFilters}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      {/* Calendar View Modal */}
      <CalendarView
        entries={entriesToDisplay}
        isOpen={showCalendarView}
        onClose={() => setShowCalendarView(false)}
        onSelectDate={handleCalendarDateSelect}
      />

      {/* Wellness Insights Modal */}
      <WellnessInsights
        wellnessSummary={wellnessSummary}
        isOpen={showWellnessInsights}
        onClose={() => setShowWellnessInsights(false)}
      />

      {/* Mood Statistics Dashboard */}
      <MoodStatsDashboard
        entries={entries}
        plantData={plantInsights}
        isOpen={showMoodStats}
        onClose={() => setShowMoodStats(false)}
      />

      {/* Smart Collections Modal */}
      <SmartCollections
        entries={entries}
        isOpen={showSmartCollections}
        onClose={() => setShowSmartCollections(false)}
        onSelectCollection={(collection) => {
          // When a collection is selected, filter to show those entries
          // For now, just close the modal - could enhance to filter view
          setShowSmartCollections(false);
          addToast({
            type: 'info',
            title: `${collection.name}`,
            message: `${collection.count} entries in this collection`
          });
        }}
      />

      {/* Import Entries Modal */}
      <ImportEntries
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={async (importedEntries) => {
          // Import entries one by one
          let successCount = 0;
          let failCount = 0;
          
          for (const entry of importedEntries) {
            try {
              await addEntry(entry.content, entry.mood, entry.tags);
              successCount++;
            } catch (err) {
              failCount++;
              console.error('Failed to import entry:', err);
            }
          }
          
          if (successCount > 0) {
            addToast({
              type: 'success',
              title: 'Import Complete',
              message: `Successfully imported ${successCount} entries${failCount > 0 ? `, ${failCount} failed` : ''}`
            });
          } else {
            addToast({
              type: 'error',
              title: 'Import Failed',
              message: 'Could not import any entries'
            });
          }
        }}
      />

      {/* Reflection Mode Modal */}
      <ReflectionMode
        entries={entries}
        isOpen={showReflectionMode}
        onClose={() => setShowReflectionMode(false)}
      />

      {/* Scheduled Reminders Modal */}
      <ScheduledReminders
        isOpen={showReminders}
        onClose={() => setShowReminders(false)}
      />

      {/* Entry Recommendations Modal */}
      <EntryRecommendations
        entries={entries}
        isOpen={showRecommendations}
        onClose={() => setShowRecommendations(false)}
        onSelectRecommendation={(recommendation) => {
          // Use the recommendation as a writing prompt
          setPrefillContent(recommendation);
          setShowRecommendations(false);
          setShowEntryForm(true);
        }}
      />

      {entryPendingDelete && (
        <div className="modal-overlay flex items-center justify-center p-4 z-[100]">
          <div className="bento-item max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-cream-100 mb-2">Delete Entry?</h3>
            <p className="text-sm text-cream-400 mb-5">This action cannot be undone. The selected journal entry will be permanently removed.</p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEntryPendingDelete(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteEntry}
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Entry Modal */}
      <ShareEntryModal
        entry={shareEntry}
        isOpen={!!shareEntry}
        onClose={() => setShareEntry(null)}
      />
    </div>
  );
};

export default JournalPage;