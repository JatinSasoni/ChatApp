import { MessageModel } from "../Model/Message-mode.js";
import { UserModel } from "../Model/User-model.js";

export const getAllUsers = async (req, res, next) => {
  const user = req.user;

  //GET ALL USERS EXCEPT YOURSELF
  const filteredUser = await UserModel.find({ _id: { $ne: user._id } });
  const unseenMessages = {};
  const promises = filteredUser.map(async (otherUser) => {
    const message = await MessageModel.find({
      senderId: otherUser._id,
      receiverId: user._id,
      seen: false,
    });

    if (message.length > 0) {
      unseenMessages[otherUser._id] = message.length;
    }
  });
  await Promise.all(promises);
  res.status(200).json({
    success: true,
    users: filteredUser,
    unseenMessages,
  });

  res.end();
};
