const express = require('express');
const router = express.Router();
const pool = require('./db');

// Định nghĩa route để lấy danh sách người dùng
router.get('/totalrevenue', async (req, res) => {
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
//recent transactions
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
//today revenues
router.get('/machines_list', async (req, res) => {
  try {
    const result = await pool.query(`
    select sum(t.amount) as total_revenue,l.location_name,l.address,m .status, m.machine_id from transactions t
    join machines m on m.owner_id= t.user_id
    join locations l on l.location_id = m.location_id
    group by m.machine_id, l.location_id
`);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  } 
});
// machine informations
router.get('/machine-information', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query(`
        select m.machine_id, m.machine_name,l.location_name, l.address
        from machines m
        join locations l on m.location_id = l.location_id
`);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  } 
});

router.get('/transactions', async (req, res) => {
  try {
    const result = await pool.query("select*from transactions where transaction_status='COMPLETED'");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  } 
});
// Xuất router
module.exports = router;