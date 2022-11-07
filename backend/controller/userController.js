const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const mailer = require("../utils/mailer");
const bcryptjs = require("bcryptjs");
const register = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Pls enter all Fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    bcryptjs.hash(user.email, 10).then((hashMail) => {
      console.log(
        `${process.env.APP_URL}/verify?email=${user.email}&token=${hashMail}`
      );
      mailer.sendMail(
        user.email,
        "Verify Email",
        `<a href="${process.env.APP_URL}api/user/verify?email=${user.email}&token=${hashMail}">Verify</a>`
      );
    });
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Cant create User ");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    if (user.email_verified_at == null) {
      console.log("XIN HAY VAO XAC THUC BANG EMAIL");
      res.status(402);
      throw new Error("Verify by email to complete the registration process");
    } else {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
      console.log("Dung + XAC THUC GOI");
    }
  } else {
    console.log("Sai Tai khoan");
    res.status(401);
    throw new Error("Wrong email or password");
  }
});
// /api/user?search=xxx
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const verify = asyncHandler(async (req, res) => {
  console.log("DO DO DO");
  bcryptjs.compare(req.query.email, req.query.token, (err, result) => {
    if (result == true) {
      User.findOneAndUpdate(
        { email: req.query.email },
        { email: req.query.email, email_verified_at: new Date() },
        (err, data) => {
          err ? console.log(err) : console.log("XONG XONG XONG");
        }
      );
      // res.redirect("");
    } else {
      console.log("Ko tim ra");
    }
  });
});

module.exports = { register, authUser, allUsers, verify };
