import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    userName: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      required: true,
    },
    password: String,
    email: { type: String, unique: true, required: true },
    role: {
      type: String,
      enum: ["User", "Admin"],
    },
    deletedAccount: { type: Boolean, default: false },
    token: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = new mongoose.model("User", UserSchema);

export { User };
