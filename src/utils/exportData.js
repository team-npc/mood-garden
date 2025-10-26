/**
 * Data Export Utilities
 * Functions for exporting user data in various formats
 */

/**
 * Export journal entries as JSON
 * @param {Object} user - User object
 * @param {Array} entries - Array of journal entries
 * @returns {boolean} Success status
 */
export const exportAsJSON = (user, entries) => {
  try {
    // Prepare data for export
    const exportData = {
      exportDate: new Date().toISOString(),
      exportFormat: 'JSON',
      version: '1.0',
      user: {
        email: user?.email || 'Anonymous',
        displayName: user?.displayName || 'User',
        uid: user?.uid || 'Unknown',
        accountCreated: user?.metadata?.creationTime || 'Unknown'
      },
      summary: {
        totalEntries: entries.length,
        totalWords: entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0),
        averageWordCount: entries.length > 0 
          ? Math.round(entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0) / entries.length)
          : 0,
        dateRange: entries.length > 0 ? {
          first: entries[entries.length - 1]?.createdAt?.toDate 
            ? entries[entries.length - 1].createdAt.toDate().toISOString()
            : 'Unknown',
          last: entries[0]?.createdAt?.toDate 
            ? entries[0].createdAt.toDate().toISOString()
            : 'Unknown'
        } : null,
        moodDistribution: entries.reduce((acc, entry) => {
          if (entry.mood) {
            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
          }
          return acc;
        }, {})
      },
      entries: entries.map(entry => ({
        id: entry.id,
        content: entry.content,
        mood: entry.mood,
        wordCount: entry.wordCount,
        createdAt: entry.createdAt?.toDate 
          ? entry.createdAt.toDate().toISOString() 
          : entry.createdAt,
        plantStage: entry.plantStage,
        plantDepth: entry.plantDepth
      }))
    };

    // Create blob and download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mood-garden-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error exporting as JSON:', error);
    return false;
  }
};

/**
 * Export journal entries as CSV
 * @param {Object} user - User object
 * @param {Array} entries - Array of journal entries
 * @returns {boolean} Success status
 */
export const exportAsCSV = (user, entries) => {
  try {
    // Create CSV header
    const headers = ['Date', 'Time', 'Mood', 'Content', 'Word Count', 'Plant Stage', 'Plant Depth'];
    
    // Create CSV rows
    const rows = entries.map(entry => {
      const date = entry.createdAt?.toDate 
        ? entry.createdAt.toDate() 
        : new Date(entry.createdAt);
      
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        entry.mood || '',
        `"${entry.content.replace(/"/g, '""')}"`, // Escape quotes in content
        entry.wordCount || 0,
        entry.plantStage || '',
        entry.plantDepth || ''
      ].join(',');
    });

    // Combine headers and rows
    const csv = [headers.join(','), ...rows].join('\n');

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mood-garden-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error exporting as CSV:', error);
    return false;
  }
};

/**
 * Export journal entries as plain text
 * @param {Object} user - User object
 * @param {Array} entries - Array of journal entries
 * @returns {boolean} Success status
 */
export const exportAsText = (user, entries) => {
  try {
    let text = '='.repeat(60) + '\n';
    text += 'MOOD GARDEN - JOURNAL EXPORT\n';
    text += '='.repeat(60) + '\n\n';
    text += `Export Date: ${new Date().toLocaleString()}\n`;
    text += `User: ${user?.email || 'Anonymous'}\n`;
    text += `Total Entries: ${entries.length}\n`;
    text += '='.repeat(60) + '\n\n';

    entries.forEach((entry, index) => {
      const date = entry.createdAt?.toDate 
        ? entry.createdAt.toDate() 
        : new Date(entry.createdAt);
      
      text += `\n${'─'.repeat(60)}\n`;
      text += `Entry #${entries.length - index}\n`;
      text += `Date: ${date.toLocaleString()}\n`;
      if (entry.mood) text += `Mood: ${entry.mood}\n`;
      text += `Words: ${entry.wordCount || 0}\n`;
      text += `${'─'.repeat(60)}\n\n`;
      text += entry.content;
      text += '\n\n';
    });

    text += '\n' + '='.repeat(60) + '\n';
    text += 'END OF JOURNAL EXPORT\n';
    text += '='.repeat(60) + '\n';

    // Create blob and download
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mood-garden-journal-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error exporting as text:', error);
    return false;
  }
};
