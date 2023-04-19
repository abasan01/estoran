import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {

    apiKey: "AIzaSyCo_FPmboN31TsmzDn5iO5sTb9W2lV3MRc",
    authDomain: "fipugram-7fe14.firebaseapp.com",
    projectId: "fipugram-7fe14",
    storageBucket: "fipugram-7fe14.appspot.com",
    messagingSenderId: "710891490905",
    appId: "1:710891490905:web:e737b0132a5bd33178ab48"

};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
let storage = firebase.storage();

export {
    firebase,
    db,
    storage
};