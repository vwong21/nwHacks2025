// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyCdpkbipBKeP4G1Cd5FD0mgC_6eTdn5vu8",

  authDomain: "nwhacks-89bc9.firebaseapp.com",

  projectId: "nwhacks-89bc9",

  storageBucket: "nwhacks-89bc9.firebasestorage.app",

  messagingSenderId: "503670470348",

  appId: "1:503670470348:web:545faf93b248fd8b21f469"

};


export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);