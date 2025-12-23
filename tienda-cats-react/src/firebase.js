// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAFBEOomggDL8Pog7XOkkmm56YRK71oYcQ",
  authDomain: "tienda-cats.firebaseapp.com",
  projectId: "tienda-cats",
  storageBucket: "tienda-cats.firebasestorage.app",
  messagingSenderId: "714114492400",
  appId: "1:714114492400:web:26fa3f5d9d249697c9df35"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
