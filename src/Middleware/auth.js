const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("Authentication invalid");
    }

    const token = authHeader.split(" ")[1]; // Lấy phần token sau "Bearer "

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Gán thông tin user vào request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: "Authentication failed",
      details: error.message,
    });
  }
};

module.exports = authenticate;
