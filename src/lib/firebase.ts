import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey) {
    console.error("CRITICAL: Firebase API Key is missing! Check your environment variables.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
