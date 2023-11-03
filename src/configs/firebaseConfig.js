// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWWk2y6BZa5o_CNr8xCTK6BNl7Jg4PwNg",
  authDomain: "ngt-mobileapp.firebaseapp.com",
  projectId: "ngt-mobileapp",
  storageBucket: "ngt-mobileapp.appspot.com",
  messagingSenderId: "748550728809",
  appId: "1:748550728809:web:51308f567fd2b2398d06f8",
  measurementId: "G-ZT9V423PTS",
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_DB = getFirestore(FIREBASE_APP);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);

export { FIREBASE_DB, FIREBASE_AUTH };
