const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserRegister = new Schema({
  username: String,
  password: String,
  email: String,
});

module.exports = mongoose.model("Register", UserRegister);