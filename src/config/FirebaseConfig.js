// firebaseConfig.js
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("../../futurepath-98ae6-firebase-adminsdk-fbsvc-1993b16718.json"); // Đảm bảo đường dẫn đúng

// Khởi tạo Firebase Admin SDK
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://futurepath-98ae6-default-rtdb.firebaseio.com", // URL Realtime Database của bạn
});

// Lấy kết nối tới Firebase Realtime Database
const database = firebaseAdmin.database();

module.exports = { database };
