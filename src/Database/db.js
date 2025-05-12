const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "turntable.proxy.rlwy.net",
  database: "railway",
  password: "MBRciGDWNvShKHLdNioiONHjcyjSnwuq", // Thay thế bằng mật khẩu thực tế
  port: 57668,
  max: 20,
  idleTimeoutMillis: 30000,
});

pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ Đã kết nối PostgreSQL"))
  .catch((err) => console.error("❌ Lỗi kết nối PostgreSQL:", err));

module.exports = pool;
