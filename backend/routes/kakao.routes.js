const express = require("express");
const { kakaoDirections } = require("../controllers/kakao.controller");

const router = express.Router();
router.get("/kakao/directions", kakaoDirections);

module.exports = router;
