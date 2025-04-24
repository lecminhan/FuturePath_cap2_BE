const pool = require("../Database/db"); // Kết nối cơ sở dữ liệu

// Tạo bảng ChatbotHistory nếu chưa có
const createChatbotHistoryTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "ChatbotHistory" (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      message TEXT NOT NULL,
      response TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      conversation_id INT REFERENCES "Conversation" (id) ON DELETE CASCADE
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Bảng 'ChatbotHistory' đã được tạo hoặc đã tồn tại.");
  } catch (err) {
    console.error("Lỗi khi tạo bảng ChatbotHistory:", err);
  }
};

// Tạo một tin nhắn trong lịch sử chatbot
const createChatbotHistory = async (
  conversation_id,
  user_id,
  message,
  response
) => {
  const query = `
    INSERT INTO "ChatbotHistory" (conversation_id, user_id, message, response)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  try {
    const res = await pool.query(query, [
      conversation_id,
      user_id,
      message,
      response,
    ]);
    return res.rows[0]; // Trả về tin nhắn vừa tạo
  } catch (err) {
    console.error("Lỗi khi tạo tin nhắn chatbot:", err);
  }
};

// Lấy lịch sử tin nhắn theo ID cuộc trò chuyện
const getChatHistoryByConversationId = async (conversation_id) => {
  const query = 'SELECT * FROM "ChatbotHistory" WHERE conversation_id = $1;';

  try {
    const res = await pool.query(query, [conversation_id]);
    return res.rows; // Trả về tất cả các tin nhắn liên quan đến cuộc trò chuyện
  } catch (err) {
    console.error("Lỗi khi lấy lịch sử tin nhắn:", err);
  }
};

module.exports = {
  createChatbotHistoryTable,
  createChatbotHistory,
  getChatHistoryByConversationId,
};
