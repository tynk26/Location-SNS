const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const upload = multer({ dest: path.join(__dirname, "uploads/") });

app.use(cors());
app.use(express.json());

/* ---------------------------
   In-Memory Storage
---------------------------- */
let users = [];
let likes = [];

/* ---------------------------
   Health
---------------------------- */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ---------------------------
   Users
---------------------------- */
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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/users", (req, res) => {
  res.json(users);
});

/* ---------------------------
   Likes
---------------------------- */
app.post("/api/like", (req, res) => {
  const { fromId, toId } = req.body;
  if (!fromId || !toId) return res.status(400).json({ error: "Missing IDs" });

  if (!likes.find((l) => l.fromId === fromId && l.toId === toId)) {
    likes.push({ fromId, toId });
  }

  res.json({ success: true });
});

/* ===========================
   SOCKET.IO CHAT
=========================== */

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(socket.id, "joined", roomId);
  });

  socket.on("sendMessage", ({ roomId, fromUser, message }) => {
    // Broadcast to EVERYONE including sender
    io.to(roomId).emit("receiveMessage", {
      fromUser,
      message,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* ---------------------------
   Start Server
---------------------------- */
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
