const { users } = require("../storage/memory");
const { getDistance } = require("../utils/geo");

function registerUser(req, res) {
  const { nickname, bio, lat, lng } = req.body;
  const avatarFile = req.file;

  if (!nickname || !lat || !lng) {
    return res.status(400).json({ error: "nickname, lat, lng required" });
  }

  const newUser = {
    id: users.length + 1,
    username: nickname,
    nickname,
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
  return res.json(newUser);
}

function getAllUsers(req, res) {
  console.log("[SERVER] Returning users:", users.length);
  return res.json(users);
}

function getNearbyUsers(req, res) {
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
  return res.json(nearby);
}

module.exports = { registerUser, getAllUsers, getNearbyUsers };
