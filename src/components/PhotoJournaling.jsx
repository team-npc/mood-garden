/**
 * Photo Journaling Component
 * Allows users to upload and attach photos to journal entries
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Image, 
  X, 
  Upload, 
  Trash2, 
  ZoomIn, 
  Grid,
  Plus,
  Loader
} from 'lucide-react';

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Photo Upload Component
const PhotoUpload = ({ photos = [], onPhotosChange, maxPhotos = MAX_PHOTOS, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFiles = useCallback(async (files) => {
    setError(null);
    const validFiles = [];
    
    for (const file of files) {
      // Check file type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(`${file.name} is not a supported image type`);
        continue;
      }
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name} is too large (max 5MB)`);
        continue;
      }
      
      // Check max photos
      if (photos.length + validFiles.length >= maxPhotos) {
        setError(`Maximum ${maxPhotos} photos allowed`);
        break;
      }
      
      validFiles.push(file);
    }
    
    if (validFiles.length > 0) {
      setUploading(true);
      
      // Convert files to base64 for preview and storage
      const newPhotos = await Promise.all(
        validFiles.map(async (file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                file,
                preview: e.target.result,
                name: file.name,
                type: file.type,
                size: file.size,
                uploadedAt: new Date().toISOString()
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );
      
      onPhotosChange([...photos, ...newPhotos]);
      setUploading(false);
    }
  }, [photos, maxPhotos, onPhotosChange]);

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      ACCEPTED_TYPES.includes(file.type)
    );
    
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  // Handle file input change
  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFiles(files);
    }
    // Reset input
    e.target.value = '';
  };

  // Remove photo
  const removePhoto = (photoId) => {
    onPhotosChange(photos.filter(p => p.id !== photoId));
  };

  // Open file picker
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled || photos.length >= maxPhotos}
      />

      {/* Upload Area */}
      {photos.length < maxPhotos && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`
            relative border-2 border-dashed rounded-2xl p-6
            transition-all duration-300
            ${isDragging 
              ? 'border-sage-400 bg-sage-50 dark:bg-sage-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-sage-300 dark:hover:border-sage-600'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={!disabled ? openFilePicker : undefined}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`
              w-14 h-14 rounded-xl mb-4 flex items-center justify-center
              ${isDragging 
                ? 'bg-sage-100 dark:bg-sage-800' 
                : 'bg-gray-100 dark:bg-gray-700'
              }
            `}>
              {uploading ? (
                <Loader className="w-7 h-7 text-sage-500 animate-spin" />
              ) : (
                <Camera className="w-7 h-7 text-gray-400" />
              )}
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              {isDragging ? 'Drop photos here' : 'Drag & drop photos or click to upload'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              JPEG, PNG, WebP or GIF • Max 5MB each • {maxPhotos - photos.length} remaining
            </p>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg"
          >
            <X className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          <AnimatePresence mode="popLayout">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700"
              >
                <img
                  src={photo.preview || photo.url}
                  alt={photo.name || `Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewPhoto(photo);
                    }}
                    className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                  >
                    <ZoomIn className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(photo.id);
                    }}
                    className="p-2 bg-red-500/90 rounded-lg hover:bg-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Photo Number Badge */}
                <div className="absolute top-2 left-2 w-6 h-6 bg-black/50 text-white text-xs rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
              </motion.div>
            ))}

            {/* Add More Button */}
            {photos.length < maxPhotos && (
              <motion.button
                layout
                onClick={openFilePicker}
                disabled={disabled}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-sage-400 dark:hover:border-sage-500 flex items-center justify-center transition-colors"
              >
                <Plus className="w-6 h-6 text-gray-400" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Full Screen Preview Modal */}
      <AnimatePresence>
        {previewPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setPreviewPhoto(null)}
          >
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={previewPhoto.preview || previewPhoto.url}
              alt={previewPhoto.name}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Photo Gallery Display Component (for viewing entries)
const PhotoGallery = ({ photos = [], layout = 'grid' }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (photos.length === 0) return null;

  const getGridClass = () => {
    switch (photos.length) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      case 4:
        return 'grid-cols-2';
      default:
        return 'grid-cols-3';
    }
  };

  return (
    <>
      <div className={`grid ${getGridClass()} gap-2 rounded-xl overflow-hidden`}>
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id || index}
            whileHover={{ scale: 1.02 }}
            className={`
              relative cursor-pointer overflow-hidden
              ${photos.length === 1 ? 'aspect-video' : 'aspect-square'}
              ${photos.length === 3 && index === 0 ? 'row-span-2 aspect-auto' : ''}
            `}
            onClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={photo.preview || photo.url}
              alt={photo.name || `Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full Screen Preview */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation for multiple photos */}
            {photos.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id || index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhoto(photo);
                    }}
                    className={`
                      w-12 h-12 rounded-lg overflow-hidden border-2 transition-all
                      ${selectedPhoto === photo 
                        ? 'border-white scale-110' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                      }
                    `}
                  >
                    <img
                      src={photo.preview || photo.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            
            <motion.img
              key={selectedPhoto.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedPhoto.preview || selectedPhoto.url}
              alt={selectedPhoto.name}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Photo thumbnail for entry list
const PhotoThumbnail = ({ photos = [], size = 'sm', onClick }) => {
  if (photos.length === 0) return null;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 group"
    >
      <div className={`${sizeClasses[size]} relative rounded-lg overflow-hidden`}>
        <img
          src={photos[0].preview || photos[0].url}
          alt=""
          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
        />
        
        {photos.length > 1 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs font-bold">+{photos.length - 1}</span>
          </div>
        )}
      </div>
      
      {photos.length > 1 && (
        <div className="flex -space-x-2">
          {photos.slice(1, 3).map((photo, index) => (
            <div
              key={photo.id || index}
              className={`${sizeClasses[size]} rounded-lg overflow-hidden border-2 border-white dark:border-gray-800`}
            >
              <img
                src={photo.preview || photo.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </button>
  );
};

export { PhotoUpload, PhotoGallery, PhotoThumbnail };
export default PhotoUpload;
