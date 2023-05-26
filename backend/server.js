const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");

const app = express();
dotenv.config();
app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  const requiredChat = chats.find((c) => c._id === req.params.id);
  res.send(requiredChat);
});
const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
