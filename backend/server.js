const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/*
  In-memory user storage
  Later → DB (Mongo/Postgres)
*/
let users = [];

/*
  Health Check
*/
app.get("/api/health", (req, res) => {
  console.log("[SERVER] Health check called");
  res.json({ status: "ok" });
});

/*
  Register User
*/
app.post("/api/users", (req, res) => {
  const { nickname, bio, lat, lng } = req.body;

  console.log("[SERVER] New user received:", req.body);

  const newUser = {
    id: Date.now(),
    nickname,
    bio,
    lat,
    lng,
  };

  users.push(newUser);

  res.json(newUser);
});

/*
  Get All Users
*/
app.get("/api/users", (req, res) => {
  console.log("[SERVER] Returning users:", users.length);
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});
