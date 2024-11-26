const express = require('express');
const router = express.Router();
const pool = require('./db');

router.get('/', async (req, res) => {
    try {
      const result = await pool.query(`
        select*, TO_CHAR(timestamp, 'YYYY-MM-DD') AS date,  
        TO_CHAR(timestamp, 'HH24:MI:SS') AS hours 
        from transactions
        `);
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    } 
  });

  router.get('/transactions_table', async (req, res) => {
    try {
      const result = await pool.query(`
        select t.transaction_id,t.amount, t.transaction_status, u.fullname, TO_CHAR(timestamp, 'YYYY-MM-DD') AS date,  -- Tách ngày
        TO_CHAR(timestamp, 'HH24:MI:SS') AS hours 
	    from transactions t
	    join users u on u.user_id = t.user_id
        `);
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    } 
  });

  module.exports = router;