import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Tu config (ya la tienes bien)
const firebaseConfig = {
  apiKey: "AIzaSyA00y8ajl1ccpRwo8dRjmEbAj5rw1bT9DY",
  authDomain: "intranatstone.firebaseapp.com",
  projectId: "intranatstone",
  storageBucket: "intranatstone.appspot.com",
  messagingSenderId: "605932277231",
  appId: "1:605932277231:web:c6dfd6fb7a5869e413fa1a"
};

const app = initializeApp(firebaseConfig);

// ✅ Estos son los que necesitas exportar
export const auth = getAuth(app);
export const db = getFirestore(app); // <- ESTE FALTABA
