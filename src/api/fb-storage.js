import firebase from "./firebase";
import "firebase/storage";

// import { stringify } from "querystring";
// import { createAPI } from "./create-api-server";

const getStorageLink = (child) => {
  console.log('meth getStorageLink', child)
  var storageRef = firebase.storage().refFromURL(child);
  // var childRef = storageRef.child(child);
  return storageRef.getDownloadURL()
}

export default { getStorageLink }