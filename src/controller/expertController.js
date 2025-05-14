const pool = require("../Database/db");

exports.getExperts = async (req, res) => {
  try {
    const query = `
      SELECT ei.*, u.username
      FROM "ExpertInformation" ei
      JOIN "User" u ON ei.user_id = u.id;
    `;

    const result = await pool.query(query);

    res.status(200).json({
      message: "Dữ liệu chuyên gia và người dùng đã được lấy thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu chuyên gia:", error);
    res.status(500).send("Lỗi khi lấy dữ liệu chuyên gia");
  }
};
