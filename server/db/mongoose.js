const mongoose = require("mongoose");
const keys = require("../config/config");

mongoose.connect(
  keys.mongoURI,
  { useNewUrlParser: true }
);

module.exports = {
  mongoose
};
