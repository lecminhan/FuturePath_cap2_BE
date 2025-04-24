const express = require("express");
const router = express.Router();
const chatbotController = require("../controller/ChatbotController");

// API để trò chuyện với chatbot
router.post("/chat", chatbotController.chatWithBot);

module.exports = router;
