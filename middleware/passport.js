require("dotenv").config();

const passportJWT = require("passport-jwt");
const passport = require("passport");
const bcrypt = require("bcrypt");

const UserModel = require("../models/UserModel");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const secretKey = process.env.SECRET_TOKEN;

const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, cb) {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          return cb(null, false, { message: "Incorrect email or password." });
        }
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
          return cb(null, false, { message: "Incorrect email or password." });
        }

        return cb(null, user, { message: "Logged In Successfully" });
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretKey,
    },
    async function (jwtPayload, cb) {
      try {
        const user = await UserModel.findOneById(jwtPayload.id);
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);
