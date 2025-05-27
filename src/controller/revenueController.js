const pool = require("../Database/db");

// Hàm lấy doanh thu và số lượng cuộc hẹn cho mỗi chuyên gia trong tháng hiện tại và tháng trước
exports.getExpertMonthlyRevenueAndAppointments = async (req, res) => {
  const { expert_id } = req.params;  // Lấy expert_id từ tham số URL

  if (!expert_id) {
    return res.status(400).json({ error: "Expert ID is required" });
  }

  const client = await pool.connect();

  try {
    // Lấy ngày đầu tháng hiện tại và tháng trước
    const currentDate = new Date();
    const firstDayCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const firstDayLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

    // Truy vấn doanh thu tháng hiện tại
    const revenueCurrentMonthResult = await client.query(`
      SELECT SUM(amount) AS total_revenue
      FROM "Transaction"
      WHERE expert_id = $1
        AND transaction_date >= $2
        AND transaction_date < $3
    `, [expert_id, firstDayCurrentMonth, currentDate]);

    const totalRevenueCurrentMonth = revenueCurrentMonthResult.rows[0].total_revenue || 0;

    // Truy vấn doanh thu tháng trước
    const revenueLastMonthResult = await client.query(`
      SELECT SUM(amount) AS total_revenue
      FROM "Transaction"
      WHERE expert_id = $1
        AND transaction_date >= $2
        AND transaction_date < $3
    `, [expert_id, firstDayLastMonth, firstDayCurrentMonth]);

    const totalRevenueLastMonth = revenueLastMonthResult.rows[0].total_revenue || 0;

    // Truy vấn số lượng cuộc hẹn tháng hiện tại
    const appointmentsCurrentMonthResult = await client.query(`
      SELECT COUNT(*) AS total_appointments
      FROM "Consultation"
      WHERE expert_id = $1  -- Lưu ý sử dụng expert_id thay vì expert_user_id
        AND created_at >= $2
        AND created_at < $3
    `, [expert_id, firstDayCurrentMonth, currentDate]);

    const totalAppointmentsCurrentMonth = appointmentsCurrentMonthResult.rows[0].total_appointments || 0;

    // Truy vấn số lượng cuộc hẹn tháng trước
    const appointmentsLastMonthResult = await client.query(`
      SELECT COUNT(*) AS total_appointments
      FROM "Consultation"
      WHERE expert_id = $1  -- Lưu ý sử dụng expert_id thay vì expert_user_id
        AND created_at >= $2
        AND created_at < $3
    `, [expert_id, firstDayLastMonth, firstDayCurrentMonth]);

    const totalAppointmentsLastMonth = appointmentsLastMonthResult.rows[0].total_appointments || 0;

    // Trả về kết quả doanh thu và số lượng cuộc hẹn
    return res.status(200).json({
      expert_id: expert_id,
      total_revenue_current_month: totalRevenueCurrentMonth,
      total_revenue_last_month: totalRevenueLastMonth,
      total_appointments_current_month: totalAppointmentsCurrentMonth,
      total_appointments_last_month: totalAppointmentsLastMonth,
    });

  } catch (error) {
    console.error("Error fetching expert revenue and appointments:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
  
};
// Hàm lấy doanh thu 3 tháng gần nhất của chuyên gia theo expert_id
exports.getExpertRevenueLastThreeMonths = async (req, res) => {
  const { expert_id } = req.params;  // Lấy expert_id từ tham số URL

  if (!expert_id) {
    return res.status(400).json({ error: "Expert ID is required" });
  }

  const client = await pool.connect();

  try {
    // Lấy ngày hiện tại và tính ngày đầu tháng của 3 tháng gần nhất
    const currentDate = new Date();
    const firstDayCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const firstDayLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const firstDayMonthBeforeLast = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);

    // Truy vấn doanh thu 3 tháng gần nhất cho expert_id
    const revenueResult = await client.query(`
      SELECT
        EXTRACT(MONTH FROM transaction_date) AS month,
        EXTRACT(YEAR FROM transaction_date) AS year,
        SUM(amount) AS total_revenue
      FROM "Transaction"
      WHERE expert_id = $1
        AND transaction_date >= $2
      GROUP BY year, month
      ORDER BY year DESC, month DESC
      LIMIT 3
    `, [expert_id, firstDayMonthBeforeLast]);

    // Nếu không có dữ liệu doanh thu cho chuyên gia, trả về thông báo lỗi
    if (revenueResult.rows.length === 0) {
      return res.status(404).json({ message: "No revenue data found for this expert in the last 3 months" });
    }

    // Trả về kết quả doanh thu của 3 tháng gần nhất
    return res.status(200).json({
      expert_id: expert_id,
      revenue_last_three_months: revenueResult.rows
    });

  } catch (error) {
    console.error("Error fetching expert revenue for the last 3 months:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};

exports.getExpertSchedule = async (req, res) => {
  const { expert_id } = req.params;  // Lấy expert_id từ tham số URL

  if (!expert_id) {
    return res.status(400).json({ error: "Expert ID is required" });
  }

  const client = await pool.connect();

  try {
    // Lấy thời gian hiện tại
    const currentDateTime = new Date();

    // Truy vấn lịch của chuyên gia sau thời gian hiện tại
    const scheduleResult = await client.query(`
      SELECT expert_id, available_date, start_time, end_time
      FROM "ConsultantSchedule"
      WHERE expert_id = $1
        AND available_date > $2  -- Lọc lịch sau ngày hiện tại
        OR (available_date = $2 AND start_time > $3)  -- Lọc lịch sau giờ hiện tại nếu cùng ngày
      ORDER BY available_date, start_time
    `, [expert_id, currentDateTime.toISOString().split('T')[0], currentDateTime.toISOString().split('T')[1].slice(0, 5)]);

    // Nếu không có lịch, trả về thông báo không có dữ liệu
    if (scheduleResult.rows.length === 0) {
      return res.status(404).json({ message: "No schedule found for this expert" });
    }

    // Trả về kết quả lịch của chuyên gia
    return res.status(200).json({
      expert_id: expert_id,
      schedule: scheduleResult.rows
    });

  } catch (error) {
    console.error("Error fetching expert schedule:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};
exports.getTransactionsByExpertId = async (req, res) => {
  const { expert_id } = req.params;  // Lấy expert_id từ tham số URL

  if (!expert_id) {
    return res.status(400).json({ error: "Expert ID is required" });
  }

  const client = await pool.connect();

  try {
    // SQL query to fetch transactions and join with User table to get username
    const query = `
      SELECT 
        t.id AS transaction_id,
        t.amount, 
        t.transaction_date, 
        t.transaction_status, 
        u.username AS user_username,
        e.username AS expert_username
      FROM 
        "Transaction" t
      LEFT JOIN 
        "User" u ON t.user_id = u.id
      LEFT JOIN 
        "User" e ON t.expert_id = e.id
      WHERE 
        t.expert_id = $1
    `;

    // Execute the query
    const { rows } = await client.query(query, [expert_id]);

    // If no transactions are found, return a message
    if (rows.length === 0) {
      return res.status(404).json({ message: "No transactions found for this expert" });
    }

    // Return the transactions data
    return res.status(200).json({
      expert_id: expert_id,
      transactions: rows
    });

  } catch (error) {
    console.error("Error fetching transactions by expert_id:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};