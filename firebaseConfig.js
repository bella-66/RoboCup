import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Optionally import the services that you want to use
import { getAuth } from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAn1pgr52bDuVvtpEmkkYJvh8BH1O7dER8",
  authDomain: "robocup-8a8c4.firebaseapp.com",
  projectId: "robocup-8a8c4",
  storageBucket: "robocup-8a8c4.appspot.com",
  messagingSenderId: "1093233589577",
  appId: "1:1093233589577:web:1164c92eefbe016671ee98",
  measurementId: "G-F1FQGKPJW8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
