import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUrvAmTBsbhb-9gdmF3uPowo6iESq-42w",
  authDomain: "ecocycle-b3dc3.firebaseapp.com",
  projectId: "ecocycle-b3dc3",
  storageBucket: "ecocycle-b3dc3.firebasestorage.app",
  messagingSenderId: "256821777967",
  appId: "1:256821777967:web:38d969f2b92b889b1018da",
  measurementId: "G-1ERVZ2J245"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);