const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

const userControllers = require("../controllers/userControllers");

router.route("/").post(userControllers.registerUser);
router.post("/login", userControllers.authUser);
module.exports = router;
