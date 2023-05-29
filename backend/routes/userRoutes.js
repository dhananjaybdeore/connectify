const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
module.exports = router;
