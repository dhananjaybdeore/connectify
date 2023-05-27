const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const { connDB } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
dotenv.config();
connDB();
const app = express();
app.use(express.json()); // to accept json data from frontend
app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

app.use("/api/user", userRoutes);
const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
