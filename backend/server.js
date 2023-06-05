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
const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
