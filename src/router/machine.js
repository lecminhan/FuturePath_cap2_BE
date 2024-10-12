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

// Xuất router
module.exports = router;