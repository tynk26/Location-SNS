const express = require("express");
const { upload } = require("../middleware/upload");
const {
  registerUser,
  getAllUsers,
  getNearbyUsers,
} = require("../controllers/user.controllers");

const router = express.Router();

router.post("/users", upload.single("avatar"), registerUser);
router.get("/users", getAllUsers);
router.get("/users/nearby", getNearbyUsers);

module.exports = router;
