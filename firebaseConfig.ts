// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRjjCxHrYXv4NnwRf8bh1TEjmFogBhWCA",
  authDomain: "mywordcraft-a2668.firebaseapp.com",
  projectId: "mywordcraft-a2668",
  storageBucket: "mywordcraft-a2668.appspot.com",
  messagingSenderId: "836919871373",
  appId: "1:836919871373:web:765715e2d697aaf9e65fc4",
  measurementId: "G-DTKPX411RQ"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_SR = getStorage(FIREBASE_APP);

console.log("Firebase initialized:", FIREBASE_APP.name);
