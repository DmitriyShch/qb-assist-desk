import firebase2 from "./firebase";
import firebase from "firebase/app";
import "firebase/storage";
// import fs from "fs";

// import { stringify } from "querystring";
// import { createAPI } from "./create-api-server";

const TMP_FBS_PATH = "tmp/"

const getStorageLink = (child) => {
  console.log('meth getStorageLink', child)
  var storageRef = firebase2.storage().refFromURL(child);
  // var childRef = storageRef.child(child);
  return storageRef.getDownloadURL()
}

const uploadTmpFile = (file, customToken) => {
  console.log('uploadTmpFile', file.name)
  return new Promise((resolve) => {
    firebase.auth().signInWithCustomToken(customToken)
    .then(() => {
      var storageRef = firebase.storage().ref();
      // Create a reference to 'images/mountains.jpg'
      var tmpFileRef = storageRef.child(TMP_FBS_PATH + file.name);
      // var file = fs.openSync(filePath, 'r')
      tmpFileRef.put(file).then(() => {
          console.log('Uploaded a blob or file!');
          resolve("Upload Successful")
        });
      })
    
    })
}

export default { getStorageLink, uploadTmpFile }