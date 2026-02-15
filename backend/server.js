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
let nearbyUsers = [];
/*
  Haversine Formula
  Returns distance in meters
*/
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
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

/*
  Get Nearby Users
  Query: lat, lng, radius (meters)
*/
app.get("/api/users/nearby", (req, res) => {
  const { lat, lng, radius = 1000 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat and lng required" });
  }

  const nearbyUsers = users.filter((user) => {
    const distance = getDistance(
      parseFloat(lat),
      parseFloat(lng),
      user.lat,
      user.lng,
    );

    return distance <= radius;
  });

  console.log("[SERVER] Nearby users:", nearbyUsers.length);

  res.json(nearbyUsers);
});

app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});
