/**
 * Import Entries Component
 * Handles bulk import of journal entries from JSON or text files
 */

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Download,
  FileJson,
  Loader2
} from 'lucide-react';
import { 
  parseImportedEntries, 
  readFileAsText, 
  getSampleImportFormat,
  parseTextEntries 
} from '../utils/importUtils';

/**
 * Import Entries Modal Component
 */
const ImportEntries = ({ isOpen, onClose, onImport }) => {
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFile = async (file) => {
    if (!file) return;

    setImporting(true);
    setError(null);
    setPreview(null);

    try {
      const content = await readFileAsText(file);
      let result;

      if (file.name.endsWith('.json')) {
        result = parseImportedEntries(content);
      } else if (file.name.endsWith('.txt')) {
        const entries = parseTextEntries(content);
        result = {
          entries,
          errors: [],
          warnings: entries.length === 0 ? ['No valid entries found in text file'] : []
        };
      } else {
        // Try JSON first, then text
        result = parseImportedEntries(content);
        if (result.errors.length > 0 && result.entries.length === 0) {
          const textEntries = parseTextEntries(content);
          if (textEntries.length > 0) {
            result = {
              entries: textEntries,
              errors: [],
              warnings: ['Imported as plain text entries']
            };
          }
        }
      }

      setPreview(result);
    } catch (err) {
      setError(err.message || 'Failed to read file');
    } finally {
      setImporting(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleImport = async () => {
    if (!preview || preview.entries.length === 0) return;

    setImporting(true);
    try {
      await onImport(preview.entries);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to import entries');
    } finally {
      setImporting(false);
    }
  };

  const downloadSample = () => {
    const sample = getSampleImportFormat();
    const blob = new Blob([sample], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-import-format.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bento-item max-w-2xl w-full my-8 p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-deep-600">
          <div className="flex items-center space-x-3">
            <Upload className="w-6 h-6 text-leaf-400" />
            <div>
              <h2 className="text-xl font-bold text-cream-100">Import Entries</h2>
              <p className="text-sm text-cream-400">Import journal entries from JSON or text files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-deep-600 rounded-xl transition-colors text-cream-400 hover:text-cream-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
              transition-all duration-200
              ${dragActive 
                ? 'border-leaf-500 bg-leaf-600/20' 
                : 'border-deep-500 hover:border-deep-400 hover:bg-deep-700/50'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.txt"
              onChange={handleFileInput}
              className="hidden"
            />
            
            {importing ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-leaf-400 animate-spin mb-4" />
                <p className="text-cream-300">Processing file...</p>
              </div>
            ) : (
              <>
                <FileJson className="w-12 h-12 mx-auto text-cream-500 mb-4" />
                <p className="text-cream-200 mb-2">
                  Drop a file here or click to upload
                </p>
                <p className="text-sm text-cream-500">
                  Supports JSON and TXT files
                </p>
              </>
            )}
          </div>

          {/* Sample Format Download */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={downloadSample}
              className="flex items-center space-x-2 text-sm text-sage-400 hover:text-sage-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download sample format</span>
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
              <div className="flex items-center space-x-2 text-red-300">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="mt-6 space-y-4">
              {/* Summary */}
              <div className="p-4 bg-deep-700/50 rounded-xl">
                <h3 className="font-semibold text-cream-100 mb-3 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-leaf-400" />
                  <span>Import Preview</span>
                </h3>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{preview.entries.length}</div>
                    <div className="text-xs text-cream-400">Valid Entries</div>
                  </div>
                  <div className="p-3 bg-red-500/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-400">{preview.errors.length}</div>
                    <div className="text-xs text-cream-400">Errors</div>
                  </div>
                  <div className="p-3 bg-amber-500/20 rounded-lg">
                    <div className="text-2xl font-bold text-amber-400">{preview.warnings.length}</div>
                    <div className="text-xs text-cream-400">Warnings</div>
                  </div>
                </div>
              </div>

              {/* Errors */}
              {preview.errors.length > 0 && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl max-h-32 overflow-y-auto">
                  <h4 className="font-medium text-red-300 mb-2">Errors</h4>
                  <ul className="text-sm text-red-200 space-y-1">
                    {preview.errors.map((err, idx) => (
                      <li key={idx}>• {err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {preview.warnings.length > 0 && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl max-h-32 overflow-y-auto">
                  <h4 className="font-medium text-amber-300 mb-2">Warnings</h4>
                  <ul className="text-sm text-amber-200 space-y-1">
                    {preview.warnings.map((warn, idx) => (
                      <li key={idx}>• {warn}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Entry Preview */}
              {preview.entries.length > 0 && (
                <div className="p-4 bg-deep-700/50 rounded-xl">
                  <h4 className="font-medium text-cream-100 mb-3">Entry Preview</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {preview.entries.slice(0, 3).map((entry, idx) => (
                      <div key={idx} className="p-3 bg-deep-600/50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          {entry.mood && <span>{entry.mood}</span>}
                          <span className="text-xs text-cream-400">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </span>
                          {entry.tags.length > 0 && (
                            <span className="text-xs text-sage-400">
                              #{entry.tags.join(' #')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-cream-300 line-clamp-2">
                          {entry.content}
                        </p>
                      </div>
                    ))}
                    {preview.entries.length > 3 && (
                      <p className="text-center text-sm text-cream-500">
                        +{preview.entries.length - 3} more entries
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Import Button */}
              {preview.entries.length > 0 && (
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setPreview(null)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={importing}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {importing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Importing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Import {preview.entries.length} Entries</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ImportEntries;
