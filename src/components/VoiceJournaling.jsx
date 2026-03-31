/**
 * Voice Journaling Component
 * Speech-to-text journaling with transcription
 * Production-ready with error handling and accessibility
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause,
  Trash2,
  Download,
  Volume2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import { hapticFeedback, formatRelativeTime } from '../utils/helpers';

// Check browser support
const checkSpeechRecognitionSupport = () => {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

const checkMediaRecorderSupport = () => {
  if (typeof window === 'undefined') return false;
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
};

// Speech Recognition Hook
const useSpeechRecognition = ({ onResult, onError, language = 'en-US', continuous = true }) => {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!checkSpeechRecognitionSupport()) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      
      setInterimTranscript(interim);
      if (final) {
        onResult?.(final);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      onError?.(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening && continuous) {
        try {
          recognition.start();
        } catch (e) {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [language, continuous, onResult, onError]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
      hapticFeedback('medium');
    } catch (e) {
      console.error('Failed to start recognition:', e);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
    isSupported: checkSpeechRecognitionSupport(),
  };
};

// Audio Recording Hook
const useAudioRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = useCallback(async () => {
    if (!checkMediaRecorderSupport()) {
      setError('Audio recording not supported');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });
      
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        onRecordingComplete?.({ blob, url, duration });
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setDuration(0);
      setError(null);
      hapticFeedback('success');

      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);

    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('Microphone access denied');
    }
  }, [onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      clearInterval(timerRef.current);
      setIsRecording(false);
      hapticFeedback('medium');
    }
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setDuration(0);
  }, [audioURL]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach(track => track.stop());
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, []);

  return {
    isRecording,
    audioURL,
    duration,
    error,
    startRecording,
    stopRecording,
    clearRecording,
    isSupported: checkMediaRecorderSupport(),
  };
};

// Format duration to MM:SS
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Audio Visualizer Component
const AudioVisualizer = ({ isActive, color = 'sage' }) => {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 bg-${color}-500 rounded-full`}
          animate={isActive ? {
            height: [12, 32, 20, 40, 16],
          } : { height: 4 }}
          transition={{
            duration: 0.5,
            repeat: isActive ? Infinity : 0,
            repeatType: 'reverse',
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};

// Audio Player Component
const AudioPlayer = ({ url, onDelete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = percent * duration;
    }
  };

  const downloadAudio = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-journal-${Date.now()}.webm`;
    a.click();
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="p-3 bg-sage-500 text-white rounded-full hover:bg-sage-600 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        
        <div className="flex-1">
          <div
            className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer overflow-hidden"
            onClick={handleSeek}
          >
            <motion.div
              className="h-full bg-sage-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatDuration(Math.floor(currentTime))}</span>
            <span>{formatDuration(Math.floor(duration))}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={downloadAudio}
            className="p-2 text-gray-500 hover:text-sage-600 transition-colors"
            aria-label="Download recording"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            aria-label="Delete recording"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Voice Journaling Component
const VoiceJournaling = ({ onTranscriptChange, onRecordingComplete, initialTranscript = '' }) => {
  const [transcript, setTranscript] = useState(initialTranscript);
  const [showTranscript, setShowTranscript] = useState(true);
  const [recordings, setRecordings] = useState([]);
  
  // Speech-to-text
  const handleSpeechResult = useCallback((text) => {
    setTranscript(prev => {
      const newTranscript = prev + (prev ? ' ' : '') + text;
      onTranscriptChange?.(newTranscript);
      return newTranscript;
    });
  }, [onTranscriptChange]);

  const handleSpeechError = useCallback((error) => {
    console.error('Speech error:', error);
  }, []);

  const {
    isListening,
    interimTranscript,
    toggleListening,
    isSupported: speechSupported,
  } = useSpeechRecognition({
    onResult: handleSpeechResult,
    onError: handleSpeechError,
  });

  // Audio recording
  const handleRecordingComplete = useCallback((recording) => {
    setRecordings(prev => [...prev, { ...recording, id: Date.now(), createdAt: new Date() }]);
    onRecordingComplete?.(recording);
  }, [onRecordingComplete]);

  const {
    isRecording,
    audioURL,
    duration,
    error: recordingError,
    startRecording,
    stopRecording,
    clearRecording,
    isSupported: recordingSupported,
  } = useAudioRecorder({ onRecordingComplete: handleRecordingComplete });

  const deleteRecording = useCallback((id) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
    hapticFeedback('light');
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    onTranscriptChange?.('');
  }, [onTranscriptChange]);

  // Neither supported
  if (!speechSupported && !recordingSupported) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
              Voice features not available
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Your browser doesn't support voice input. Try using Chrome, Edge, or Safari.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Control Panel */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Speech-to-Text Button */}
          {speechSupported && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleListening}
              disabled={isRecording}
              className={`
                relative p-4 rounded-full transition-all duration-300
                ${isListening 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-200 dark:shadow-red-900/30' 
                  : 'bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 hover:bg-sage-200 dark:hover:bg-sage-800/30'
                }
                ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              aria-label={isListening ? 'Stop transcription' : 'Start transcription'}
            >
              {isListening && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ opacity: 0.5 }}
                />
              )}
              {isListening ? <MicOff className="w-6 h-6 relative z-10" /> : <Mic className="w-6 h-6" />}
            </motion.button>
          )}

          {/* Audio Recording Button */}
          {recordingSupported && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isListening}
              className={`
                relative p-4 rounded-full transition-all duration-300
                ${isRecording 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-200 dark:shadow-red-900/30' 
                  : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-800/30'
                }
                ${isListening ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full bg-red-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{ opacity: 0.5 }}
                  />
                  <Square className="w-5 h-5 relative z-10" />
                </>
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </motion.button>
          )}

          {/* Status Display */}
          <div className="text-sm">
            {isListening && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span>Listening...</span>
              </div>
            )}
            {isRecording && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span>Recording {formatDuration(duration)}</span>
              </div>
            )}
            {!isListening && !isRecording && (
              <span className="text-gray-500 dark:text-gray-400">
                {speechSupported ? 'Tap mic to transcribe' : 'Tap to record audio'}
              </span>
            )}
          </div>
        </div>

        {/* Visualizer */}
        <AudioVisualizer isActive={isListening || isRecording} />
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {recordingError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
          >
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{recordingError}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript Display */}
      {speechSupported && (transcript || interimTranscript) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FileText className="w-4 h-4" />
              <span>Transcript</span>
              {transcript && (
                <span className="text-xs text-gray-500">
                  ({transcript.split(/\s+/).filter(Boolean).length} words)
                </span>
              )}
            </div>
            {transcript && (
              <button
                onClick={clearTranscript}
                className="text-xs text-red-500 hover:text-red-600"
              >
                Clear
              </button>
            )}
          </div>
          
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {transcript}
              {interimTranscript && (
                <span className="text-gray-400 dark:text-gray-500 italic">
                  {' '}{interimTranscript}
                </span>
              )}
            </p>
          </div>
        </motion.div>
      )}

      {/* Recordings List */}
      {recordings.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Recordings ({recordings.length})
          </h4>
          
          {recordings.map((recording) => (
            <motion.div
              key={recording.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AudioPlayer
                url={recording.url}
                onDelete={() => deleteRecording(recording.id)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {speechSupported && (
          <p>🎙️ Speech transcription converts your voice to text in real-time</p>
        )}
        {recordingSupported && (
          <p>🔴 Audio recording saves your voice as an audio file</p>
        )}
      </div>
    </div>
  );
};

export { useSpeechRecognition, useAudioRecorder, AudioPlayer, AudioVisualizer };
export default VoiceJournaling;
