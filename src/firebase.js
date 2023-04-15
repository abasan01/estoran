import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

var firebaseConfig = {

    apiKey: "AIzaSyCo_FPmboN31TsmzDn5iO5sTb9W2lV3MRc",

    authDomain: "fipugram-7fe14.firebaseapp.com",

    projectId: "fipugram-7fe14",

    storageBucket: "fipugram-7fe14.appspot.com",

    messagingSenderId: "710891490905",

    appId: "1:710891490905:web:e737b0132a5bd33178ab48"

};


// Initialize Firebase

firebase.initializeApp(firebaseConfig);

export default {

    firebase,

};