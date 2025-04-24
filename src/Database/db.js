const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "FuturePath",
  password: "Minhan0011.", // Thay thế bằng mật khẩu thực tế
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
});

pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ Đã kết nối PostgreSQL"))
  .catch((err) => console.error("❌ Lỗi kết nối PostgreSQL:", err));

module.exports = pool;
