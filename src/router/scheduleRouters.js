// routes/scheduleRoutes.js
const express = require("express");
const router = express.Router();

const {
  getAllConsultantSchedules,
  createConsultantSchedule,
} = require("../controller/scheduleController");

// GET tất cả lịch làm việc của expert
router.get("/consultant-schedules", getAllConsultantSchedules);

// POST tạo mới lịch làm việc
router.post("/consultant-schedules", createConsultantSchedule);

module.exports = router;
