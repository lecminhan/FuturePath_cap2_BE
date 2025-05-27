const pool = require("../Database/db");

// Quiz Controller
const quizController = {
  // Lấy tất cả quiz
  getAllQuizzes: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "Quiz"');
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching quizzes:", err.message);
      res.status(500).json({ error: "Server Error" });
    }
  },

  // Quiz Controller

  createQuizResult: async (req, res) => {
    const {
      user_id,
      quiz_id,
      // MBTI scores
      E_score = 0,
      I_score = 0,
      S_score = 0,
      N_score = 0,
      T_score = 0,
      F_score = 0,
      J_score = 0,
      P_score = 0,
      // Holland scores
      R_score = 0,
      I_score_h = 0,
      A_score_h = 0,
      S_score_h = 0,
      E_score_h = 0,
      C_score_h = 0,
      result,
    } = req.body;

    // Validate required fields
    if (!user_id || !quiz_id || !result) {
      return res.status(400).json({
        error: "Missing required fields: user_id, quiz_id, result",
        details: { received: req.body },
      });
    }

    // Kiểm tra loại quiz và định dạng kết quả tương ứng
    const quizType = quiz_id === 61 ? "Holland" : "MBTI"; // Giả sử quiz_id 13 là Holland

    if (quizType === "MBTI" && !/^[EI][SN][TF][JP]$/.test(result)) {
      return res.status(400).json({
        error: "Invalid MBTI result format. Must be 4 letters (e.g. 'ESTJ')",
        received: result,
      });
    }

    if (quizType === "Holland" && !/^[RIASEC]{2}$/.test(result)) {
      return res.status(400).json({
        error:
          "Invalid Holland result format. Must be 2 letters (e.g. 'RI', 'AS')",
        received: result,
      });
    }

    try {
      const query = `
  INSERT INTO "QuizResult" (
    user_id, quiz_id, quiz_type,
    "E_score", "I_score", "S_score", "N_score", "T_score", "F_score", "J_score", "P_score",
    "R_score", "I_score_h", "A_score_h", "S_score_h", "E_score_h", "C_score_h",
    result
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
  RETURNING *;
`;

      const values = [
        user_id,
        quiz_id,
        quizType, // Thêm trường quiz_type
        // MBTI scores
        Number(E_score),
        Number(I_score),
        Number(S_score),
        Number(N_score),
        Number(T_score),
        Number(F_score),
        Number(J_score),
        Number(P_score),
        // Holland scores
        Number(R_score),
        Number(I_score_h),
        Number(A_score_h),
        Number(S_score_h),
        Number(E_score_h),
        Number(C_score_h),
        result,
      ];

      const { rows } = await pool.query(query, values);

      res.status(201).json({
        success: true,
        data: rows[0],
        message: "Quiz result saved successfully",
      });
    } catch (error) {
      console.error("Error creating quiz result:", error);

      // Xử lý lỗi PostgreSQL
      if (error.code === "23505") {
        return res.status(409).json({
          error: "Duplicate entry",
          message: "This quiz result already exists",
        });
      }

      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    }
  },
  getLatestQuizResults: async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    try {
      const query = `
    (
        SELECT result, quiz_type
        FROM "QuizResult"
        WHERE user_id = $1 AND quiz_type = 'MBTI'
        ORDER BY id DESC
        LIMIT 1
      )
      UNION ALL
      (
        SELECT result, quiz_type
        FROM "QuizResult"
        WHERE user_id = $1 AND quiz_type = 'Holland'
        ORDER BY id DESC
        LIMIT 1
      )
      `;

      const { rows } = await pool.query(query, [user_id]);

      const mbti = rows.find((r) => r.quiz_type === "MBTI") || null;
      const holland = rows.find((r) => r.quiz_type === "Holland") || null;

      res.json({
        success: true,
        mbti,
        holland,
      });
    } catch (err) {
      console.error("Error fetching latest quiz results:", err.message);
      res.status(500).json({ error: "Server error", details: err.message });
    }
  },
};

module.exports = quizController;
