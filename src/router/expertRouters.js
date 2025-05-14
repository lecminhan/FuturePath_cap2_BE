// routes/expertRoutes.js
const express = require("express");
const { getExperts } = require("../controller/expertController"); // Import controller

const router = express.Router();

// Định nghĩa route cho API GET lấy thông tin chuyên gia và username
router.get("/getfullexperts", getExperts);

module.exports = router;
