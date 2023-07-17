const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      // default:
      // "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

//This is middleware - before saving new user into db, this is called/executed
userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  //Hashing of password is done here
  this.password = await bcrypt.hash(this.password, 10);
  this.email = await bcrypt.hash(this.email, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model("User", userSchema);

module.exports = User;
