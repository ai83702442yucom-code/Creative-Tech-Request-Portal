import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDxWhoc7XliD_0b3pbilXaJgMi14zkoPVA",
  authDomain: "tool-development-request-8e135.firebaseapp.com",
  projectId: "tool-development-request-8e135",
  storageBucket: "tool-development-request-8e135.firebasestorage.app",
  messagingSenderId: "832977730627",
  appId: "1:832977730627:web:ac61e9cb845927fb0128f6",
  measurementId: "G-FH80W322XF"
};

// Initialize Firebase (Singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics (Client-side only)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics };
