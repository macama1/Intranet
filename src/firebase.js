// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDu02aFUcip2fSbJidwq4kSVWC7q3NW-Cs",
  authDomain: "intranetstone-b70c3.firebaseapp.com",
  projectId: "intranetstone-b70c3",
  storageBucket: "intranetstone-b70c3.appspot.com",
  messagingSenderId: "658763136300",
  appId: "1:658763136300:web:2c88f0eec97edb391c0089",
  measurementId: "G-C6M7W8W1YD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
