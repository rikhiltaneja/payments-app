const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  balance: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Bank = mongoose.model("Bank", bankSchema);
module.exports = Bank;