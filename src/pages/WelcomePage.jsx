/**
 * Welcome Page Component
 * Landing page with authentication options
 */

import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Leaf, BookOpen, Heart, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

/**
 * Welcome Page Component
 */
const WelcomePage = () => {
  const { user } = useAuth();
  const [authMode, setAuthMode] = useState(null); // 'login', 'register', or null

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/garden" replace />;
  }

  /**
   * Toggle between login and register modes
   */
  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  /**
   * Close auth modal
   */
  const closeAuthModal = () => {
    setAuthMode(null);
  };

  if (authMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-earth-50 flex items-center justify-center p-4">
        {authMode === 'login' ? (
          <LoginForm onToggleMode={toggleAuthMode} />
        ) : (
          <RegisterForm onToggleMode={toggleAuthMode} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-earth-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-sage-100 rounded-full mb-6">
            <Leaf className="w-10 h-10 text-sage-600" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Mood Garden 2.0
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Nurture your mind through mindful journaling. Watch your virtual plant grow, bloom, 
            and bear fruit as you cultivate the habit of self-reflection.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setAuthMode('register')}
              className="btn-primary text-lg px-8 py-3"
            >
              Plant Your Garden
            </button>
            <button
              onClick={() => setAuthMode('login')}
              className="btn-secondary text-lg px-8 py-3"
            >
              Continue Growing
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-sage-100 rounded-full mb-4">
              <BookOpen className="w-6 h-6 text-sage-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Mindful Journaling
            </h3>
            <p className="text-gray-600 text-sm">
              Express your thoughts, feelings, and experiences in a safe, private space.
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-sage-100 rounded-full mb-4">
              <Leaf className="w-6 h-6 text-sage-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Growing Plant
            </h3>
            <p className="text-gray-600 text-sm">
              Your virtual plant evolves from seed to flowering tree as you journal consistently.
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-sage-100 rounded-full mb-4">
              <Heart className="w-6 h-6 text-sage-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Visual Rewards
            </h3>
            <p className="text-gray-600 text-sm">
              Earn beautiful flowers and fruits as rewards for your dedication to self-care.
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-sage-100 rounded-full mb-4">
              <TrendingUp className="w-6 h-6 text-sage-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gentle Progress
            </h3>
            <p className="text-gray-600 text-sm">
              No pressure, no numbers - just encouraging feedback and natural growth.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="card max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            How Your Garden Grows
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Start Small
              </h3>
              <p className="text-gray-600 text-sm">
                Begin with a tiny seed. Every journal entry nurtures your plant's growth.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌸</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bloom Beautifully
              </h3>
              <p className="text-gray-600 text-sm">
                Consistent journaling makes your plant bloom with colorful flowers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍎</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Bear Fruit
              </h3>
              <p className="text-gray-600 text-sm">
                Long-term dedication rewards you with fruits - symbols of your growth.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-sage-50 rounded-lg">
            <p className="text-center text-gray-700">
              <strong>Remember:</strong> Your plant will gently wilt if neglected for a few days, 
              but it's never too late to start caring for it again. This is about progress, not perfection.
            </p>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Your thoughts are private and secure. All journal entries are stored safely 
            and are only accessible by you. We believe in creating a safe space for self-reflection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;