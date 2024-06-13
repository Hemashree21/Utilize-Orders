import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBF7R_Yk5HRvZ-eG7KSEWK6PiJGgj202OQ",
  authDomain: "utilize-d76ec.firebaseapp.com",
  projectId: "utilize-d76ec",
  storageBucket: "utilize-d76ec.appspot.com",
  messagingSenderId: "476947288224",
  appId: "1:476947288224:web:364a3b7d768a74135f79c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getFirestore(app);

export { auth, provider, database };