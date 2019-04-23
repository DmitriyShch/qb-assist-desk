import firebase from "./firebase";
import "firebase/firestore";
import { stringify } from "querystring";
import { createAPI } from "./create-api-server";

// var db = firebase.firestore();
const logRequests = true

function saveApplication(application) {
  console.log("firestore saveApplication - " + stringify(application));
  firebase
    .firestore()
    .collection("applications")
    .doc(application.objectId)
    .set(application);
    //     .add({
    //   id: application.id,
    //   name: application.name
    // });
}

// function fetch0(child) {
//   console.log(`before fetch child - ${child}`);
//   firebase
//     .firestore()
//     .collection(child)
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//           console.log(`${doc.id} => ${doc.data()}`);
//       });
//   });
// }

function fetch(child, returnDoc) {
  let api = createAPI()
  logRequests && console.log(`fetching ${child}...`)
  const cache = api.cachedItems
  if (cache && cache.has(child)) {
    logRequests && console.log(`cache hit for ${child}.`)
    return Promise.resolve(cache.get(child))
  } else {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection(child)
        .get()
        .then(
          querySnapshot => {
            let fetched_data = []
            console.log('!!! snapshot ' + child)
            querySnapshot.forEach(doc => {
              if (returnDoc) {
                fetched_data.push(doc)
              } else {
                fetched_data.push(doc.data())
              }
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
            });
            // console.log(stringify(doc))
            // const val = doc.data()
            // // mark the timestamp when this item is cached
            // if (val) val.__lastUpdated = Date.now()
            // cache && cache.set(child, val)
            // logRequests && console.log(`fetched ${child}.`)
            console.log('!!! final fetched_data ' + stringify(fetched_data))
            resolve(fetched_data)
        }, reject)
    })
  }
}

function deleteDoc(child, id) {
  console.log('function deleteDoc - ' + child + ' ' + id)
  return firebase
    .firestore()
    .collection(child)
    .doc(id)
    .delete()
}

function updateDoc(child, id, newObj) {
  console.log('function updateDoc - ' + child + ' ' + id +
    ' ' + stringify(newObj))
  return firebase
    .firestore()
    .collection(child)
    .doc(id)
    .update(newObj)
}

export default { saveApplication, fetch, deleteDoc, updateDoc };
