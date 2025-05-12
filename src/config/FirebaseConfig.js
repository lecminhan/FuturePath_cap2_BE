// firebaseConfig.js
const firebaseAdmin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG_JSON);

// Khởi tạo Firebase Admin SDK
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://futurepath-98ae6-default-rtdb.firebaseio.com", // URL Realtime Database của bạn
});

// Lấy kết nối tới Firebase Realtime Database
const database = firebaseAdmin.database();

module.exports = { database };
