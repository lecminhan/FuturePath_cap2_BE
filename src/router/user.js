// users.js
const express = require('express');
const router = express.Router();
const pool = require('./db');

// Định nghĩa route để lấy danh sách người dùng
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
    select *,    TO_CHAR(last_login_at, 'YYYY-MM-DD') AS last_login_at_date,  
    TO_CHAR(last_login_at, 'HH24:MI:SS') AS last_login_at_hour,
	TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at_date, 
    TO_CHAR(created_at, 'HH24:MI:SS') AS created_at_hour 
	from users
      `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  } 
});
 
// Xuất router
module.exports = router;
