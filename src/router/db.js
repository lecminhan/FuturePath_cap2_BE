const { Pool } = require('pg');

// Cấu hình kết nối tới PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'laundry_system_db',
    password: 'Minhan0011.',
});

// Xuất pool để sử dụng ở nơi khác
module.exports = pool;
