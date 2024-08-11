// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDTlwTNQh7LZ4J_DCRCVQXxu-nLYKHdiQ0",
  authDomain: "chatapplication-e3732.firebaseapp.com",
  projectId: "chatapplication-e3732",
  storageBucket: "chatapplication-e3732.appspot.com",
  messagingSenderId: "871159864746",
  appId: "1:871159864746:web:d44bf9bcb5da478949dfd3",
  measurementId: "G-E4LX86VKNH",
  databaseURL: "https://chatapplication-e3732-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export default app;
export const db = getFirestore(app)