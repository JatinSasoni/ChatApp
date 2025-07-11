import { model, Schema } from "mongoose";
const friendshipSchema = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Friendship = model("friendship", friendshipSchema);
