const admin = require('firebase-admin');
const firebaseConfig = require('./config/serviceAccountKey'); // Adjust the path based on the actual location

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
  });
} else {
  admin.app(); // if already initialized, use the existing app
}

module.exports = admin;