const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

// 24 -- 25

// Import Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

// General Middlewares
dotenv.config();
app.use(express.json());

// Route Middlewares
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

// Connect DB
mongoose.connect(
  process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => console.log("Connect DB Success !!")
);

// Connect Server Port
app.listen(3000, () => console.log("Server running !!"));