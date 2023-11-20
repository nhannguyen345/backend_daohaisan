const multer = require("multer");
// Import the functions you need from the SDKs you need
const firebase = require("firebase/app");
const {getStorage, ref, getDownloadURL, uploadBytesResumable} = require("firebase/storage");

const firebaseConfig = {
    apiKey: "AIzaSyAfoL-2tkz0xC65kpWQTHUlm53-c9tFU7E",
    authDomain: "uploadfileimage-fd0ce.firebaseapp.com",
    projectId: "uploadfileimage-fd0ce",
    storageBucket: "uploadfileimage-fd0ce.appspot.com",
    messagingSenderId: "28808278600",
    appId: "1:28808278600:web:8370e84cf74133a6f55e7d",
    measurementId: "G-9K1MNJC73P"
  };

// Initialize a Firebase application
firebase.initializeApp(firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

//Setting up multer as a middleware to grab photo uploads
const upload = multer({storage: multer.memoryStorage(),
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Chỉ chấp nhận các tệp ảnh (jpg, jpeg, png, gif).'));
        }
        cb(null, true);
      },
});

const urlFromFireBase = async (file) => {
    const storageRef = ref(storage, `files/${file.originalname}`);

    // Create file metadata including the content type
    const metadata = {
        contentType: file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
    // by using uploadBytesResumable we can control the progress of uploading like pause, resume,..

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
}

module.exports = { upload, urlFromFireBase };