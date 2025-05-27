const express = require('express');
const router = express.Router();
const { getExpertMonthlyRevenueAndAppointments, getExpertRevenueLastThreeMonths, getExpertSchedule,getTransactionsByExpertId } = require('../controller/revenueController');

// Route to get revenue and appointments count for each expert
router.get('/revenue/:expert_id', getExpertMonthlyRevenueAndAppointments);
router.get('/:expert_id/revenue/last-three-months', getExpertRevenueLastThreeMonths);
router.get('/:expert_id/schedule', getExpertSchedule);
router.get('/transactions/:expert_id', getTransactionsByExpertId);
module.exports = router;
