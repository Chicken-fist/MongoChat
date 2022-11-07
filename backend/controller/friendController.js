const asyncHandler = require("express-async-handler");
const Friend = require("../models/friendModel");
const User = require("../models/userModel");

const sendRequest = asyncHandler(async (req, res) => {
  if (!req.body.user || !req.body.friend) {
    console.log("Chưa có user, friend");
    return res.sendStatus(400);
  }
  var sendRequestFriend = {
    user: req.body.user,
    friend: req.body.friend,
  };
  try {
    var requestFriend = await Friend.create(sendRequestFriend);
    requestFriend = await requestFriend.populate("user", "-password");
    requestFriend = await requestFriend.populate("friend", "-password");
    console.log(requestFriend);
    res.json(requestFriend);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const unfriend = asyncHandler(async (req, res) => {
  if (!req.body.user || !req.body.friend) {
    console.log("Chưa có user, friend");
    return res.sendStatus(400);
  }
  try {
    var requestFriend = await Friend.findOneAndDelete({
      $or: [
        { user: req.body.friend, friend: req.body.user },
        { user: req.body.user, friend: req.body.friend },
      ],
    });
    requestFriend = await requestFriend.populate("user", "-password");
    requestFriend = await requestFriend.populate("friend", "-password");
    console.log(requestFriend);
    // res.json(requestFriend)
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const makeFriend = asyncHandler(async (req, res) => {
  if (!req.body.user || !req.body.friend) {
    console.log("Chưa có user, friend");
    return res.sendStatus(400);
  }
  try {
    var requestFriend = await Friend.findOneAndUpdate(
      { user: req.body.friend, friend: req.body.user },
      { friend: req.body.user, status: 2 } ///////
    );
    requestFriend = await requestFriend.populate("user", "-password");
    requestFriend = await requestFriend.populate("friend", "-password");
    console.log("MAKE FRIEND", requestFriend);
    res.json(requestFriend);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const getListFriend = asyncHandler(async (req, res) => {
  if (!req.body.userId) {
    console.log("Chua co User");
    return res.sendStatus(400);
  } else {
    const getListFriend = await Friend.find({ status: 2 })
      .find({
        $or: [{ user: req.body.userId }, { friend: req.body.userId }],
      })
      .find({
        status: 2,
      })
      .populate("user")
      .populate("friend")
      .select("user friend -_id");
    // const listUse = await User.populate(getListFriend, {
    //   path: "user friend",
    // });
    // res.send(listUse);
    res.send(getListFriend);
  }
});

module.exports = {
  sendRequest,
  unfriend,
  makeFriend,
  getListFriend,
};
