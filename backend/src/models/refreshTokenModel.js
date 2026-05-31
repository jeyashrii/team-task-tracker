const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timeStamps: true,
  },
);

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
