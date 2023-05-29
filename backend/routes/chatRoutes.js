const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChat } = require("../controllers/chatControllers");

const router = express.Router();
router.route("/").post(protect, accessChat); //for creating new  1:1 chats . If there is already, we are fetching that chat

router.route("/").get(protect, fetchChat); //for fetching 1:1 chats
// router.route("/group").post(protect, createGroupChat);
// router.route("/rename").put(protect, renameGroup);
// router.route("/groupremove").put(protect, removeFromGroup);
// router.route("/groupadd").put(protect, addToGroup);

module.exports = router;
