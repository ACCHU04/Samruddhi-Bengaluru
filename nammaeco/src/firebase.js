import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace this with your actual Firebase config from the Firebase Console
// 1. Go to console.firebase.google.com
// 2. Click the Gear Icon -> Project Settings
// 3. Scroll down to "Your apps" -> "SDK setup and configuration" -> click "Config"
// 4. Copy the keys and paste them below!
const firebaseConfig = {
  apiKey: "AIzaSyAU6ACR0-MUkNbs8kiWDipn07FvvMLOW8E",
  authDomain: "mitra-nammaeco.firebaseapp.com",
  projectId: "mitra-nammaeco",
  storageBucket: "mitra-nammaeco.firebasestorage.app",
  messagingSenderId: "424208785638",
  appId: "1:424208785638:web:154168ee05f70523fb9b27",
  measurementId: "G-L6JBBZ01XF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
