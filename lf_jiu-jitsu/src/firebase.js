// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5H-IzFBWjw6uRdTHRBjfDo_X--UEZwf4",
  authDomain: "lf-jiu-jitsu.firebaseapp.com",
  projectId: "lf-jiu-jitsu",
  storageBucket: "lf-jiu-jitsu.firebasestorage.app",
  messagingSenderId: "1010810783583",
  appId: "1:1010810783583:web:47eb84fb557f6d729098ea",
  measurementId: "G-6H4YRXHHQ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);