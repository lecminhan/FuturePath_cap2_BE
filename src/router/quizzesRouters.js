const express = require("express");
const router = express.Router();
const {
  getAllQuizzes,
  createQuizResult,
  getLatestQuizResults,
} = require("../controller/quizController");
// lấy tổng doanh thu
router.get("/question", getAllQuizzes);
router.post("/results", createQuizResult);
router.get("/quiz-result/latest/:user_id", getLatestQuizResults);

module.exports = router;
