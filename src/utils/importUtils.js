/**
 * Import/Export Utilities for Journal Entries
 * Handles bulk import from JSON files with validation
 */

/**
 * Validate and parse imported entries from JSON
 * @param {string} jsonContent - Raw JSON content
 * @returns {Object} { entries: Array, errors: Array, warnings: Array }
 */
export const parseImportedEntries = (jsonContent) => {
  const result = {
    entries: [],
    errors: [],
    warnings: []
  };

  try {
    const parsed = JSON.parse(jsonContent);
    
    // Handle array of entries or object with entries property
    const entriesArray = Array.isArray(parsed) 
      ? parsed 
      : parsed.entries || [];

    if (!Array.isArray(entriesArray)) {
      result.errors.push('Invalid format: expected array of entries');
      return result;
    }

    entriesArray.forEach((entry, index) => {
      const validated = validateEntry(entry, index);
      if (validated.entry) {
        result.entries.push(validated.entry);
      }
      if (validated.errors.length > 0) {
        result.errors.push(...validated.errors);
      }
      if (validated.warnings.length > 0) {
        result.warnings.push(...validated.warnings);
      }
    });

  } catch (e) {
    result.errors.push(`JSON parse error: ${e.message}`);
  }

  return result;
};

/**
 * Validate a single entry
 * @param {Object} entry - Entry to validate
 * @param {number} index - Entry index for error messages
 * @returns {Object} { entry: Object|null, errors: Array, warnings: Array }
 */
const validateEntry = (entry, index) => {
  const errors = [];
  const warnings = [];
  
  if (!entry || typeof entry !== 'object') {
    errors.push(`Entry ${index + 1}: Invalid entry format`);
    return { entry: null, errors, warnings };
  }

  // Content is required
  if (!entry.content || typeof entry.content !== 'string' || !entry.content.trim()) {
    errors.push(`Entry ${index + 1}: Missing or empty content`);
    return { entry: null, errors, warnings };
  }

  // Build validated entry
  const validatedEntry = {
    content: entry.content.trim().slice(0, 50000), // Max 50k chars
    mood: null,
    tags: [],
    createdAt: new Date(),
    wordCount: 0,
    characterCount: 0
  };

  // Validate mood (emoji)
  if (entry.mood) {
    if (typeof entry.mood === 'string' && entry.mood.length <= 4) {
      validatedEntry.mood = entry.mood;
    } else {
      warnings.push(`Entry ${index + 1}: Invalid mood format, skipping`);
    }
  }

  // Validate tags
  if (entry.tags) {
    if (Array.isArray(entry.tags)) {
      validatedEntry.tags = entry.tags
        .filter(t => typeof t === 'string')
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0)
        .slice(0, 8);
    } else if (typeof entry.tags === 'string') {
      validatedEntry.tags = entry.tags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0)
        .slice(0, 8);
    }
  }

  // Validate/parse date
  if (entry.createdAt || entry.date || entry.timestamp) {
    const dateValue = entry.createdAt || entry.date || entry.timestamp;
    const parsedDate = new Date(dateValue);
    
    if (!isNaN(parsedDate.getTime())) {
      validatedEntry.createdAt = parsedDate;
    } else {
      warnings.push(`Entry ${index + 1}: Invalid date, using current date`);
    }
  } else {
    warnings.push(`Entry ${index + 1}: No date provided, using current date`);
  }

  // Calculate word and character count
  validatedEntry.wordCount = validatedEntry.content.trim().split(/\s+/).length;
  validatedEntry.characterCount = validatedEntry.content.length;

  return { entry: validatedEntry, errors, warnings };
};

/**
 * Read file as text
 * @param {File} file - File to read
 * @returns {Promise<string>} File content
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Generate sample import format for user reference
 * @returns {string} Sample JSON
 */
export const getSampleImportFormat = () => {
  return JSON.stringify({
    entries: [
      {
        content: "Today was a wonderful day. I went for a walk in the park and felt at peace.",
        mood: "😊",
        tags: ["nature", "peace"],
        createdAt: "2024-01-15T10:30:00Z"
      },
      {
        content: "Working on a new project. Feeling motivated and excited about the progress.",
        mood: "🚀",
        tags: ["work", "productivity"],
        createdAt: "2024-01-14T14:00:00Z"
      }
    ]
  }, null, 2);
};

/**
 * Convert plain text entries (one per line or separated by blank lines) to entry objects
 * @param {string} textContent - Plain text content
 * @returns {Array} Array of entry objects
 */
export const parseTextEntries = (textContent) => {
  const entries = [];
  
  // Split by double newlines (paragraphs) or treat each line as entry
  const blocks = textContent.split(/\n\n+/).filter(b => b.trim());
  
  blocks.forEach(block => {
    const content = block.trim();
    if (content.length > 10) { // Min 10 chars for an entry
      entries.push({
        content,
        mood: null,
        tags: [],
        createdAt: new Date(),
        wordCount: content.split(/\s+/).length,
        characterCount: content.length
      });
    }
  });

  return entries;
};
