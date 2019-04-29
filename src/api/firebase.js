import firebase from "firebase/app";
// import "firebase/auth";

var config = {
  apiKey: "AIzaSyCmGyzpFgznblWA8KnFwwELTRwbTEQc83U",
  authDomain: "qb-assist-desk.firebaseapp.com",
  databaseURL: "https://qb-assist-desk.firebaseio.com",
  projectId: "qb-assist-desk",
  storageBucket: "qb-assist-desk.appspot.com",
  messagingSenderId: "1074859092178"
};

firebase.initializeApp(config);

export default firebase;