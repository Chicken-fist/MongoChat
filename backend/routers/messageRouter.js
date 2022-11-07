const express = require("express");
const { project } = require("../middleware/authenMiddleware");
const {
  sendMessage,
  getAllMessages,
  recallMessage,
  getAllImageMessages,
} = require("../controller/messageController");

const router = express.Router();
router.route("/").post(project, sendMessage);
router.route("/recallMessage").post(project, recallMessage);
router.route("/:chatId").get(project, getAllMessages);
router.route("/image/:chatId").get(project, getAllImageMessages);

module.exports = router;
