const express = require("express");
const { project } = require("../middleware/authenMiddleware");
const {
  sendRequest,
  unfriend,
  makeFriend,
  getListFriend,
} = require("../controller/friendController");

const router = express.Router();
router.route("/sendRequest").post(project, sendRequest);
router.route("/makeFriend").post(project, makeFriend);
router.route("/unfriend").post(project, unfriend);
router.route("/getListFriend").post(project, getListFriend);

module.exports = router;
