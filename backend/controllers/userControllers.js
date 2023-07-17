//This file contains functions which provides  actual logic when particular API call is made
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const generateToken = require("../config/generateToken");

//* function to register a user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  //Checking if there is empty field
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }
  //Checking if user with provided email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    res.send("User already exists");
    throw new Error("User Already Exists");
  }
  //Creating new user
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  //Generating response Json
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      // token: generateToken.generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create new user");
  }
});
//* function to login a user
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error(
      "Couldn't find an account with this email. Please Register!"
    );
  }
  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken.generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

//* function to get all users related to search keyword user entered
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          //? or is used to search by name or email field
          {
            name: {
              $regex: req.query.search,
              $options: "i",
            },
          },
          {
            email: {
              $regex: req.query.search,
              $options: "i",
            },
          },
        ],
      }
    : {};
  // ! Finding users with the entered search content
  // ? find({ _id: { $ne: req.user._id } : this will exclude the logged in user from search results
  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");
  res.send(users);
});
module.exports = { registerUser, authUser, allUsers };
