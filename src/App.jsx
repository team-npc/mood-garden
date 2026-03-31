import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import WelcomePage from './pages/WelcomePage';
import GardenPage from './pages/GardenPage';
import JournalPage from './pages/JournalPage';
import ProfilePage from './pages/ProfilePage';
import FocusModePage from './pages/FocusModePage';
import HelpPage from './pages/HelpPage';
import EnhancedDashboard from './pages/EnhancedDashboard';
import EnhancedJournalEntry from './pages/EnhancedJournalEntry';

/**
 * Error Boundary Component for debugging
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1 style={{ color: 'red' }}>🚨 Something went wrong!</h1>
          <p>Error: {this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Main App Component
 */
function App() {
  console.log('🌱 App component rendering...');

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen nature-gradient transition-colors duration-300">
                <Routes>
                {/* Public Routes */}
                <Route path="/" element={<WelcomePage />} />
              
              {/* Protected Routes */}
              <Route path="/garden" element={
                <ProtectedRoute>
                  <Navigation />
                  <GardenPage />
                </ProtectedRoute>
              } />
              
              <Route path="/journal" element={
                <ProtectedRoute>
                  <Navigation />
                  <JournalPage />
                </ProtectedRoute>
              } />
              
              <Route path="/focus" element={
                <ProtectedRoute>
                  <Navigation />
                  <FocusModePage />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Navigation />
                  <ProfilePage />
                </ProtectedRoute>
              } />

              <Route path="/help" element={
                <ProtectedRoute>
                  <Navigation />
                  <HelpPage />
                </ProtectedRoute>
              } />
              
              {/* Enhanced elegant pages */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <EnhancedDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/write" element={
                <ProtectedRoute>
                  <EnhancedJournalEntry />
                </ProtectedRoute>
              } />

              {/* Catch all route - redirect to welcome */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
