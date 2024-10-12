const express = require('express');
const router = express.Router();
const pool = require('./db');

// Định nghĩa route để lấy danh sách người dùng
router.get('/totalrevenue', async (req, res) => {
  try {
    const result = await pool.query('SELECT SUM(amount) FROM transactions');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  } 
});
//recent transactions
router.get('/user-transactions', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
    users.fullname AS user_name, 
    transactions.timestamp AS transaction_time, 
    transactions.amount AS transaction_amount
FROM 
    users 
JOIN 
    transactions ON users.user_id = transactions.user_id
LIMIT 4;
`);
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    } 
  });
  
// Xuất router
module.exports = router;