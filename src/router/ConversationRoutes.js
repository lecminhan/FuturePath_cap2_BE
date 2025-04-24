const express = require("express");
const router = express.Router();
const conversationController = require("../controller/ConversationController");

// API để tạo cuộc trò chuyện mới
router.post("/chat", conversationController.createConversation); // API tạo cuộc trò chuyện và lưu tin nhắn

// API lấy danh sách tất cả các cuộc trò chuyện
router.get("/", conversationController.getConversations); // Lấy tất cả các cuộc trò chuyện

// API lấy chi tiết cuộc trò chuyện theo ID
router.get("/:id", conversationController.getConversationById);

module.exports = router;
