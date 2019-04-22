import firebase from "firebase/app";
// import "firebase/auth";

var config = {
  apiKey: "AIzaSyDyiy3X1buod7pOAGQoYOLB_iyAI6PT0ko",
  authDomain: "hypo-desk.firebaseapp.com",
  databaseURL: "https://hypo-desk.firebaseio.com",
  projectId: "hypo-desk",
  storageBucket: "hypo-desk.appspot.com",
  messagingSenderId: "314986086964"
};

firebase.initializeApp(config);

export default firebase;