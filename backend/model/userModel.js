const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const userModel = mongoose.model("employee123", userSchema);

module.exports = userModel;
