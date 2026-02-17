require("dotenv").config();
// console.log("Loaded Kakao Key:", process.env.KAKAO_REST_API_KEY);

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const http = require("http");
const axios = require("axios");
const { Server } = require("socket.io");

const app = express();
const PORT = 5000;

// ---- uploads ----
const upload = multer({ dest: path.join(__dirname, "uploads/") });

// ---- middleware ----
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  }),
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---- http server + socket.io ----
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ------------------------------
// In-memory storage
// ------------------------------
let users = [];
const likes = []; // { fromId, toId }

// ------------------------------
// Haversine distance (meters)
// ------------------------------
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ------------------------------
// Health
// ------------------------------
app.get("/api/health", (req, res) => {
  console.log("[SERVER] Health check called");
  res.json({ status: "ok" });
});

// ------------------------------
// Register user (multipart avatar)
// ------------------------------
app.post("/api/users", upload.single("avatar"), (req, res) => {
  const { nickname, bio, lat, lng } = req.body;
  const avatarFile = req.file;

  if (!nickname || !lat || !lng) {
    return res.status(400).json({ error: "nickname, lat, lng required" });
  }

  const newUser = {
    id: users.length + 1,
    username: nickname,
    nickname, // keep both if your frontend uses either
    profile: bio || "",
    bio: bio || "",
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    location: "현재 위치",
    avatar: avatarFile
      ? `/uploads/${avatarFile.filename}`
      : "https://via.placeholder.com/50",
  };

  users.push(newUser);
  res.json(newUser);
});

// ------------------------------
// Get all users
// ------------------------------
app.get("/api/users", (req, res) => {
  console.log("[SERVER] Returning users:", users.length);
  res.json(users);
});

// ------------------------------
// Get nearby users
// ------------------------------
app.get("/api/users/nearby", (req, res) => {
  const { lat, lng, radius = 1000 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat and lng required" });
  }

  const nearby = users.filter((user) => {
    const distance = getDistance(
      parseFloat(lat),
      parseFloat(lng),
      user.lat,
      user.lng,
    );
    return distance <= parseFloat(radius);
  });

  console.log("[SERVER] Nearby users:", nearby.length);
  res.json(nearby);
});

// ------------------------------
// Likes
// ------------------------------
app.post("/api/like", (req, res) => {
  const { fromId, toId } = req.body;
  if (!fromId || !toId) return res.status(400).json({ error: "Missing IDs" });

  if (!likes.find((l) => l.fromId === fromId && l.toId === toId)) {
    likes.push({ fromId, toId });
  }

  res.json({ success: true });
});

app.get("/api/likes", (req, res) => {
  res.json(likes);
});

// ======================================================
// Kakao Mobility Directions Proxy (TEST YOUR REST KEY)
// GET /api/kakao/directions?originLng=...&originLat=...&destLng=...&destLat=...
// ======================================================
app.get("/api/kakao/directions", async (req, res) => {
  try {
    const {
      originLng,
      originLat,
      destLng,
      destLat,
      priority = "RECOMMEND",
    } = req.query;

    if (!originLng || !originLat || !destLng || !destLat) {
      return res.status(400).json({
        error:
          "Missing query params: originLng, originLat, destLng, destLat (and optional priority)",
      });
    }

    // const KAKAO_REST_API_KEY = "33ac30cef7b985759b0904f9d9297737";
    const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

    if (!KAKAO_REST_API_KEY) {
      return res.status(500).json({
        error:
          "KAKAO_REST_API_KEY is not set (check your .env and dotenv load)",
      });
    }

    const url = "https://apis-navi.kakaomobility.com/v1/directions";

    const kakaoRes = await axios.get(url, {
      params: {
        origin: `${originLng},${originLat}`,
        destination: `${destLng},${destLat}`,
        priority,
      },
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
      timeout: 10000,
    });

    // Return raw Kakao response so you can inspect
    return res.json(kakaoRes.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const kakaoBody = err.response?.data || { message: err.message };

    console.error("[KAKAO] directions failed:", status, kakaoBody);

    return res.status(status).json({
      error: "Kakao directions request failed",
      status,
      kakao: kakaoBody,
    });
  }
});

// ------------------------------
// Socket.IO Chat
// ------------------------------
io.on("connection", (socket) => {
  console.log(`[SOCKET] connected: ${socket.id}`);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`[SOCKET] ${socket.id} joined room ${roomId}`);
  });

  // IMPORTANT: broadcast to ALL (including sender) so single-tab login switching also works
  socket.on("sendMessage", ({ roomId, fromUser, message }) => {
    if (!roomId || !fromUser || !message) return;
    io.to(roomId).emit("receiveMessage", { fromUser, message });
  });

  socket.on("disconnect", () => {
    console.log(`[SOCKET] disconnected: ${socket.id}`);
  });
});

// ------------------------------
// Start
// ------------------------------
server.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});
