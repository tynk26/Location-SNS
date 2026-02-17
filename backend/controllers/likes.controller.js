const { likes } = require("../storage/memory");

function addLike(req, res) {
  const { fromId, toId } = req.body;
  if (!fromId || !toId) return res.status(400).json({ error: "Missing IDs" });

  if (!likes.find((l) => l.fromId === fromId && l.toId === toId)) {
    likes.push({ fromId, toId });
  }

  return res.json({ success: true });
}

function getLikes(req, res) {
  return res.json(likes);
}

module.exports = { addLike, getLikes };
