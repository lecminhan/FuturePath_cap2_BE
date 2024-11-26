const express = require('express');
const router = express.Router();
const pool = require('./db');

// lấy tổng doanh thu
router.get('/revenues', async (req, res) => {
  try {
    const result = await pool.query(`
      select sum(amount)
      from transactions
      where transaction_status ='COMPLETED'
      `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  } 
});
// lấy doanh thu 
router.get('/trans', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM transactions');
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    } 
  });
  //lấy giao dịch gần đây
  router.get('/user-transactions', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
    u.fullname AS user_name, 
    t.timestamp AS transaction_time, 
    t.amount AS transaction_amount,
	t.transaction_status as transaction_status
FROM 
    users u
JOIN 
    transactions t ON t.user_id = u.user_id
WHERE t.transaction_status='COMPLETED'
ORDER BY 
    t.timestamp DESC
LIMIT 4;
`);
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    } 
  });
  //get status
  router.get('/status', async (req, res) => {
    try {
      const result = await pool.query(`
        select status, COUNT(status) as NUM_OF_STATUS
        FROM machines
        GROUP BY status
        `);
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    } 
  });

// Xuất router
module.exports = router;