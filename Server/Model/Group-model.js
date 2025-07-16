import { model, Schema } from "mongoose";
const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    profile: {
      bio: { type: String },
      profilePhoto: {
        type: String,
        default: "/avatar_icon.png",
      },
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "message",
      },
    ],
  },
  { timestamps: true }
);

export const GroupModel = model("group", groupSchema);
