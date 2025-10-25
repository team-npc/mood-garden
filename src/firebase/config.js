// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration object
// These values come from your Firebase project settings
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBr1TXhW9dyJAREZ8iQNiowtPQLBVjyLM4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mood-garden-a220a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mood-garden-a220a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mood-garden-a220a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "364830965701",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:364830965701:web:5f56e56699374936c715ac",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-8HHF4V9EF5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;