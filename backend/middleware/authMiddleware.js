const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
//! Checking whether the token of user is passed or not
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //? Getting data without the first string which would be "Bearer"
      token = req.headers.authorization.split(" ")[1];

      //? Decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ? Find user who is logged in from DB and storing it in req.user
      // ? Coz we are excluding it find method in allUsers controller method in authMiddleware.js
      req.user = await User.findById(decoded.id);

      //*Move on to the next operation
      next();
    } catch {
      (error) => {
        res.status(401);
        throw new Error("Not Authorized, Token Failed");
      };
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not Authorized, no token");
  }
});

module.exports = { protect };
