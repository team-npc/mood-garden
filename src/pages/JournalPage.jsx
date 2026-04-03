/**
 * Journal Page Component
 * Displays journal entries history and statistics
 */

import React, { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { Plus, Search, Calendar, BarChart3, Download, Sliders, HelpCircle, Heart, Folder, Upload, SortAsc, BookOpen, Bell, Lightbulb, Database, Compass, Settings2, TrendingUp, Tag, Flame } from 'lucide-react';
import { useJournal } from '../hooks/useJournal';
import { useGlobalKeyboardShortcuts } from '../hooks/useGlobalKeyboardShortcuts';
import JournalEntryItem from '../components/JournalEntryItem';
import JournalEntryForm from '../components/JournalEntryForm';
import WritingInspiration from '../components/WritingInspiration';
import AdvancedFilterPanel from '../components/AdvancedFilterPanel';
import KeyboardShortcutsModal from '../components/KeyboardShortcutsModal';
import JournalEmptyState from '../components/JournalEmptyState';
import { GardenLoader } from '../components/LazyLoading';
import { DropdownMenu } from '../components/ui';
import { SkeletonJournalEntry, SkeletonSidebar } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { exportAsJSON, exportAsCSV, exportAsText } from '../utils/exportData';
import { fullTextSearch, applyAdvancedFilters, getHashtagSuggestions } from '../utils/searchUtils';
import { generateWellnessSummary } from '../utils/wellnessUtils';
import { sortEntries, SORT_OPTIONS, detectDuplicateEntry } from '../utils/collectionsUtils';

// Lazy load heavy modal components
const CalendarView = lazy(() => import('../components/CalendarView'));
const WellnessInsights = lazy(() => import('../components/WellnessInsights'));
const MoodStatsDashboard = lazy(() => import('../components/MoodStatsDashboard'));
const SmartCollections = lazy(() => import('../components/SmartCollections'));
const ImportEntries = lazy(() => import('../components/ImportEntries'));
const ReflectionMode = lazy(() => import('../components/ReflectionMode'));
const ScheduledReminders = lazy(() => import('../components/ScheduledReminders'));
const EntryRecommendations = lazy(() => import('../components/EntryRecommendations'));
const ShareEntryModal = lazy(() => import('../components/ShareEntryModal'));

// Loading fallback for lazy components
const ModalLoader = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-deep-700 rounded-2xl p-8">
      <div className="animate-spin w-8 h-8 border-4 border-leaf-500 border-t-transparent rounded-full mx-auto" />
      <p className="text-earth-600 dark:text-cream-400 mt-4">Loading...</p>
    </div>
  </div>
);

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
   * Memoized for performance with large entry lists
   */
  const entriesToDisplay = viewMode === 'archived' ? archivedEntries : entries;
  
  // Memoize expensive filtering operations
  const filteredEntries = useMemo(() => {
    // Apply all filters in sequence
    let filtered = entriesToDisplay
      .filter(entry =>
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
        && (selectedTag === 'all' || (entry.tags || []).includes(selectedTag))
        && (viewMode !== 'pinned' || entry.isPinned)
      );

    // Apply full-text search
    if (searchTerm.trim()) {
      filtered = fullTextSearch(filtered, searchTerm);
    }

    // Apply advanced filters
    if (Object.keys(advancedFilters).length > 0) {
      filtered = applyAdvancedFilters(filtered, advancedFilters);
    }

    // Apply sorting
    return sortEntries(filtered, currentSort);
  }, [entriesToDisplay, searchTerm, selectedTag, viewMode, advancedFilters, currentSort]);

  const availableTags = useMemo(() => 
    [...new Set(entries.flatMap((entry) => entry.tags || []))].sort(),
    [entries]
  );

  const availableMoods = useMemo(() => 
    [...new Set(entries.filter((entry) => entry.mood).map((entry) => entry.mood))].sort(),
    [entries]
  );

  const plantInsights = useMemo(() => getPlantInsights(), [entries]);
  const moodGarden = useMemo(() => getMoodGarden(), [entries]);
  
  // Generate wellness summary - memoized
  const wellnessSummary = useMemo(() => generateWellnessSummary(entries), [entries]);
  
  // Recompute entriesByDate based on filtered entries - memoized
  const entriesByDate = useMemo(() => {
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
  }, [filteredEntries]);

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
          
          {/* Toolbar - Clean & Organized with Dropdowns */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* Data Menu (Export, Import, Stats) */}
            <DropdownMenu
              label="Data"
              icon={Database}
              items={[
                { 
                  id: 'export-json', 
                  label: 'Export as JSON', 
                  icon: Download,
                  onClick: () => handleExportData('json')
                },
                { 
                  id: 'export-csv', 
                  label: 'Export as CSV', 
                  icon: Download,
                  onClick: () => handleExportData('csv')
                },
                { 
                  id: 'export-txt', 
                  label: 'Export as Text', 
                  icon: Download,
                  onClick: () => handleExportData('txt')
                },
                { divider: true },
                { 
                  id: 'import', 
                  label: 'Import Entries', 
                  icon: Upload,
                  onClick: () => setShowImportModal(true)
                },
                { 
                  id: 'stats', 
                  label: 'View Statistics', 
                  icon: BarChart3,
                  onClick: () => setShowMoodStats(true)
                }
              ]}
            />

            {/* Reflection Menu (Reflect, Ideas, Wellness) */}
            <DropdownMenu
              label="Reflect"
              icon={Compass}
              items={[
                { 
                  id: 'reflection-mode', 
                  label: 'Reflection Mode', 
                  icon: BookOpen,
                  onClick: () => setShowReflectionMode(true)
                },
                { 
                  id: 'ideas', 
                  label: 'Writing Ideas', 
                  icon: Lightbulb,
                  onClick: () => setShowRecommendations(true)
                },
                { 
                  id: 'wellness', 
                  label: 'Wellness Insights', 
                  icon: Heart,
                  onClick: () => setShowWellnessInsights(true)
                }
              ]}
            />

            {/* Planning Menu (Calendar, Reminders) */}
            <DropdownMenu
              label="Plan"
              icon={Calendar}
              items={[
                { 
                  id: 'calendar', 
                  label: 'Calendar View', 
                  icon: Calendar,
                  onClick: () => setShowCalendarView(true)
                },
                { 
                  id: 'reminders', 
                  label: 'Set Reminders', 
                  icon: Bell,
                  onClick: () => setShowReminders(true)
                }
              ]}
            />

            {/* Tools Menu (Shortcuts, Collections) */}
            <DropdownMenu
              label="Tools"
              icon={Settings2}
              items={[
                { 
                  id: 'shortcuts', 
                  label: 'Keyboard Shortcuts', 
                  icon: HelpCircle,
                  onClick: () => setShowKeyboardShortcuts(true)
                },
                { 
                  id: 'collections', 
                  label: 'Smart Collections', 
                  icon: Folder,
                  onClick: () => setShowSmartCollections(true)
                }
              ]}
            />

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-sage-300 dark:bg-deep-500" />

            {/* Quick Toggle: Insights Panel */}
            <button
              onClick={() => setShowStats(!showStats)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${showStats 
                  ? 'bg-leaf-600 text-white' 
                  : 'bg-sage-100 dark:bg-deep-600 text-earth-700 dark:text-cream-200 hover:bg-sage-200 dark:hover:bg-deep-500 border border-sage-200 dark:border-deep-500'
                }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>{showStats ? 'Hide' : 'Show'} Insights</span>
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
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-sage-100 hover:bg-sage-200 dark:bg-deep-600 dark:hover:bg-deep-500 text-earth-700 dark:text-cream-200 border border-sage-200 dark:border-deep-500 transition-colors"
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
                      Journaling Practice
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-sage-100 to-sage-200 dark:from-deep-600 dark:to-deep-700 rounded-xl p-6 border border-sage-300 dark:border-leaf-700/30">
                        <div className="text-center">
                          <div className="text-5xl font-bold text-leaf-600 dark:text-leaf-400 mb-2">
                            {plantInsights.currentStreak >= 30 ? '🌟' : 
                             plantInsights.currentStreak >= 14 ? '🌸' : 
                             plantInsights.currentStreak >= 7 ? '🌿' : 
                             plantInsights.currentStreak >= 3 ? '🌱' : '🌰'}
                          </div>
                          <div className="text-sm text-earth-600 dark:text-cream-400 font-medium">
                            {plantInsights.currentStreak >= 30 ? 'Flourishing rhythm' : 
                             plantInsights.currentStreak >= 14 ? 'Beautiful flow' : 
                             plantInsights.currentStreak >= 7 ? 'Growing momentum' : 
                             plantInsights.currentStreak >= 3 ? 'Building practice' : 'Just beginning'}
                          </div>
                        </div>
                      </div>
                      
                      {plantInsights.longestStreak > plantInsights.currentStreak && plantInsights.longestStreak >= 7 && (
                        <div className="text-sm text-leaf-700 dark:text-leaf-400 bg-leaf-100 dark:bg-leaf-900/30 rounded-lg p-3 text-center border-l-4 border-leaf-500">
                          <div className="font-medium">You've built beautiful rhythms before</div>
                          <div className="text-xs text-leaf-600 dark:text-leaf-500">Your garden remembers 🌱</div>
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
                All Entries
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
            {loading ? (
              <div className="space-y-4">
                <SkeletonJournalEntry />
                <SkeletonJournalEntry />
                <SkeletonJournalEntry />
              </div>
            ) : filteredEntries.length === 0 ? (
              searchTerm ? (
                <div className="bento-item text-center py-12">
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
                </div>
              ) : (
                <JournalEmptyState
                  onStartWriting={() => {
                    setPrefillContent('');
                    setShowEntryForm(true);
                  }}
                  onSelectPrompt={(prompt) => {
                    setPrefillContent(prompt);
                    setShowEntryForm(true);
                  }}
                />
              )
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

          {/* Sidebar - Dashboard */}
          <div className="space-y-6">
            {/* Writing Streak Card */}
            <div className="bento-item">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-earth-800 dark:text-cream-100 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Your Practice
                </h3>
              </div>
              <div className="text-center py-4">
                <div className="text-4xl mb-2">
                  {plantInsights.currentStreak >= 30 ? '🌟' : 
                   plantInsights.currentStreak >= 14 ? '🌸' : 
                   plantInsights.currentStreak >= 7 ? '🌿' : 
                   plantInsights.currentStreak >= 3 ? '🌱' : '🌰'}
                </div>
                <p className="text-sm font-medium text-earth-700 dark:text-cream-300">
                  {plantInsights.currentStreak >= 30 ? 'Flourishing' : 
                   plantInsights.currentStreak >= 14 ? 'Blooming' : 
                   plantInsights.currentStreak >= 7 ? 'Growing' : 
                   plantInsights.currentStreak >= 3 ? 'Sprouting' : 'Beginning'}
                </p>
                <p className="text-xs text-earth-500 dark:text-cream-500 mt-1">
                  Keep nurturing your garden
                </p>
              </div>
            </div>

            {/* Mood Summary */}
            {entries.length > 0 && (
              <div className="bento-item">
                <h3 className="text-lg font-semibold text-earth-800 dark:text-cream-100 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" />
                  Recent Moods
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {moodGarden.recentMoods?.slice(0, 5).map((mood, index) => (
                    <span key={index} className="text-2xl hover:scale-125 transition-transform cursor-default">
                      {mood}
                    </span>
                  ))}
                </div>
                {moodGarden.gardenMessage && (
                  <p className="text-xs text-earth-600 dark:text-cream-400 text-center mt-3 italic">
                    {moodGarden.gardenMessage}
                  </p>
                )}
              </div>
            )}

            {/* Top Tags */}
            {availableTags.length > 0 && (
              <div className="bento-item">
                <h3 className="text-lg font-semibold text-earth-800 dark:text-cream-100 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-leaf-500" />
                  Top Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {availableTags.slice(0, 8).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                        ${selectedTag === tag 
                          ? 'bg-leaf-600 text-white' 
                          : 'bg-sage-100 dark:bg-deep-600 text-earth-600 dark:text-cream-300 hover:bg-leaf-100 dark:hover:bg-leaf-900/30'
                        }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                {selectedTag !== 'all' && (
                  <button
                    onClick={() => setSelectedTag('all')}
                    className="w-full btn-secondary text-left text-sm"
                  >
                    Clear Tag Filter
                  </button>
                )}
              </div>
            </div>

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

      {/* Lazy-loaded Modals with Suspense */}
      <Suspense fallback={<ModalLoader />}>
        {/* Calendar View Modal */}
        {showCalendarView && (
          <CalendarView
            entries={entriesToDisplay}
            isOpen={showCalendarView}
            onClose={() => setShowCalendarView(false)}
            onSelectDate={handleCalendarDateSelect}
          />
        )}

        {/* Wellness Insights Modal */}
        {showWellnessInsights && (
          <WellnessInsights
            wellnessSummary={wellnessSummary}
            isOpen={showWellnessInsights}
            onClose={() => setShowWellnessInsights(false)}
          />
        )}

        {/* Mood Statistics Dashboard */}
        {showMoodStats && (
          <MoodStatsDashboard
            entries={entries}
            plantData={plantInsights}
            isOpen={showMoodStats}
            onClose={() => setShowMoodStats(false)}
          />
        )}

        {/* Smart Collections Modal */}
        {showSmartCollections && (
          <SmartCollections
            entries={entries}
            isOpen={showSmartCollections}
            onClose={() => setShowSmartCollections(false)}
            onSelectCollection={(collection) => {
              setShowSmartCollections(false);
              addToast({
                type: 'info',
                title: `${collection.name}`,
                message: `Entries in this collection`
              });
            }}
          />
        )}

        {/* Import Entries Modal */}
        {showImportModal && (
          <ImportEntries
            isOpen={showImportModal}
            onClose={() => setShowImportModal(false)}
            onImport={async (importedEntries) => {
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
                  message: `Successfully imported entries`
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
        )}
      </Suspense>

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