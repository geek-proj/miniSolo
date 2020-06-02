import Firebase from "firebase";

const firebaseConfig = Firebase.initializeApp({
    apiKey: "AIzaSyDyLF2c_TOH6a4if3esyXfqmZgcKG0uEr4",
    authDomain: "firstweek-86141.firebaseapp.com",
    databaseURL: "https://firstweek-86141.firebaseio.com",
    projectId: "firstweek-86141",
    storageBucket: "firstweek-86141.appspot.com",
    messagingSenderId: "224923692316",
    appId: "1:224923692316:web:6d36887b787bdd588a5ed9"
})



export const db = firebaseConfig.database();
