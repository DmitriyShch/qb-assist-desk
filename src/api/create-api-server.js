import firebase from "./firebase";
import "firebase/firestore";
import LRU from 'lru-cache'

// var config = {
//   apiKey: "AIzaSyDyiy3X1buod7pOAGQoYOLB_iyAI6PT0ko",
//   authDomain: "hypo-desk.firebaseapp.com",
//   databaseURL: "https://hypo-desk.firebaseio.com",
//   projectId: "hypo-desk",
//   storageBucket: "hypo-desk.appspot.com",
//   messagingSenderId: "314986086964"
// };

export function createAPI () {
  let api
  // this piece of code may run multiple times in development mode,
  // so we attach the instantiated API to `process` to avoid duplications
  if (process.__API__) {
    api = process.__API__
  } else {
    // Firebase.initializeApp(config)
    api = process.__API__ = firebase.firestore()

    api.onServer = true

    // fetched item cache
    api.cachedItems = new LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15 // 15 min cache
    })

    // cache the latest story ids
    // api.cachedIds = {}
    // ;['top', 'new', 'show', 'ask', 'job'].forEach(type => {
    //   api.child(`${type}stories`).on('value', snapshot => {
    //     api.cachedIds[type] = snapshot.val()
    //   })
    // })
  }
  return api
}
