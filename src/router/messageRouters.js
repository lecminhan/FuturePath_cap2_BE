const express = require('express');
const router = express.Router();
const { sendMessage} = require('../controller/messageController'); // Controller xử lý gửi message

// Route gửi tin nhắn mới
router.post('/messages', sendMessage);

module.exports = router;
