const express = require('express');
const router = express.Router();
const pool = require('./db');

// lấy tổng doanh thu
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT*FROM washing_types');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  } 
});

// Xuất router
module.exports = router;