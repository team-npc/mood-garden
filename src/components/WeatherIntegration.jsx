/**
 * Weather Integration Component
 * Displays weather-based visuals and prompts
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Thermometer,
  Droplets,
  CloudLightning,
  CloudFog,
  Sparkles,
  MapPin
} from 'lucide-react';

// Weather conditions and their configurations
const WEATHER_CONFIG = {
  clear: {
    icon: Sun,
    label: 'Clear',
    gradient: 'from-sage-200 via-sage-100 to-earth-100',
    particleType: 'sparkles',
    ambiance: 'bright',
    plantEffect: 'glow',
    prompts: [
      "The sun is shining warmly. What makes your heart feel bright today?",
      "It's a beautiful clear day. Write about a moment of clarity you've had.",
      "Sunny skies mirror clear thoughts. What's on your mind?",
      "Bask in today's warmth. What are you grateful for?"
    ]
  },
  clouds: {
    icon: Cloud,
    label: 'Cloudy',
    gradient: 'from-sage-300 via-sage-200 to-sage-100',
    particleType: null,
    ambiance: 'soft',
    plantEffect: 'subtle',
    prompts: [
      "Soft clouds gather overhead. What thoughts are floating through your mind?",
      "A gentle overcast day invites reflection. What would you like to ponder?",
      "The sky is a canvas of gray. Paint your feelings with words.",
      "Cloudy days are perfect for introspection. What's beneath the surface?"
    ]
  },
  rain: {
    icon: CloudRain,
    label: 'Rainy',
    gradient: 'from-sage-400 via-sage-300 to-earth-200',
    particleType: 'rain',
    ambiance: 'cozy',
    plantEffect: 'droplets',
    prompts: [
      "Rain taps gently on the window. Write about something that brings you comfort.",
      "The rain washes away the old. What would you like to let go of?",
      "Rainy days are for coziness. Describe your perfect sanctuary.",
      "Listen to the rain. What story does it tell you?"
    ]
  },
  thunderstorm: {
    icon: CloudLightning,
    label: 'Stormy',
    gradient: 'from-sage-500 via-sage-400 to-earth-300',
    particleType: 'rain',
    ambiance: 'dramatic',
    plantEffect: 'electric',
    prompts: [
      "Thunder rumbles in the distance. What powerful emotions are stirring within you?",
      "Storms pass, and so do difficult times. Write about your resilience.",
      "Lightning illuminates the sky briefly. What insight has recently struck you?",
      "The storm outside reflects inner turbulence. Express what needs to be released."
    ]
  },
  snow: {
    icon: CloudSnow,
    label: 'Snowy',
    gradient: 'from-sage-100 via-white to-earth-50',
    particleType: 'snow',
    ambiance: 'peaceful',
    plantEffect: 'frost',
    prompts: [
      "Snow falls silently, blanketing the world. What quiet thoughts need expression?",
      "Everything is still under the snow. Describe a moment of peace.",
      "Snowflakes are unique, like memories. Capture one special memory today.",
      "Winter invites rest. What does self-care mean to you right now?"
    ]
  },
  mist: {
    icon: CloudFog,
    label: 'Misty',
    gradient: 'from-sage-200 via-earth-100 to-sage-100',
    particleType: null,
    ambiance: 'mysterious',
    plantEffect: 'fade',
    prompts: [
      "Mist obscures the horizon. What mysteries are you curious about?",
      "In the fog, familiar things look different. Write about a new perspective.",
      "The mist creates a dreamlike world. Describe a recent dream or wish.",
      "Hidden in the haze, what truths are waiting to be discovered?"
    ]
  },
  windy: {
    icon: Wind,
    label: 'Windy',
    gradient: 'from-sage-300 via-earth-200 to-sage-200',
    particleType: 'leaves',
    ambiance: 'dynamic',
    plantEffect: 'sway',
    prompts: [
      "The wind carries change. What transitions are you experiencing?",
      "Leaves dance in the breeze. Write about movement and freedom.",
      "The wind whispers stories. What would you tell the world?",
      "Change is in the air. What are you hopeful for?"
    ]
  }
};

// Weather Context
const WeatherContext = createContext(null);

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user location
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => reject(error),
        { timeout: 10000 }
      );
    });
  };

  // Fetch weather data
  const fetchWeather = async (coords) => {
    try {
      // Using Open-Meteo API (free, no API key required)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&hourly=weathercode,temperature_2m,relative_humidity_2m&timezone=auto`
      );
      
      if (!response.ok) throw new Error('Weather fetch failed');
      
      const data = await response.json();
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Convert weather code to our weather type
  const getWeatherType = (code) => {
    // WMO Weather codes
    if (code === 0 || code === 1) return 'clear';
    if (code >= 2 && code <= 3) return 'clouds';
    if (code >= 45 && code <= 48) return 'mist';
    if (code >= 51 && code <= 67) return 'rain';
    if (code >= 71 && code <= 77) return 'snow';
    if (code >= 80 && code <= 82) return 'rain';
    if (code >= 85 && code <= 86) return 'snow';
    if (code >= 95 && code <= 99) return 'thunderstorm';
    return 'clouds';
  };

  // Initialize weather
  useEffect(() => {
    const initWeather = async () => {
      try {
        setLoading(true);
        
        // Try to get cached weather first
        const cached = localStorage.getItem('mood-garden-weather');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          // Use cache if less than 30 minutes old
          if (Date.now() - timestamp < 30 * 60 * 1000) {
            setWeather(data);
            setLoading(false);
            return;
          }
        }

        const coords = await getLocation();
        setLocation(coords);
        
        const weatherData = await fetchWeather(coords);
        
        const processedWeather = {
          type: getWeatherType(weatherData.current_weather.weathercode),
          temperature: Math.round(weatherData.current_weather.temperature),
          windSpeed: Math.round(weatherData.current_weather.windspeed),
          humidity: weatherData.hourly?.relative_humidity_2m?.[0] || 50,
          code: weatherData.current_weather.weathercode
        };
        
        setWeather(processedWeather);
        
        // Cache the weather
        localStorage.setItem('mood-garden-weather', JSON.stringify({
          data: processedWeather,
          timestamp: Date.now()
        }));
        
      } catch (err) {
        console.warn('Weather fetch failed:', err);
        setError(err.message);
        
        // Set default weather
        setWeather({
          type: 'clear',
          temperature: 20,
          windSpeed: 5,
          humidity: 50
        });
      } finally {
        setLoading(false);
      }
    };

    initWeather();
  }, []);

  // Get a random prompt based on weather
  const getWeatherPrompt = () => {
    if (!weather) return null;
    const config = WEATHER_CONFIG[weather.type];
    const prompts = config.prompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  // Get weather config
  const getConfig = () => {
    if (!weather) return WEATHER_CONFIG.clear;
    return WEATHER_CONFIG[weather.type];
  };

  const refreshWeather = async () => {
    try {
      setLoading(true);
      const coords = location || await getLocation();
      const weatherData = await fetchWeather(coords);
      
      const processedWeather = {
        type: getWeatherType(weatherData.current_weather.weathercode),
        temperature: Math.round(weatherData.current_weather.temperature),
        windSpeed: Math.round(weatherData.current_weather.windspeed),
        humidity: weatherData.hourly?.relative_humidity_2m?.[0] || 50,
        code: weatherData.current_weather.weathercode
      };
      
      setWeather(processedWeather);
      localStorage.setItem('mood-garden-weather', JSON.stringify({
        data: processedWeather,
        timestamp: Date.now()
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WeatherContext.Provider value={{
      weather,
      loading,
      error,
      getWeatherPrompt,
      getConfig,
      refreshWeather,
      config: getConfig()
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

// Weather Display Widget
const WeatherWidget = ({ minimal = false }) => {
  const { weather, loading, config, refreshWeather } = useWeather();

  if (loading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  if (!weather) return null;

  const Icon = config.icon;

  if (minimal) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={refreshWeather}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl"
      >
        <Icon className="w-5 h-5 text-sage-600 dark:text-sage-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {weather.temperature}°
        </span>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20"
    >
      {/* Main Weather Display */}
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {weather.temperature}°
            </span>
            <span className="text-gray-500 dark:text-gray-400">C</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {config.label}
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 flex gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Wind className="w-4 h-4" />
          <span>{weather.windSpeed} km/h</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Droplets className="w-4 h-4" />
          <span>{weather.humidity}%</span>
        </div>
      </div>
    </motion.div>
  );
};

// Weather-based Plant Effect Overlay
const WeatherPlantEffect = ({ weatherType }) => {
  const config = WEATHER_CONFIG[weatherType] || WEATHER_CONFIG.clear;

  // Render different effects based on weather
  const renderEffect = () => {
    switch (config.plantEffect) {
      case 'glow':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-sage-300/20 mix-blend-overlay animate-breathe rounded-full blur-xl" />
          </div>
        );
      
      case 'droplets':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-2 bg-sage-400/60 rounded-full"
                initial={{ 
                  top: `${Math.random() * 30}%`,
                  left: `${20 + Math.random() * 60}%`,
                  opacity: 0
                }}
                animate={{ 
                  top: '100%',
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.5,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2
                }}
              />
            ))}
          </div>
        );
      
      case 'frost':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-sage-100/30 mix-blend-overlay rounded-full" />
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`
                }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity
                }}
              />
            ))}
          </div>
        );
      
      case 'sway':
        return (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      
      case 'electric':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute inset-0"
              animate={{ 
                boxShadow: [
                  '0 0 0 rgba(95, 107, 95, 0)',
                  '0 0 30px rgba(95, 107, 95, 0.3)',
                  '0 0 0 rgba(95, 107, 95, 0)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return renderEffect();
};

// Weather Prompt Card
const WeatherPrompt = ({ onUsePrompt }) => {
  const { weather, getWeatherPrompt, config, loading } = useWeather();
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (!loading && weather) {
      setPrompt(getWeatherPrompt());
    }
  }, [loading, weather]);

  const handleNewPrompt = () => {
    setPrompt(getWeatherPrompt());
  };

  if (loading || !weather || !prompt) return null;

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br ${config.gradient}`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
        <Icon className="w-full h-full" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white/90">
            Weather-inspired prompt
          </span>
        </div>

        <p className="text-white font-medium text-lg leading-relaxed mb-4">
          "{prompt}"
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => onUsePrompt?.(prompt)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Use this prompt
          </button>
          <button
            onClick={handleNewPrompt}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 rounded-xl text-sm transition-colors"
          >
            New prompt
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Weather Background Component
const WeatherBackground = ({ weatherType, children }) => {
  const config = WEATHER_CONFIG[weatherType] || WEATHER_CONFIG.clear;

  return (
    <div className="relative min-h-screen">
      {/* Gradient Background */}
      <div className={`
        fixed inset-0 opacity-30 pointer-events-none
        bg-gradient-to-br ${config.gradient}
        transition-all duration-1000
      `} />

      {/* Weather Particles */}
      {config.particleType === 'rain' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-4 bg-sage-400/40 rounded-full"
              style={{ left: `${Math.random() * 100}%` }}
              initial={{ top: '-5%' }}
              animate={{ top: '105%' }}
              transition={{
                duration: 0.8 + Math.random() * 0.4,
                delay: Math.random() * 2,
                repeat: Infinity
              }}
            />
          ))}
        </div>
      )}

      {config.particleType === 'snow' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/60 rounded-full"
              style={{ left: `${Math.random() * 100}%` }}
              initial={{ top: '-5%' }}
              animate={{ 
                top: '105%',
                x: [0, 20, -20, 0]
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                delay: Math.random() * 5,
                repeat: Infinity,
                x: { duration: 3, repeat: Infinity }
              }}
            />
          ))}
        </div>
      )}

      {config.particleType === 'leaves' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{ left: `${Math.random() * 100}%` }}
              initial={{ top: '-10%', rotate: 0 }}
              animate={{ 
                top: '110%',
                x: [-50, 50, -50],
                rotate: [0, 360, 720]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                delay: Math.random() * 5,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              🍂
            </motion.div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export { 
  WEATHER_CONFIG, 
  WeatherWidget, 
  WeatherPlantEffect, 
  WeatherPrompt,
  WeatherBackground 
};
export default WeatherWidget;
