import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyAUrvAmTBsbhb-9gdmF3uPowo6iESq-42w",
  authDomain: "ecocycle-b3dc3.firebaseapp.com",
  projectId: "ecocycle-b3dc3",
  storageBucket: "ecocycle-b3dc3.firebasestorage.app",
  messagingSenderId: "256821777967",
  appId: "1:256821777967:web:38d969f2b92b889b1018da",
};

let app: any;

if (Platform.OS !== "web" || typeof window !== "undefined") {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
