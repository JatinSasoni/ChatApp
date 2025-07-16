import mongoose, { model, Schema } from "mongoose";

const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "group",
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const MessageModel = model("message", messageSchema);
