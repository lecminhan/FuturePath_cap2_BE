const pool = require("../Database/db"); // Kết nối cơ sở dữ liệu

// Tạo bảng Conversation nếu chưa có
const createConversationTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "Conversation" (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Bảng 'Conversation' đã được tạo hoặc đã tồn tại.");
  } catch (err) {
    console.error("Lỗi khi tạo bảng Conversation:", err);
  }
};

// Tạo một cuộc trò chuyện mới
const createConversation = async (title) => {
  const query = `
    INSERT INTO "Conversation" (title)
    VALUES ($1)
    RETURNING *;
  `;

  try {
    const res = await pool.query(query, [title]);
    return res.rows[0]; // Trả về cuộc trò chuyện mới được tạo
  } catch (err) {
    console.error("Lỗi khi tạo cuộc trò chuyện:", err);
  }
};

// Lấy tất cả các cuộc trò chuyện
const getAllConversations = async () => {
  const query = 'SELECT * FROM "Conversation";';

  try {
    const res = await pool.query(query);
    return res.rows;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách cuộc trò chuyện:", err);
  }
};

// Lấy chi tiết cuộc trò chuyện theo ID
const getConversationById = async (id) => {
  const query = 'SELECT * FROM "Conversation" WHERE id = $1;';

  try {
    const res = await pool.query(query, [id]);
    return res.rows[0];
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết cuộc trò chuyện:", err);
  }
};

module.exports = {
  createConversationTable,
  createConversation,
  getAllConversations,
  getConversationById,
};
