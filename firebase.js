import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/functions";
import "firebase/compat/storage";
import Constants from 'expo-constants';
//import "firebase/messaging"

const getEnv = (key) => {
  // Prefer build-time injected vars (Expo SDK 49+), then fall back to expo config extras
  return process.env[key]
    ?? (Constants?.expoConfig?.extra && Constants.expoConfig.extra[key])
    ?? (Constants?.manifest?.extra && Constants.manifest.extra[key])
    ?? undefined;
};

const firebaseConfig = {
  apiKey: getEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  databaseURL: getEnv('EXPO_PUBLIC_FIREBASE_DATABASE_URL'),
  projectId: getEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),
  measurementId: getEnv('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID'),
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
  
 
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();
//const messaging = firebase.messaging()
const specialFirestoreOptions = firebase.firestore.FieldValue

export { db, auth, functions, storage, specialFirestoreOptions }