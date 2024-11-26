const express = require('express');
const router = express.Router();
const pool = require('./db');

// Định nghĩa route để lấy danh sách người dùng
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM machines');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  } 
});

router.get('/machine_list', async (req, res) => {
  try {
    const result = await pool.query(`
   SELECT 
    m.machine_id,
    l.location_name,
    l.address,
    CASE 
        WHEN m.status IN ('AVAILABLE', 'UNDER_MAINTENANCE') THEN NULL 
        ELSE u.user_id 
    END AS user_id,
    CASE 
        WHEN m.status IN ('AVAILABLE', 'UNDER_MAINTENANCE') THEN NULL 
        ELSE u.fullname 
    END AS fullname,
    m.status,
    ROUND(SUM(EXTRACT(EPOCH FROM (uh.end_time - uh.start_time)) / 3600.0), 2) AS total_time_used -- Tính tổng thời gian sử dụng theo giờ và làm tròn 2 chữ số thập phân
FROM 
    machines m
JOIN 
    locations l ON l.location_id = m.location_id
LEFT JOIN 
    users u ON u.user_id = m.owner_id
LEFT JOIN 
    usage_histories uh ON uh.machine_id = m.machine_id
GROUP BY 
    m.machine_id, l.location_name, l.address, u.user_id, u.fullname, m.status
ORDER BY 
    m.machine_id;
        `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  } 
});

router.get('/usage-histories', async (req, res) => {
  try {
    const result = await pool.query(`
    select     *,TO_CHAR(start_time, 'YYYY-MM-DD') AS start_date,
    TO_CHAR(start_time, 'HH24:MI:SS') AS start_time,  
    TO_CHAR(end_time, 'YYYY-MM-DD') AS end_date,      
    TO_CHAR(end_time, 'HH24:MI:SS') AS end_time from usage_histories
      `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  } 
});

// Xuất router
module.exports = router;