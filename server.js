const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/router/user'); // Đường dẫn đến file users.js
const machinesRoutes = require('./src/router/machine');
const dashboardRoutes= require('./src/router/dashboard');
const revenueRoutes= require('./src/router/revenue')
const app = express();
const port = 3004;

app.use(cors());  // Thêm middleware CORS

// Sử dụng router cho API
app.use('/api/users', userRoutes);

app.use('/api/machines', machinesRoutes);

app.use('/api/dashboard',dashboardRoutes);

app.use('/api/revenue',revenueRoutes);
// Bắt đầu server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
