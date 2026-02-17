const express = require("express");
const { addLike, getLikes } = require("../controllers/likes.controller");

const router = express.Router();

router.post("/like", addLike);
router.get("/likes", getLikes);

module.exports = router;
