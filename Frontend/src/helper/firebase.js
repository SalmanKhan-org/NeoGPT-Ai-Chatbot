// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDI8gTCMK8HSJ6BZSYcuZd4dGDjtU9UiFM",
  authDomain: "neogpt-ccdea.firebaseapp.com",
  projectId: "neogpt-ccdea",
  storageBucket: "neogpt-ccdea.firebasestorage.app",
  messagingSenderId: "1001543444407",
  appId: "1:1001543444407:web:7bd9b8cadde0973a1fea32",
  measurementId: "G-9W4TRYVS21",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export  { auth, provider };