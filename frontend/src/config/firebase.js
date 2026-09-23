import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC18sWUwm1o5Yt6KUnmv1e-wykDlQF_K0E',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mealmentorai21.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'mealmentorai21',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mealmentorai21.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '685709120748',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:685709120748:web:710a5fad452e705975c1c9',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-EH66CY3JXS',
};

// Prevent re-initializing app during hot module reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth & Firestore with multiplatform support (Web + React Native Android/iOS)
let auth;
try {
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    // For React Native Android / iOS native apps (including APK builds)
    const { initializeAuth, getReactNativePersistence } = require('firebase/auth');
    const ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default;
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  }
} catch (err) {
  // If already initialized (e.g. fast refresh), fallback to getAuth
  auth = getAuth(app);
}

const db = getFirestore(app);

export const webClientId =
  process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID ||
  '685709120748-vbmcpgb14ct6d8mipamop9o674rc08ad.apps.googleusercontent.com';

export { app, auth, db, firebaseConfig };

