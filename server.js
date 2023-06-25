require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user.route");
const reviewRoutes = require("./routes/review.route");

/* EXPRESS APP */
const app = express();

/* MIDDLEWARES */
app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());

/* TEST API */
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Elysian Feeds server!" });
});

/* BYPASSED APIs */
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

/* VARIABLES */
const port = process.env.PORT || 8080;
const uri = process.env.MONGO_URI;

/* DB CONNECTION */
mongoose
  .connect(uri, { useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
