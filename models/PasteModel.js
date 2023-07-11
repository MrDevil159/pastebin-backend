const mongoose = require("mongoose");

const pasteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    passworded: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    burnAfterRead: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Types.ObjectId,
    },
    username: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    delFlag: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("paste", pasteSchema);
