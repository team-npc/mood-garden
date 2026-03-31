/**
 * Advanced Filter Panel Component
 * Provides advanced filtering options for journal entries
 */

import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

const AdvancedFilterPanel = ({
  isOpen,
  onClose,
  moods = [],
  tags = [],
  onApplyFilters,
  currentFilters = {}
}) => {
  const [filters, setFilters] = useState({
    moods: currentFilters.moods || [],
    tags: currentFilters.tags || [],
    dateFrom: currentFilters.dateFrom || '',
    dateTo: currentFilters.dateTo || '',
    minWords: currentFilters.minWords || '',
    maxWords: currentFilters.maxWords || ''
  });

  const handleMoodToggle = (mood) => {
    setFilters(prev => ({
      ...prev,
      moods: prev.moods.includes(mood)
        ? prev.moods.filter(m => m !== mood)
        : [...prev.moods, mood]
    }));
  };

  const handleTagToggle = (tag) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      moods: [],
      tags: [],
      dateFrom: '',
      dateTo: '',
      minWords: '',
      maxWords: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay flex items-center justify-center">
      <div className="bento-item max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sage-200 dark:border-deep-600 sticky top-0 bg-white dark:bg-deep-700">
          <h2 className="text-xl font-semibold text-earth-800 dark:text-cream-100">
            Advanced Filters
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sage-100 dark:hover:bg-deep-600 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-earth-500 dark:text-cream-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Moods Filter */}
          <div>
            <h3 className="text-sm font-semibold text-earth-800 dark:text-cream-100 mb-3">
              Moods
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {moods.map(mood => (
                <label
                  key={mood}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-sage-100 dark:hover:bg-deep-600 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.moods.includes(mood)}
                    onChange={() => handleMoodToggle(mood)}
                    className="w-4 h-4 rounded border-sage-300 dark:border-deep-500 text-leaf-600 focus:ring-leaf-500 bg-white dark:bg-deep-700"
                  />
                  <span className="text-sm text-earth-700 dark:text-cream-300">
                    {mood}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <h3 className="text-sm font-semibold text-earth-800 dark:text-cream-100 mb-3">
              Tags
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {tags.slice(0, 10).map(tag => (
                <label
                  key={tag}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-sage-100 dark:hover:bg-deep-600 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.tags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                    className="w-4 h-4 rounded border-sage-300 dark:border-deep-500 text-leaf-600 focus:ring-leaf-500 bg-white dark:bg-deep-700"
                  />
                  <span className="text-sm text-earth-700 dark:text-cream-300">
                    #{tag}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-earth-800 dark:text-cream-100 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-earth-800 dark:text-cream-100 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>

          {/* Word Count Filter */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-earth-800 dark:text-cream-100 mb-2">
                Min Words
              </label>
              <input
                type="number"
                min="0"
                value={filters.minWords}
                onChange={(e) => setFilters(prev => ({ ...prev, minWords: e.target.value }))}
                placeholder="0"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-earth-800 dark:text-cream-100 mb-2">
                Max Words
              </label>
              <input
                type="number"
                min="0"
                value={filters.maxWords}
                onChange={(e) => setFilters(prev => ({ ...prev, maxWords: e.target.value }))}
                placeholder="Unlimited"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-sage-200 dark:border-deep-600 bg-sage-50 dark:bg-deep-800">
          <button
            onClick={handleReset}
            className="btn-secondary"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="btn-primary"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilterPanel;
