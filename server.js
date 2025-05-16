require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./src/router/authRouters");
const quizzesRoutes = require("./src/router/quizzesRouters");
const conversation = require("./src/router/ConversationRoutes");
const chatbot = require("./src/router/chatRoutes"); // Import route chatbot
const expert = require("./src/router/expertRouters");
const schedule = require("./src/router/scheduleRouters");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(cors());
// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
// CORS (nếu dùng frontend riêng)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizzesRoutes);
app.use("/api/conversation", conversation);
app.use("/api/chatbot", chatbot);
app.use("/api/getexpert", expert);
app.use("/api/schedule", schedule);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
