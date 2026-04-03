/**
 * Smart Collections Component
 * Displays auto-grouped entries by patterns
 */

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, ChevronRight, X, Clock, TrendingUp } from 'lucide-react';
import { getSmartCollections } from '../utils/collectionsUtils';

/**
 * Smart Collections Panel Component
 */
const SmartCollections = ({ entries = [], isOpen, onClose, onSelectCollection }) => {
  const [selectedCollection, setSelectedCollection] = useState(null);
  
  const collections = useMemo(() => getSmartCollections(entries), [entries]);

  if (!isOpen) return null;

  const handleSelectCollection = (collection) => {
    setSelectedCollection(collection);
    if (onSelectCollection) {
      onSelectCollection(collection);
    }
  };

  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bento-item max-w-2xl w-full my-8 p-0 overflow-hidden max-h-[80vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-deep-600">
          <div className="flex items-center space-x-3">
            <Folder className="w-6 h-6 text-leaf-400" />
            <div>
              <h2 className="text-xl font-bold text-cream-100">Smart Collections</h2>
              <p className="text-sm text-cream-400">Auto-organized groups of your entries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-deep-600 rounded-xl transition-colors text-cream-400 hover:text-cream-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collections Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collections.map((collection) => (
                <motion.button
                  key={collection.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleSelectCollection(collection)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selectedCollection?.id === collection.id
                      ? 'bg-leaf-600/30 border-2 border-leaf-500'
                      : 'bg-deep-700/50 border-2 border-transparent hover:border-deep-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{collection.icon}</span>
                      <div>
                        <h3 className="font-semibold text-cream-100">{collection.name}</h3>
                        <p className="text-xs text-cream-400">{collection.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-leaf-600/30 text-leaf-300 rounded-full text-sm font-medium">
                        {collection.count < 5 ? '🌱' : collection.count < 15 ? '🌿' : '🌳'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-cream-500" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Folder className="w-12 h-12 mx-auto text-cream-600 mb-4" />
              <h3 className="text-lg font-medium text-cream-300 mb-2">No Collections Yet</h3>
              <p className="text-cream-500 text-sm">
                Start journaling and your entries will be automatically organized into smart collections!
              </p>
            </div>
          )}
        </div>

        {/* Selected Collection Preview */}
        <AnimatePresence>
          {selectedCollection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-deep-600 p-6 bg-deep-700/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-cream-100 flex items-center space-x-2">
                  <span>{selectedCollection.icon}</span>
                  <span>{selectedCollection.name}</span>
                </h3>
                <button
                  onClick={() => setSelectedCollection(null)}
                  className="text-sm text-cream-500 hover:text-cream-300"
                >
                  Clear selection
                </button>
              </div>

              {/* Preview of entries */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedCollection.entries.slice(0, 5).map((entry, idx) => (
                  <div
                    key={entry.id || idx}
                    className="p-3 bg-deep-600/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        {entry.mood && <span>{entry.mood}</span>}
                        <span className="text-xs text-cream-400">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-cream-300 line-clamp-2">
                      {entry.content}
                    </p>
                  </div>
                ))}
                {selectedCollection.count > 5 && (
                  <p className="text-center text-sm text-cream-500 py-2">
                    More entries in this collection
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SmartCollections;
