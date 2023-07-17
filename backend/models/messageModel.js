const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  {
    timestamps: true,
  }
);

//! Edited
messageModel.pre("save", async function (next) {
  if (!this.isModefied) {
    next();
  }
  this.content = await bcrypt.hash(this.content, 10);
});
//!Edited

// messageModel.pre("save", async function (next) {
//   if (!this.isModified) {
//     next();
//   }
//   //Hashing of password is done here
//   this.content = await bcrypt.hash(this.content, 10);
// });

const Message = mongoose.model("Message", messageModel);
module.exports = Message;
