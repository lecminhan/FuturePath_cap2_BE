const pool = require("../Database/db"); // Kết nối với cơ sở dữ liệu

// Xử lý tin nhắn từ người dùng và trả về phản hồi của chatbot
exports.chatWithBot = async (req, res) => {
  const { user_id, messages, create_new_conversation = false } = req.body;

  try {
    let newConversation;

    // Nếu yêu cầu tạo cuộc trò chuyện mới
    if (create_new_conversation) {
      // Tạo cuộc trò chuyện mới với tiêu đề "Chatbot"
      const createConversationQuery = `
        INSERT INTO "Conversation" (title)
        VALUES ($1)
        RETURNING *;
      `;
      const conversationResult = await pool.query(createConversationQuery, [
        "Chatbot",
      ]);
      newConversation = conversationResult.rows[0];
    } else {
      // Nếu không yêu cầu tạo mới, lấy cuộc trò chuyện cũ (ví dụ từ params hoặc yêu cầu trước)
      // Nếu bạn có ID cuộc trò chuyện, bạn có thể tìm lại từ DB ở đây
      // Ví dụ: newConversation = await getConversationById(someId);
    }

    // Tạo phản hồi và lưu tất cả tin nhắn trong cuộc trò chuyện
    const messagePromises = messages.map(async (message) => {
      // Giả lập phản hồi của chatbot (có thể thay thế bằng AI thực tế)
      const response = `Chatbot trả lời: ${message}`;

      // Lưu tin nhắn vào bảng ChatbotHistory
      const createChatHistoryQuery = `
        INSERT INTO "ChatbotHistory" (conversation_id, user_id, message, response)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const chatResult = await pool.query(createChatHistoryQuery, [
        newConversation.id,
        user_id,
        message,
        response,
      ]);
      return chatResult.rows[0]; // Trả về tin nhắn đã lưu
    });

    // Đợi tất cả các tin nhắn được lưu vào cơ sở dữ liệu
    const savedMessages = await Promise.all(messagePromises);

    // Trả về thông tin cuộc trò chuyện và tin nhắn
    res.status(200).json({
      message: "Tin nhắn đã được gửi thành công",
      conversation: newConversation,
      chatHistory: savedMessages,
    });
  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn đến chatbot:", error);
    res.status(500).send("Lỗi khi gửi tin nhắn đến chatbot");
  }
};
