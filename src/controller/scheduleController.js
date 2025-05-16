// scheduleController.js
const pool = require("../Database/db");

// Lấy tất cả lịch trong bảng ConsultantSchedule
const getAllConsultantSchedules = async (req, res) => {
  try {
    const query =
      'SELECT * FROM "ConsultantSchedule" ORDER BY available_date, start_time;';
    const { rows } = await pool.query(query);
    return res.status(200).json({ success: true, schedules: rows });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Thêm lịch mới cho expert
const createConsultantSchedule = async (req, res) => {
  const schedules = req.body;

  // Nếu req.body là object đơn lẻ, gói thành mảng 1 phần tử để xử lý chung
  const schedulesArray = Array.isArray(schedules) ? schedules : [schedules];

  if (schedulesArray.length === 0) {
    return res.status(400).json({ error: "Dữ liệu đầu vào không được rỗng" });
  }

  try {
    const insertedSchedules = [];

    for (const schedule of schedulesArray) {
      const { expert_id, available_date, start_time, end_time } = schedule;

      if (!expert_id || !available_date || !start_time || !end_time) {
        return res
          .status(400)
          .json({ error: "Thiếu trường dữ liệu trong một lịch" });
      }

      // Kiểm tra trùng lịch
      const checkQuery = `
        SELECT * FROM "ConsultantSchedule"
        WHERE expert_id = $1 AND available_date = $2 
          AND start_time = $3 AND end_time = $4
      `;
      const checkValues = [expert_id, available_date, start_time, end_time];
      const checkResult = await pool.query(checkQuery, checkValues);

      if (checkResult.rows.length > 0) {
        return res.status(400).json({
          error: `Lịch làm việc ${available_date} ${start_time}-${end_time} đã tồn tại cho chuyên gia ${expert_id}`,
        });
      }

      // Thêm lịch mới
      const insertQuery = `
        INSERT INTO "ConsultantSchedule" (expert_id, available_date, start_time, end_time)
        VALUES ($1, $2, $3, $4) RETURNING *;
      `;
      const values = [expert_id, available_date, start_time, end_time];
      const { rows } = await pool.query(insertQuery, values);

      insertedSchedules.push(rows[0]);
    }

    // Nếu chỉ có 1 lịch đầu vào, trả về object, nếu nhiều lịch trả về mảng
    if (insertedSchedules.length === 1) {
      res.status(201).json({ success: true, schedule: insertedSchedules[0] });
    } else {
      res.status(201).json({ success: true, schedules: insertedSchedules });
    }
  } catch (error) {
    console.error("Error creating schedule(s):", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getSchedulesByExpertId = async (req, res) => {
  try {
    const expertId = req.params.expertId;

    if (!expertId) {
      return res.status(400).json({ error: "Thiếu expert_id" });
    }

    const query = `
      SELECT * FROM "ConsultantSchedule"
      WHERE expert_id = $1
      ORDER BY available_date, start_time
    `;
    const values = [expertId];
    const { rows } = await pool.query(query, values);

    return res.status(200).json({ success: true, schedules: rows });
  } catch (error) {
    console.error("Error fetching schedules by expert_id:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  getAllConsultantSchedules,
  createConsultantSchedule,
  getSchedulesByExpertId
};
