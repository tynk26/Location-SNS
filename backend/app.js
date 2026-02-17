const express = require("express");
const cors = require("cors");
const path = require("path");

const healthRoutes = require("./routes/health.routes");
const usersRoutes = require("./routes/users.routes");
const likesRoutes = require("./routes/likes.routes");
const kakaoRoutes = require("./routes/kakao.routes");

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST"],
    }),
  );

  app.use(express.json());

  // static uploads
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // routes
  app.use("/api", healthRoutes);
  app.use("/api", usersRoutes);
  app.use("/api", likesRoutes);
  app.use("/api", kakaoRoutes);

  return app;
}

module.exports = { createApp };
