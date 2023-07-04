const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const authRoutes = require("./authRoutes");
const pasteRoutes = require("./pasteRoutes.js");

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
require("../middleware/passport.js");

app.use("/auth", authRoutes);
app.use(
  "/paste",
  passport.authenticate("jwt", { session: false }),
  pasteRoutes
);

mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((error) => console.error("Failed to connect to MongoDB:", error));
