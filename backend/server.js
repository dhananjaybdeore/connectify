//Author: Dhananjay Bharat Deore
const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const { connDB } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
dotenv.config();
connDB();
const app = express();
app.use(express.json()); // *to accept json data from frontend
app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, console.log(`Server started on port ${PORT}`));

const io = require("socket.io")(server, {
  pingTimout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData.data._id);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room" + room);
  });
  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
});
