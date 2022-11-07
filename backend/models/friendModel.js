const mongoose = require("mongoose");
/* status: 0 - reject 
           1 - send request - pending
           2 - accept 
* */
const friendModel = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    friend: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Friend = mongoose.model("Friend", friendModel);
module.exports = Friend;
