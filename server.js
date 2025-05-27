require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import các router
const authRoutes = require("./src/router/authRouters");
const quizzesRoutes = require("./src/router/quizzesRouters");
const conversation = require("./src/router/ConversationRoutes");
const chatbot = require("./src/router/chatRoutes");
const expert = require("./src/router/expertRouters");
const schedule = require("./src/router/scheduleRouters");
const consultation = require("./src/router/consultationRouter");
const chatMessageRouter = require("./src/router/messageRouters"); // <-- Import đúng tên biến và file router
const revenue = require("./src/router/revenueRouters"); 
const getUserDataByRole = require("./src/router/getUserDataByRoleRouters")
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// CORS headers nếu frontend riêng
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Các route chính
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizzesRoutes);
app.use("/api/conversation", conversation);
app.use("/api/chatbot", chatbot);
app.use("/api/getexpert", expert);
app.use("/api/schedule", schedule);
app.use("/api/consultation", consultation);
app.use("/api/expert",revenue)
app.use("/api/chat", chatMessageRouter);
app.use("/api/data", getUserDataByRole);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
