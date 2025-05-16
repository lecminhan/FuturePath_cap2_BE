// routes/scheduleRoutes.js
const express = require("express");
const router = express.Router();

const {
  getAllConsultantSchedules,
  createConsultantSchedule,
    getSchedulesByExpertId,
} = require("../controller/scheduleController");

// GET tất cả lịch làm việc của expert
router.get("/consultant-schedules", getAllConsultantSchedules);
router.post("/consultant-schedules", createConsultantSchedule);
router.get("/consultant-schedules/:expertId", getSchedulesByExpertId);
module.exports = router;
