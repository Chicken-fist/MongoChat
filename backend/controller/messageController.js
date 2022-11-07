const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const sendMessage = asyncHandler(async (req, res, next) => {
  const { content, chatId, pic } = req.body;
  if (!content || !chatId) {
    console.log("Ko co content , chatId");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    pic: pic,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const getAllMessages = asyncHandler(async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const recallMessage = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.body;
    await Message.findByIdAndUpdate({ _id: id }, { recallMessage: 1 });
    var messRecall = await Message.findById({ _id: id })
      .populate("sender", "name pic")
      .populate("chat");
    messRecall = await User.populate(messRecall, {
      path: "chat.users",
      select: "name pic email",
    });
    console.log("CONTROLLER: ", messRecall);
    res.json(messRecall);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const getAllImageMessages = asyncHandler(async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .find({ content: "image" })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
module.exports = {
  sendMessage,
  getAllMessages,
  recallMessage,
  getAllImageMessages,
};
