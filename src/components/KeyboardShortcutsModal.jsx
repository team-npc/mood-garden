/**
 * Keyboard Shortcuts Help Modal Component
 */

import React from 'react';
import { X } from 'lucide-react';
import { KEYBOARD_SHORTCUTS, getKeyDisplay } from '../hooks/useGlobalKeyboardShortcuts';

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <div className="bento-item max-w-md w-full p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-deep-600">
          <h2 className="text-lg font-semibold text-cream-100">
            ⌨️ Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-deep-600 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-cream-400" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 space-y-4">
          {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-deep-600/50 rounded-xl"
            >
              <span className="text-sm text-cream-300 flex-1">
                {shortcut.description}
              </span>
              <kbd className="px-3 py-1 text-xs font-semibold text-cream-100 bg-deep-700 rounded-lg border border-deep-500">
                {getKeyDisplay(shortcut)}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-deep-600 bg-deep-800 rounded-b-3xl">
          <p className="text-xs text-cream-500 text-center">
            These shortcuts help you work faster and more efficiently
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
