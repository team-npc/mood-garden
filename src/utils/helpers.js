/**
 * Production-Ready Utility Functions
 * Reusable helpers for performance, accessibility, and data handling
 */

// ============================================
// PERFORMANCE UTILITIES
// ============================================

/**
 * Debounce function with TypeScript-like typing support
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  const debounced = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timeoutId);
  return debounced;
}

/**
 * Throttle function for rate limiting
 */
export function throttle(fn, limit = 100) {
  let inThrottle = false;
  let lastArgs = null;
  
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

/**
 * Memoization with LRU cache
 */
export function memoize(fn, maxSize = 100) {
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
}

/**
 * Lazy load images with intersection observer
 */
export function createLazyLoader(options = {}) {
  const { threshold = 0.1, rootMargin = '50px' } = options;
  
  if (typeof IntersectionObserver === 'undefined') {
    return { observe: () => {}, disconnect: () => {} };
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  }, { threshold, rootMargin });
  
  return observer;
}

// ============================================
// DATA UTILITIES
// ============================================

/**
 * Deep clone with circular reference handling
 */
export function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return seen.get(obj);
  
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Map) {
    const clone = new Map();
    seen.set(obj, clone);
    obj.forEach((v, k) => clone.set(k, deepClone(v, seen)));
    return clone;
  }
  if (obj instanceof Set) {
    const clone = new Set();
    seen.set(obj, clone);
    obj.forEach(v => clone.add(deepClone(v, seen)));
    return clone;
  }
  
  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);
  
  Object.keys(obj).forEach(key => {
    clone[key] = deepClone(obj[key], seen);
  });
  
  return clone;
}

/**
 * Safe JSON parse with fallback
 */
export function safeJSONParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Generate unique ID
 */
export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * Format date consistently
 */
export function formatDate(date, options = {}) {
  const d = date instanceof Date ? date : new Date(date);
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  return d.toLocaleDateString('en-US', defaultOptions);
}

/**
 * Format relative time - qualitative descriptions for days
 */
export function formatRelativeTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return 'moments ago';
  if (diffHours < 24) return 'earlier today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays <= 3) return 'a few days ago';
  if (diffDays < 7) return 'earlier this week';
  return formatDate(d);
}

// ============================================
// ACCESSIBILITY UTILITIES
// ============================================

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Trap focus within a container (for modals)
 */
export function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };
  
  container.addEventListener('keydown', handleKeyDown);
  firstElement?.focus();
  
  return () => container.removeEventListener('keydown', handleKeyDown);
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion() {
  return typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ============================================
// STORAGE UTILITIES
// ============================================

/**
 * Storage wrapper with TTL support
 */
export const storage = {
  set(key, value, ttlMs = null) {
    const item = {
      value,
      timestamp: Date.now(),
      ttl: ttlMs,
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (e) {
      console.warn('Storage set failed:', e);
      return false;
    }
  },
  
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return defaultValue;
      
      const item = JSON.parse(raw);
      
      if (item.ttl && Date.now() - item.timestamp > item.ttl) {
        this.remove(key);
        return defaultValue;
      }
      
      return item.value;
    } catch {
      return defaultValue;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
};

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Validate email format
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Word count utility
 */
export function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Character count utility
 */
export function countCharacters(text, excludeSpaces = false) {
  if (!text) return 0;
  return excludeSpaces ? text.replace(/\s/g, '').length : text.length;
}

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Async wrapper with error handling
 */
export async function tryCatch(asyncFn, fallback = null) {
  try {
    return await asyncFn();
  } catch (error) {
    console.error('Operation failed:', error);
    return fallback;
  }
}

/**
 * Retry failed operations
 */
export async function retry(fn, options = {}) {
  const { maxAttempts = 3, delay = 1000, backoff = 2 } = options;
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, delay * Math.pow(backoff, attempt - 1)));
      }
    }
  }
  
  throw lastError;
}

// ============================================
// HAPTIC FEEDBACK
// ============================================

/**
 * Trigger haptic feedback on supported devices
 */
export function hapticFeedback(type = 'light') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  
  const patterns = {
    light: [10],
    medium: [20],
    heavy: [30],
    success: [10, 50, 10],
    error: [30, 50, 30],
    warning: [20, 30, 20],
  };
  
  navigator.vibrate(patterns[type] || patterns.light);
}

// ============================================
// EXPORT ALL
// ============================================

export default {
  debounce,
  throttle,
  memoize,
  createLazyLoader,
  deepClone,
  safeJSONParse,
  generateId,
  formatDate,
  formatRelativeTime,
  announceToScreenReader,
  trapFocus,
  prefersReducedMotion,
  storage,
  isValidEmail,
  sanitizeHTML,
  countWords,
  countCharacters,
  tryCatch,
  retry,
  hapticFeedback,
};
