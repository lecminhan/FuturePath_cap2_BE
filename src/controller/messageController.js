const pool = require("../Database/db");
const { database } = require("../config/FirebaseConfig");

// Hàm format timestamp về "YYYY-MM-DD HH:mm:ss"
const formatTimestamp = (date) => {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
};

exports.sendMessage = async (req, res) => {
  const { sender_type, message, expert_id, user_id, consultation_id = null } = req.body;

  if (!sender_type || !message || !expert_id || !user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insert message vào bảng ChatMessage PostgreSQL
    const insertResult = await client.query(`
      INSERT INTO "ChatMessage" (sender_type, message, timestamp, expert_id, user_id)
      VALUES ($1, $2, NOW(), $3, $4)
      RETURNING id, timestamp
    `, [sender_type, message, expert_id, user_id]);

    const insertedId = insertResult.rows[0].id;
    const insertedTimestamp = insertResult.rows[0].timestamp;

    await client.query('COMMIT');

    // 2. Đẩy message lên Firebase Realtime Database
    try {
      const newMessageRef = database.ref('chatMessages').push();
      await newMessageRef.set({
        id: insertedId,
        sender_type,
        message,
        timestamp: formatTimestamp(insertedTimestamp), // timestamp dạng chuỗi đẹp
        expert_id,
        user_id,
        consultation_id
      });
      console.log("Firebase chat message pushed successfully");
    } catch (firebaseError) {
      console.error("Firebase push error:", firebaseError);
      // Không rollback DB nếu Firebase lỗi
    }

    // 3. Trả response về client với timestamp đã format
    return res.status(201).json({
      message: "Message sent successfully",
      message_id: insertedId,
      timestamp: formatTimestamp(insertedTimestamp)
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error sending message:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};
