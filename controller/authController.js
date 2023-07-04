require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const passport = require("passport");

const secretKey = process.env.SECRET_TOKEN;
require("../middleware/passport.js");

const register = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user: user,
      });
    }
    req.login(user, { session: false }, (err) => {
      const payload = {
        username: user.username,
        email: user.email,
        role: user.role,
        _id: user._id,
      };
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(JSON.stringify(payload), secretKey);
      return res.json({ token });
    });
  })(req, res);
};

module.exports = {
  register,
  login,
};
