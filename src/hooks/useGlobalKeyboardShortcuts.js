/**
 * Global Keyboard Shortcuts Hook
 */

import { useEffect } from 'react';

export const useGlobalKeyboardShortcuts = ({
  onNewEntry,
  onSave,
  onClose,
  enabled = true
}) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      // Ctrl+N (Cmd+N on Mac) - New Entry
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        onNewEntry?.();
      }

      // Ctrl+S (Cmd+S on Mac) - Save (when in form)
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        onSave?.();
      }

      // Escape - Close modal
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewEntry, onSave, onClose, enabled]);
};

/**
 * List of available keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = [
  {
    key: 'Ctrl+N',
    macKey: 'Cmd+N',
    description: 'Create a new journal entry',
    action: 'newEntry'
  },
  {
    key: 'Ctrl+S',
    macKey: 'Cmd+S',
    description: 'Save current entry',
    action: 'save'
  },
  {
    key: 'Escape',
    macKey: 'Escape',
    description: 'Close modal or dialog',
    action: 'close'
  }
];

/**
 * Get the correct key display based on platform
 */
export const getKeyDisplay = (shortcut) => {
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
  return isMac ? shortcut.macKey : shortcut.key;
};
