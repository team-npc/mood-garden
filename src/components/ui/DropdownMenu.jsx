/**
 * Reusable Dropdown Menu Component
 * Accessible, keyboard-navigable dropdown with consistent dark mode styling
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * DropdownMenu Component
 * @param {Object} props
 * @param {string} props.label - Button label
 * @param {React.ReactNode} props.icon - Optional icon
 * @param {Array} props.items - Menu items [{id, label, icon, onClick, divider}]
 * @param {string} props.variant - 'primary' | 'secondary' | 'ghost'
 * @param {string} props.align - 'left' | 'right'
 * @param {boolean} props.disabled - Disabled state
 */
const DropdownMenu = ({ 
  label, 
  icon: Icon, 
  items = [], 
  variant = 'secondary',
  align = 'left',
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    const actionableItems = items.filter(item => !item.divider);
    
    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < actionableItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : actionableItems.length - 1
        );
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && actionableItems[focusedIndex]) {
          actionableItems[focusedIndex].onClick?.();
          setIsOpen(false);
          setFocusedIndex(-1);
        }
        break;
      default:
        break;
    }
  };

  const baseButtonStyles = {
    primary: 'bg-leaf-600 hover:bg-leaf-500 text-white dark:bg-leaf-600 dark:hover:bg-leaf-500',
    secondary: 'bg-sage-100 hover:bg-sage-200 text-earth-700 dark:bg-deep-600 dark:hover:bg-deep-500 dark:text-cream-200 border border-sage-200 dark:border-deep-500',
    ghost: 'hover:bg-sage-100 text-earth-600 dark:hover:bg-deep-600 dark:text-cream-300'
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-leaf-500/50
          disabled:opacity-50 disabled:cursor-not-allowed
          ${baseButtonStyles[variant]}
        `}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {Icon && <Icon className="w-4 h-4" />}
        <span>{label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50 mt-2 min-w-[200px] py-2
              bg-white dark:bg-deep-700 
              border border-sage-200 dark:border-deep-500
              rounded-xl shadow-xl
              ${align === 'right' ? 'right-0' : 'left-0'}
            `}
            role="menu"
            onKeyDown={handleKeyDown}
          >
            {items.map((item, index) => {
              if (item.divider) {
                return (
                  <div 
                    key={`divider-${index}`}
                    className="my-1 border-t border-sage-200 dark:border-deep-500" 
                  />
                );
              }

              const ItemIcon = item.icon;
              const actionableIndex = items
                .slice(0, index)
                .filter(i => !i.divider).length;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                    setFocusedIndex(-1);
                  }}
                  className={`
                    w-full text-left px-4 py-2.5 text-sm
                    flex items-center gap-3 transition-colors
                    ${focusedIndex === actionableIndex 
                      ? 'bg-leaf-100 dark:bg-leaf-600/20 text-leaf-700 dark:text-leaf-300' 
                      : 'text-earth-700 dark:text-cream-300 hover:bg-sage-100 dark:hover:bg-deep-600'
                    }
                  `}
                  role="menuitem"
                >
                  {ItemIcon && <ItemIcon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu;
