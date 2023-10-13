// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCyb_oqpkbguRyZQMtBtEeoHMu5mdpA45A",
  authDomain: "rmdgs-94f5e.firebaseapp.com",
  databaseURL: "https://rmdgs-94f5e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rmdgs-94f5e",
  storageBucket: "rmdgs-94f5e.appspot.com",
  messagingSenderId: "912512705616",
  appId: "1:912512705616:web:76b180e983ff0f9db59d55",
  measurementId: "G-TDG9S5XGDZ"
};


const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);