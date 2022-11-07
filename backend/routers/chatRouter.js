const express = require("express");
const {
  accessChat,
  accessChatMobile,
  fetchChat,
  createGroupChat,
  createGroupChatMobile,
  renameGroup,
  removeFromGroup,
  addFromGroup,
  searchGroupChat,
} = require("../controller/chatController");
const router = express.Router();
const { project } = require("../middleware/authenMiddleware");

router.route("/").post(project, accessChat);
router.route("/mobile").post(project, accessChatMobile);
router.route("/").get(project, fetchChat);
router.route("/searchGroupChat").get(project, searchGroupChat);
router.route("/group").post(project, createGroupChat);
router.route("/groupMobile").post(project, createGroupChatMobile);
router.route("/rename").put(project, renameGroup);
router.route("/groupremove").put(project, removeFromGroup);
router.route("/groupadd").put(project, addFromGroup);

module.exports = router;
