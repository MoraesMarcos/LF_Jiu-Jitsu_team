import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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
const analytics = getAnalytics(app);