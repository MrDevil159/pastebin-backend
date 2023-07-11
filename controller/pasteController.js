require("dotenv").config();
const CryptoJS = require("crypto-js");

const pasteModel = require("../models/PasteModel.js");
// newPaste, readPaste
const encryptMessage = (message, password) => {
  const encrypted = CryptoJS.AES.encrypt(message, password).toString();
  return encrypted;
};

const decryptMessage = (encryptedMessage, password) => {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, password);
  const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
};

const newPaste = async (req, res) => {
  try {
    let pasteBody = {
      title: req.body.title,
      description: req.body.description,
      burnAfterRead: req.body.burnAfterRead,
      userId: req.user._id,
      username: req.user.username,
    };
    const msg = req.body.description;
    const pass = req.body.password;

    if (req.body.passwordProtection == true) {
      const encryptedMessage = encryptMessage(msg, pass);

      pasteBody = {
        ...pasteBody,
        description: encryptedMessage,
        passworded: true,
        password: req.body.password,
      };
    }
    console.log(pasteBody);
    const insertPaste = new pasteModel(pasteBody);
    const response = await insertPaste.save();
    console.log("resp", response);
    res.status(200).json(response._id);
  } catch (error) {
    console.log(error);
  }
};

const readPaste = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const data = await pasteModel.findById(id);
    data.count = data.count + 1;
    await data.save();
    data.password = undefined;

    res.status(200).json(data);
  } catch (error) {
    res.status(404).message("Error");
  }
};

const pastes = async (req, res) => {
  try {
    const userId = req.user._id;
    const data = await pasteModel.find({ userId }).select("_id title");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};

module.exports = {
  newPaste,
  readPaste,
  pastes,
};
