const firebaseAdmin = require('../modules/firebase');
const { getDownloadURL } = require('firebase-admin/storage');
const fs = require('fs').promises;

class FirebaseService {
  uploadFile = async (file) => {
    const bucket = firebaseAdmin.storage().bucket('app-moviemuse.appspot.com');
    const fileInfo = await bucket.upload(file.path, {
      destination: file.originalname
    });

    const fileRef = bucket.file(fileInfo[1].name);
    return await getDownloadURL(fileRef);
  };
}

module.exports = new FirebaseService();