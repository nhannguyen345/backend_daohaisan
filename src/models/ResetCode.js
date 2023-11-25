const mongoose = require("mongoose");

const ResetCode = mongoose.Schema({
  user_id: {
    type: String,
    require: true,
  },
  code: {
    type: String,
    require: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  expirationDate: {
    type: Date,
    require: true,
  },
});

module.exports = mongoose.model("ResetCode", ResetCode);
