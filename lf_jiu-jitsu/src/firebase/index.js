// src/firebase/index.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5H-IzFBWjw6uRdTHRBjfDo_X--UEZwf4",
  authDomain: "lf-jiu-jitsu.firebaseapp.com",
  projectId: "lf-jiu-jitsu",
  storageBucket: "lf-jiu-jitsu.firebasestorage.app",
  messagingSenderId: "1010810783583",
  appId: "1:1010810783583:web:47eb84fb557f6d729098ea",
  measurementId: "G-6H4YRXHHQ1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
