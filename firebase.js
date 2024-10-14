// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore correctly

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYifGUpc0eb4qOFSMOg54-PZpSVqR_B9s",
  authDomain: "csse-20ccc.firebaseapp.com",
  projectId: "csse-20ccc",
  storageBucket: "csse-20ccc.appspot.com",
  messagingSenderId: "925170834799",
  appId: "1:925170834799:web:44d122a8b292ba29295c9a",
  measurementId: "G-DC23SJVLVY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Get a reference to Firestore correctly

export { db }; // Export the Firestore instance
