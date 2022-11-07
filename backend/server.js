const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const app = express();
const userRouter = require("./routers/userRouter");
const chatRouter = require("./routers/chatRouter");
const messageRouter = require("./routers/messageRouter");
const friendRouter = require("./routers/friendRouter");
const PORT = process.env.PORT;
const { notFound, errorHandler } = require("./middleware/errorHandler");
connectDB();
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/friend", friendRouter);
// app.get("/call", (req, res) => {
//   res.render("home");
// })
// token:
// thoai phuong
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNDZjNzgwZDkwMjVkY2RiMTJhNDAxNSIsImlhdCI6MTY2NTU4Mjk3NywiZXhwIjoxNjY4MTc0OTc3fQ.ZhYjZ5wC0LyUHwbbezNN0lkYuXu6s5I4Y-oRvrJZeOM
app.use(notFound);
app.use(errorHandler);
const server = app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
/// Socket /////
const io = require("socket.io")(server, {
  // waiting time server ko connect
  pingTimeout: 60000,
  cors: {
    // origin: "http://localhost:3000"
    origin:"*"
  },
});

io.on("connection", (socket) => {
  console.log(socket.id, " connected !!!");
  socket.on("setup", (userData) => {
    // user sign in dô chat
    // userdata: user sign in
    console.log(userData._id, " do phong cua socketId");
    socket.join(userData._id);
    // create a new room vì căn phòng này chưa hề tồn tại
    socket.emit("connected"); // bắn lên client
  });
  socket.on("join chat", (room) => {
    // chat room
    socket.join(room);
    console.log("User join room ", room);
  });
  socket.on("typing", (room) => {
    console.log("TYPING: ", room);
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    console.log("STOP TYPING: ", room);
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.user is not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved); // go inside user 's room
      socket.emit("message recieved", newMessageRecieved); // go inside user 's room
    });
    // socket.off("setup", () => {
    //   console.log("USER DISCONNECTED");
    //   socket.leave(userData._id);
    // });
  });
  socket.on("recall message", (mess) => {
    console.log("SERVER message recall: ", mess);
    // socket.in(user._id).emit("recall message", mess);
    // gửi đến room nào ?????
    var chat = mess.chat;
    if (!chat.users) return console.log("chat recall is not defined");
    chat.users.forEach((user) => {
      if (user._id == mess.sender._id) return;
      socket.emit("recalled mess", mess);
      socket.in(user._id).emit("recalled mess", mess);
    });
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });
});
