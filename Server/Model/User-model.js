import mongoose, { model } from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: String,
    },
    Profile: {
      bio: { type: String },
      profilePhoto: {
        type: String,
        default: "/avatar_icon.png",
      },
    },
  },
  { timestamps: true }
);

export const UserModel = model("user", userSchema);
