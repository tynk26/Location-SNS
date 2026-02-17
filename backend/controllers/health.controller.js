function healthCheck(req, res) {
  console.log("[SERVER] Health check called");
  res.json({ status: "ok" });
}

module.exports = { healthCheck };
