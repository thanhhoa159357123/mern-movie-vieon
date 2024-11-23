import { initializeApp } from "firebase/app"; 
import { getStorage } from "firebase/storage"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDk5jG16yiT_8wvBrhnjv9zqAH9iDy3CQE",
  authDomain: "vieon-3bbfa.firebaseapp.com",
  projectId: "vieon-3bbfa",
  storageBucket: "vieon-3bbfa.appspot.com",
  messagingSenderId: "957072558017",
  appId: "1:957072558017:web:83e5a6c58e2f606c7dd140",
  measurementId: "G-2631L4WSZ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the storage service
const storage = getStorage(app);

export default storage;
