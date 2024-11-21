// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAuth } from "firebase/auth"; // Import Authentication
import { getStorage } from "firebase/storage"; // Import Storage

const firebaseConfig = {
  apiKey: "AIzaSyCoNPVeeCdG1WmyuUm9_R9T8MAyVSBRHSE",
  authDomain: "appunicforms.firebaseapp.com",
  projectId: "appunicforms",
  storageBucket: "appunicforms.appspot.com",
  messagingSenderId: "279539927194",
  appId: "1:279539927194:web:201a8f05aaaa3a4a0cf723",
  measurementId: "G-QZ66W8XL94"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const db = getFirestore(app); 
const storage = getStorage(app);

export { app, auth, db, storage };
