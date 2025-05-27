const pool = require("../Database/db"); // Kết nối với cơ sở dữ liệu
const { database } = require("../config/FirebaseConfig"); // Import kết nối Firebase
// Tạo cuộc trò chuyện mới
// Biến ở module scope để lưu trữ current_conversation_id
let persistentConversationId = 1; // Giá trị mặc định

exports.createConversation = async (req, res) => {
  const {
    user_id,
    messages,
    response,
    create_new_conversation = false,
  } = req.body;

  // Sử dụng giá trị persistentConversationId nếu không có giá trị mới truyền về
  let current_conversation_id =
    req.body.current_conversation_id ?? persistentConversationId;

  try {
    let newConversation;

    // Kiểm tra nếu có tin nhắn để làm tiêu đề
    const title =
      messages && messages.length > 0 ? messages[0] : "Cuộc trò chuyện mới";

    // Nếu tạo cuộc trò chuyện mới
    if (create_new_conversation) {
      const createConversationQuery = `
        INSERT INTO "Conversation" (title)
        VALUES ($1)
        RETURNING id, title, created_at, updated_at;
      `;
      const conversationResult = await pool.query(createConversationQuery, [
        title,
      ]);

      if (conversationResult.rows.length > 0) {
        newConversation = conversationResult.rows[0];
        // Cập nhật cả current_conversation_id và persistentConversationId
        current_conversation_id = newConversation.id;
        persistentConversationId = current_conversation_id;
      } else {
        return res.status(500).send("Không thể tạo cuộc trò chuyện");
      }
    } else {
      // Nếu không tạo mới thì dùng ID hiện tại
      newConversation = { id: current_conversation_id };
      // Cập nhật persistentConversationId nếu có current_conversation_id mới được truyền về
      if (req.body.current_conversation_id) {
        persistentConversationId = current_conversation_id;
      }
    }

    // Tạo timestamp để dùng chung cho Firebase và PostgreSQL
    const timestamp = new Date().toISOString();

    // Firebase
    const historyRef = database.ref("ChatbotHistory");
    const conversationRef = historyRef.child(current_conversation_id.toString());
    const newMessageRef = conversationRef.push();

    await newMessageRef.set({
      message: messages,
      response: response,
      timestamp: timestamp,
      user_id: user_id,
      conversation_id: current_conversation_id,
    });

    // PostgreSQL
    const createChatHistoryQuery = `
      INSERT INTO "ChatbotHistory" (conversation_id, user_id, message, response, timestamp)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const chatResult = await pool.query(createChatHistoryQuery, [
      current_conversation_id,
      user_id,
      messages,
      response,
      timestamp,
    ]);

    if (chatResult.rows.length === 0) {
      return res.status(500).send("Không thể lưu tin nhắn vào lịch sử");
    }

    const newChat = chatResult.rows[0];

    res.status(201).json({
      message: "Cuộc trò chuyện và tin nhắn đã được tạo thành công",
      conversation_id: current_conversation_id,
      chat: newChat,
    });
  } catch (error) {
    console.error("Lỗi khi tạo cuộc trò chuyện:", error);
    res.status(500).send("Lỗi khi tạo cuộc trò chuyện");
  }
};

// Lấy danh sách tất cả cuộc trò chuyện
exports.getConversations = async (req, res) => {
  const query = 'SELECT * FROM "ChatbotHistory";';

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows); // Trả về tất cả cuộc trò chuyện
  } catch (error) {
    console.error("Lỗi khi lấy danh sách cuộc trò chuyện:", error);
    res.status(500).send("Lỗi khi lấy danh sách cuộc trò chuyện");
  }
};

// Lấy chi tiết cuộc trò chuyện và các tin nhắn liên quan
exports.getConversationById = async (req, res) => {
  const { id } = req.params;

  try {
    // Truy vấn thông tin cuộc trò chuyện bao gồm title và thời gian tạo, cập nhật
    const conversationQuery = 'SELECT * FROM "ChatbotHistory" WHERE id = $1;';
    const conversationResult = await pool.query(conversationQuery, [id]);

    if (conversationResult.rows.length === 0) {
      return res.status(404).send("Không tìm thấy cuộc trò chuyện");
    }

    const conversation = conversationResult.rows[0];

    // Truy vấn các tin nhắn liên quan đến cuộc trò chuyện
    const chatHistoryQuery =
      'SELECT * FROM "ChatbotHistory" WHERE conversation_id = $1 ORDER BY timestamp;';
    const chatHistoryResult = await pool.query(chatHistoryQuery, [id]);

    // Trả về cả cuộc trò chuyện và lịch sử tin nhắn
    res.status(200).json({
      conversation,
      chatHistory: chatHistoryResult.rows,
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết cuộc trò chuyện:", error);
    res.status(500).send("Lỗi khi lấy chi tiết cuộc trò chuyện");
  }
};
