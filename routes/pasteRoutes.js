const express = require("express");
const passport = require("passport");

const router = express.Router();
const {
  newPaste,
  readPaste,
  pastes,
} = require("../controller/pasteController.js");
router.post(
  "/newPaste",
  passport.authenticate("jwt", { session: false }),
  newPaste
);
router.get("/Pastes", passport.authenticate("jwt", { session: false }), pastes);
router.get("/readPaste/:id", readPaste);

module.exports = router;
