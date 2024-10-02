// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBF25EqeSKPK8jrvcbOH5Q2ag7bf-PY9HQ",
  authDomain: "lab5-2-6b716.firebaseapp.com",
  projectId: "lab5-2-6b716",
  storageBucket: "lab5-2-6b716.appspot.com",
  messagingSenderId: "531566581237",
  appId: "1:531566581237:web:a8284321bf523e9edd3cbc",
  measurementId: "G-4MRM5DP59W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app); // Khởi tạo Firestore

// Xuất auth và db để sử dụng trong các file khác
export { auth, db };
