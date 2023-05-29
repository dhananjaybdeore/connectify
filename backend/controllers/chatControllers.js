const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//? Controller for creating 1:1 chats
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId params not sent with request ");
    return res.sendStatus(400);
  }
  var isChat = Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  //? Populate is used because we have objectIDs in Chat model. So by using populate method, we can access the entire user or lastMessage from their individual collection
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: " name, email, pic ",
  });
  //Checking if they already have chats
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } //If they haven't talked before - create a new chat
  else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//? Controller for accessing all the chats of the logged in user
const fetchChat = asyncHandler(async (req, res) => {
  try {
    //Validating the logged in user

    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: " name, email, pic ",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { accessChat, fetchChat };
