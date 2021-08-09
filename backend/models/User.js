const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: String,
    firebaseId: String,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("User", userSchema);
