const pool = require("../Database/db");
const { database } = require("../config/FirebaseConfig");

// Hàm format ngày từ "2025-05-16" thành "16/05/2025"
function formatDateDMY(dateStr) {
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

exports.createConsultation = async (req, res) => {
  const { user_id, expert_id, schedule_id, reason = '' } = req.body;

  if (!user_id || !expert_id || !schedule_id) {
    return res.status(400).json({ error: "Missing user_id, expert_id or schedule_id" });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Check user exists
    const userInfoRes = await client.query(`SELECT * FROM "UserInformation" WHERE user_id = $1`, [user_id]);
    if (userInfoRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: "User information not found" });
    }
    const userInfo = userInfoRes.rows[0];

    // 2. Check balance
    if (parseFloat(userInfo.account_balance) < 200000) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: "Insufficient account balance" });
    }

    // 3. Check expert & schedule exist
    const expertInfoRes = await client.query(`SELECT * FROM "ExpertInformation" WHERE id = $1`, [expert_id]);
    if (expertInfoRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: "Expert not found" });
    }

    const scheduleRes = await client.query(`SELECT * FROM "ConsultantSchedule" WHERE id = $1`, [schedule_id]);
    if (scheduleRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: "Schedule not found" });
    }
    const schedule = scheduleRes.rows[0];

    // Format ngày hiển thị trong message
    const formattedDate = formatDateDMY(schedule.available_date);

    // 4. Create consultation
    const insertConsultation = await client.query(`
      INSERT INTO "Consultation" (user_id, expert_id, schedule_id, reason, is_confirmed)
      VALUES ($1, $2, $3, $4, true)
      RETURNING id
    `, [user_id, expert_id, schedule_id, reason]);

    const consultationId = insertConsultation.rows[0].id;

    // 5. Deduct user balance
    await client.query(`
      UPDATE "UserInformation"
      SET account_balance = account_balance - 200000
      WHERE user_id = $1
    `, [user_id]);

    // 6. Add balance for expert (referenced by user_id in ExpertInformation)
    const expertUserId = expertInfoRes.rows[0].user_id;
    await client.query(`
      UPDATE "ExpertInformation"
      SET account_balance = account_balance + 200000
      WHERE user_id = $1
    `, [expertUserId]);

    // 7. Insert chat message from Expert
    const message = `Bạn đã đặt lịch thành công. Lịch hẹn vào lúc ${schedule.start_time} và kết thúc lúc ${schedule.end_time} ngày ${formattedDate}. Hãy trao đổi với Expert của bạn để nhận tư vấn.`;

    await client.query(`
      INSERT INTO "ChatMessage" (sender_type, message, timestamp, expert_id, user_id)
      VALUES ('Expert', $1, NOW(), $2, $3)
    `, [message, expert_id, user_id]);

    // 8. Push chat message and notification to Firebase Realtime Database
    try {
      console.log("Preparing to push chat message to Firebase:", { message, expert_id, user_id, consultationId });
      const newMessageRef = database.ref('chatMessages').push();
      await newMessageRef.set({
        sender_type: 'Expert',
        message,
        timestamp: Date.now(),
        expert_id,
        user_id,
        consultation_id: consultationId
      });
      console.log("Firebase chat message pushed successfully");

      const notificationMessage = `Bạn có lịch tư vấn mới vào lúc ${schedule.start_time} ngày ${formattedDate}.`;
      console.log("Preparing to push notification to Firebase:", { notificationMessage, user_id, expert_id, consultationId });
      const newNotificationRef = database.ref('notifications').push();
      await newNotificationRef.set({
        user_id,
        expert_id,
        consultation_id: consultationId,
        message: notificationMessage,
        timestamp: Date.now(),
        read: false
      });
      console.log("Firebase notification pushed successfully");
    } catch (firebaseError) {
      console.error("Firebase push error:", firebaseError);
      // Don't rollback main transaction for Firebase errors
    }

    // 9. Insert transaction record
    await client.query(`
      INSERT INTO "Transaction" (user_id, expert_id, amount, transaction_date, transaction_status)
      VALUES ($1, $2, 200000, NOW(), 'complete')
    `, [user_id, expert_id]);

    await client.query('COMMIT');

    res.status(201).json({
      message: "Consultation created successfully",
      consultation_id: consultationId
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Transaction Error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};
exports.getConsultations = async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT 
        c.id, 
        c.reason, 
        c.is_confirmed, 
        c.created_at, 
        c.user_id AS student_id,         -- Trường học sinh
        u.username AS user_name,          -- Tên học sinh
        e.user_id AS expert_user_id,      
        u2.username AS expert_name        
      FROM "Consultation" c
      JOIN "User" u ON c.user_id = u.id
      JOIN "ExpertInformation" e ON c.expert_id = e.user_id
      JOIN "User" u2 ON e.user_id = u2.id  
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No consultations found" });
    }

    return res.status(200).json({
      consultations: result.rows,
    });
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};
