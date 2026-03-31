/**
 * Welcome Page Component
 * Luxurious landing page with forest theme and bento grid layout
 */

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  BookOpen, 
  Heart, 
  TrendingUp, 
  Sparkles, 
  Shield, 
  Palette,
  Moon,
  Sun,
  Volume2,
  Award,
  ArrowRight,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { ParticleSystem, AmbientGlow } from '../components/ParticleSystem';

// Animated plant SVG component
const AnimatedPlant = () => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 1, ease: "easeOut" }}
    className="relative w-24 h-24 md:w-32 md:h-32"
  >
    <motion.div
      animate={{ 
        y: [0, -6, 0],
        rotate: [0, 2, 0, -2, 0]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="w-full h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-leaf-500/20 to-leaf-700/20 rounded-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Leaf className="w-12 h-12 md:w-16 md:h-16 text-leaf-400" />
        </motion.div>
      </div>
    </motion.div>
  </motion.div>
);

// Feature bento card component
const FeatureBentoCard = ({ icon: Icon, title, description, delay, accent = false, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -4, scale: 1.01 }}
    className={`bento-item group ${accent ? 'bg-gradient-to-br from-leaf-700/30 to-leaf-800/30' : ''} ${className}`}
  >
    <div className={`
      inline-flex items-center justify-center w-12 h-12 
      ${accent ? 'bg-leaf-500/20' : 'bg-deep-600'}
      rounded-2xl mb-4
      group-hover:scale-110 transition-transform duration-300
    `}>
      <Icon className={`w-6 h-6 ${accent ? 'text-leaf-300' : 'text-cream-300'}`} />
    </div>
    <h3 className="text-lg font-bold text-cream-100 mb-2">
      {title}
    </h3>
    <p className="text-cream-500 text-sm leading-relaxed">
      {description}
    </p>
  </motion.div>
);

// How it works step component
const GrowthStep = ({ emoji, step, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="text-center group"
  >
    <div className="relative inline-block mb-4">
      <motion.div 
        whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
        className="w-20 h-20 bg-deep-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:bg-deep-500 transition-colors"
      >
        <span className="text-3xl">{emoji}</span>
      </motion.div>
      <span className="absolute -top-2 -right-2 w-6 h-6 bg-leaf-500 rounded-full text-xs font-bold text-cream-100 flex items-center justify-center">
        {step}
      </span>
    </div>
    <h3 className="text-lg font-bold text-cream-100 mb-2">
      {title}
    </h3>
    <p className="text-cream-500 text-sm">
      {description}
    </p>
  </motion.div>
);

/**
 * Welcome Page Component
 */
const WelcomePage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [authMode, setAuthMode] = useState(null);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/garden" replace />;
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  if (authMode) {
    return (
      <div className="min-h-screen nature-gradient flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-leaf-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-leaf-600/10 rounded-full blur-3xl"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {authMode === 'login' ? (
            <LoginForm onToggleMode={toggleAuthMode} />
          ) : (
            <RegisterForm onToggleMode={toggleAuthMode} />
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen nature-gradient relative overflow-hidden">
      {/* Subtle Particles */}
      <ParticleSystem type="sparkles" intensity={0.3} />
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-leaf-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-leaf-600/5 rounded-full blur-3xl"></div>

      {/* Theme Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 btn-icon"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-cream-300" />
        )}
      </motion.button>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-16 md:mb-24"
        >
          {/* Animated Plant Logo */}
          <div className="flex justify-center mb-8">
            <AnimatedPlant />
          </div>
          
          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-cream-100 mb-6 tracking-tight"
          >
            Mood{' '}
            <span className="text-leaf-400">
              Garden
            </span>
          </motion.h1>
          
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl font-light text-leaf-300 mb-8 italic"
          >
            Where thoughts bloom into wisdom
          </motion.p>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-lg text-cream-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Nurture your mind through mindful journaling. Watch your virtual plant grow 
            as you cultivate self-reflection—
            <span className="font-medium text-cream-200"> without metrics, just natural growth.</span>
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAuthMode('register')}
              className="btn-primary text-lg md:text-xl px-10 md:px-14 py-4 md:py-5 inline-flex items-center justify-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              <span>Begin Your Garden</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAuthMode('login')}
              className="btn-secondary text-lg md:text-xl px-10 md:px-14 py-4 md:py-5 inline-flex items-center justify-center gap-3"
            >
              <Leaf className="w-5 h-5" />
              <span>Return to Garden</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* === FEATURES BENTO GRID === */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-24">
          <FeatureBentoCard
            icon={BookOpen}
            title="Mindful Journaling"
            description="Express your thoughts in a private space designed for reflection."
            delay={0}
            accent={true}
            className="col-span-2"
          />
          <FeatureBentoCard
            icon={Leaf}
            title="Living Growth"
            description="Watch your plant evolve from seed to tree."
            delay={0.1}
          />
          <FeatureBentoCard
            icon={Heart}
            title="Beautiful Rewards"
            description="Earn flowers and fruits for dedication."
            delay={0.15}
          />
          <FeatureBentoCard
            icon={TrendingUp}
            title="Gentle Progress"
            description="No pressure, just encouraging growth."
            delay={0.2}
          />
          <FeatureBentoCard
            icon={Shield}
            title="Private & Secure"
            description="Your thoughts stay yours alone."
            delay={0.25}
          />
          <FeatureBentoCard
            icon={Palette}
            title="10+ Plant Species"
            description="Collect unique plants for your garden."
            delay={0.3}
          />
          <FeatureBentoCard
            icon={Award}
            title="50+ Achievements"
            description="Unlock badges as you grow."
            delay={0.35}
          />
        </div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bento-item max-w-4xl mx-auto mb-16 md:mb-24 p-8 md:p-12"
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-cream-100 text-center mb-10">
            How Your Garden Grows
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <GrowthStep
              emoji="🌱"
              step="1"
              title="Start Small"
              description="Begin with a tiny seed. Every journal entry nurtures your plant."
              delay={0}
            />
            <GrowthStep
              emoji="🌸"
              step="2"
              title="Bloom Beautifully"
              description="Consistent journaling makes your plant bloom with flowers."
              delay={0.15}
            />
            <GrowthStep
              emoji="🍎"
              step="3"
              title="Bear Fruit"
              description="Long-term dedication rewards you with fruits of growth."
              delay={0.3}
            />
          </div>

          {/* Reminder Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 p-5 bg-deep-600/50 rounded-2xl border border-deep-500"
          >
            <p className="text-center text-cream-300 leading-relaxed text-sm">
              <span className="font-semibold text-leaf-400">Remember:</span> Your plant will gently wilt if neglected, 
              but it's never too late to start again. This is about{' '}
              <span className="italic text-cream-200">progress, not perfection.</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Trust Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-deep-600/50 backdrop-blur-sm rounded-full border border-deep-500 mb-4">
            <Shield className="w-4 h-4 text-leaf-400" />
            <span className="text-sm font-medium text-cream-300">Privacy-First Design</span>
          </div>
          <p className="text-sm text-cream-500 max-w-xl mx-auto">
            Your thoughts are encrypted and stored safely. We believe in creating 
            a safe space for self-reflection.
          </p>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAuthMode('register')}
            className="btn-primary text-lg px-12 py-4 inline-flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5" />
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-deep-600 mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-cream-500">
            Built with 💚 for mindful souls everywhere
          </p>
          <p className="text-xs text-cream-600 mt-2">
            Your mental health journey is unique. Mood Garden supports your reflection practice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;