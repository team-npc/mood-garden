import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AccessibilityProvider } from './components/AccessibilitySuite'
import ErrorBoundary from './components/ErrorBoundary'

// Register Service Worker for PWA support
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, show update notification
              console.log('New content available; please refresh.');
              // Could dispatch event for UI to show update prompt
              window.dispatchEvent(new CustomEvent('sw-update-available'));
            }
          });
        }
      });

      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Register SW after page load
window.addEventListener('load', registerServiceWorker);

// Error logging for production
if (import.meta.env.PROD) {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Could send to analytics/monitoring service
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Could send to analytics/monitoring service
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AccessibilityProvider>
        <App />
      </AccessibilityProvider>
    </ErrorBoundary>
  </StrictMode>,
)
