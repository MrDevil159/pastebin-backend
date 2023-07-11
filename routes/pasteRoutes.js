const express = require("express");
const passport = require("passport");

const router = express.Router();
const {
  newPaste,
  readPaste,
  pastes,
  deletePaste,
} = require("../controller/pasteController.js");
router.post(
  "/newPaste",
  passport.authenticate("jwt", { session: false }),
  newPaste
);
router.get("/Pastes", passport.authenticate("jwt", { session: false }), pastes);
router.get("/readPaste/:id", readPaste);
router.delete(
  "/readPaste/:id",
  passport.authenticate("jwt", { session: false }),
  deletePaste
);

module.exports = router;
