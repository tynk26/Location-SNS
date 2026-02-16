const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const upload = multer({ dest: path.join(__dirname, "uploads/") });
const app = express();
const PORT = 5000;

// Wrap express app with http server
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // Change to frontend origin in production
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

/* ------------------------------
  In-memory user storage
------------------------------ */
let users = [];
let likes = []; // { fromId, toId }

/* ------------------------------
  Haversine Formula for distance
------------------------------ */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ------------------------------
  Health Check
------------------------------ */
app.get("/api/health", (req, res) => {
  console.log("[SERVER] Health check called");
  res.json({ status: "ok" });
});

/* ------------------------------
  User Registration
------------------------------ */
app.post("/api/users", upload.single("avatar"), (req, res) => {
  const { nickname, bio, lat, lng } = req.body;
  const avatarFile = req.file;

  const newUser = {
    id: users.length + 1,
    nickname,
    bio,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    avatar: avatarFile
      ? `/uploads/${avatarFile.filename}`
      : "https://via.placeholder.com/50",
  };

  users.push(newUser);
  res.json(newUser);
});

// Serve uploaded avatars
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ------------------------------
  Get All Users
------------------------------ */
app.get("/api/users", (req, res) => {
  res.json(users);
});

/* ------------------------------
  Get Nearby Users
------------------------------ */
app.get("/api/users/nearby", (req, res) => {
  const { lat, lng, radius = 1000 } = req.query;
  if (!lat || !lng)
    return res.status(400).json({ error: "lat and lng required" });

  const nearby = users.filter((user) => {
    return (
      getDistance(parseFloat(lat), parseFloat(lng), user.lat, user.lng) <=
      radius
    );
  });

  res.json(nearby);
});

/* ------------------------------
  Likes API
------------------------------ */
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

/* ------------------------------
  Socket.IO Chat
------------------------------ */
io.on("connection", (socket) => {
  console.log(`[SOCKET] User connected: ${socket.id}`);

  // Join a chat room (optional, for user-to-user chat)
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`[SOCKET] ${socket.id} joined room ${roomId}`);
  });

  // Listen for new messages
  socket.on("sendMessage", ({ roomId, fromUser, message }) => {
    console.log(`[SOCKET] Message from ${fromUser}: ${message}`);
    // Broadcast to everyone in the room except sender
    socket.to(roomId).emit("receiveMessage", { fromUser, message });
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`[SOCKET] User disconnected: ${socket.id}`);
  });
});

/* ------------------------------
  Start Server
------------------------------ */
server.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});

// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const path = require("path");
// const upload = multer({ dest: path.join(__dirname, "uploads/") });
// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// /*
//   In-memory user storage
//   Later → DB (Mongo/Postgres)
// */
// let users = [];
// let nearbyUsers = [];
// /*
//   Haversine Formula
//   Returns distance in meters
// */
// function getDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371000; // Earth radius in meters
//   const toRad = (value) => (value * Math.PI) / 180;

//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRad(lat1)) *
//       Math.cos(toRad(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c;
// }

// /*
//   Health Check
// */
// app.get("/api/health", (req, res) => {
//   console.log("[SERVER] Health check called");
//   res.json({ status: "ok" });
// });

// /*
//   Register User
// */
// // 기존 app.post("/api/users") 대체
// app.post("/api/users", upload.single("avatar"), (req, res) => {
//   const { nickname, bio, lat, lng } = req.body;
//   const avatarFile = req.file;

//   const newUser = {
//     id: users.length + 1,
//     nickname,
//     bio,
//     lat: parseFloat(lat),
//     lng: parseFloat(lng),
//     avatar: avatarFile
//       ? `/uploads/${avatarFile.filename}`
//       : "https://via.placeholder.com/50",
//   };

//   users.push(newUser);
//   res.json(newUser);
// });

// // 정적 파일 제공
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// // app.post("/api/users", (req, res) => {
// //   const { nickname, bio, lat, lng } = req.body;
// //   console.log("[SERVER] New user received:", req.body);
// //   const newUser = {
// //     id: Date.now(),
// //     nickname,
// //     bio,
// //     lat,
// //     lng,
// //   };

// //   users.push(newUser);
// //   res.json(newUser);
// // });

// /*
//   Get All Users
// */
// app.get("/api/users", (req, res) => {
//   console.log("[SERVER] Returning users:", users.length);
//   res.json(users);
// });

// /*
//   Get Nearby Users
//   Query: lat, lng, radius (meters)
// */
// app.get("/api/users/nearby", (req, res) => {
//   const { lat, lng, radius = 1000 } = req.query;

//   if (!lat || !lng) {
//     return res.status(400).json({ error: "lat and lng required" });
//   }

//   const nearbyUsers = users.filter((user) => {
//     const distance = getDistance(
//       parseFloat(lat),
//       parseFloat(lng),
//       user.lat,
//       user.lng,
//     );

//     return distance <= radius;
//   });

//   console.log("[SERVER] Nearby users:", nearbyUsers.length);

//   res.json(nearbyUsers);
// });

// const likes = []; // { fromId, toId }

// // 좋아요 등록 엔드포인트
// app.post("/api/like", (req, res) => {
//   const { fromId, toId } = req.body;
//   if (!fromId || !toId) return res.status(400).json({ error: "Missing IDs" });

//   // 중복 방지
//   if (!likes.find((l) => l.fromId === fromId && l.toId === toId)) {
//     likes.push({ fromId, toId });
//   }

//   res.json({ success: true });
// });

// // 좋아요 확인 엔드포인트 (optional)
// app.get("/api/likes", (req, res) => {
//   res.json(likes);
// });
// app.listen(PORT, () => {
//   console.log(`[SERVER] Running on http://localhost:${PORT}`);
// });
