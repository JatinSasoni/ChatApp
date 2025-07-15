import { MessageModel } from "../Model/Message-mode.js";
import { UserModel } from "../Model/User-model.js";
import cloudinary, { uploadToCloudinary } from "../utils/cloudinary.js";
import { io, userSocketMap } from "../server.js";

//GET ALL USERS AND UNSEEN MESSAGES
export const getAllUsers = async (req, res, next) => {
  const user = req.user;

  //GET ALL USERS EXCEPT YOURSELF
  const filteredUser = await UserModel.find({ _id: { $ne: user._id } });
  const unseenMessages = {};
  const promises = filteredUser.map(async (otherUser) => {
    const messages = await MessageModel.find({
      senderId: otherUser._id,
      receiverId: user._id,
      seen: false,
    });

    if (messages.length > 0) {
      unseenMessages[otherUser._id] = messages.length;
    }
  });
  await Promise.all(promises);
  res.status(200).json({
    success: true,
    users: filteredUser,
    unseenMessages,
  });
};

//* GET ALL MESSAGES FOR SELECTED USER
export const getSelectedUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const selectedUserId = req.params.id;
    //FETCH ALL SELECTED USERS MESSAGES
    const selectedUserMessages = await MessageModel.find({
      $or: [
        { senderId: userId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: userId },
      ],
    });
    //MARK MESSAGES SEEN
    await MessageModel.updateMany(
      {
        senderId: selectedUserId,
        receiverId: userId,
      },
      { seen: true }
    );
    return res.status(200).json({ success: true, selectedUserMessages });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//HANDLING USER PROFILE UPDATE
export const updateProfile = async (req, res) => {
  try {
    const { username, bio, profilePhoto } = req.body;

    const userID = req.user._id; //FROM MIDDLEWARE AUTHENTICATION
    let user = await UserModel.findById(userID).select("-password"); //FETCHING USER DATA FROM DATABASE
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 400;
      throw error;
    }

    //UPDATING DATA
    if (username) user.username = username;
    if (bio) user.Profile.bio = bio;
    if (profilePhoto) {
      const imageURL = await uploadToCloudinary(
        profilePhoto,
        "/chat-test/profilePhoto"
      );
      user.Profile.profilePhoto = imageURL;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log("ERROR WHILE UPDATING PROFILE");
    console.log(error);

    next(error);
  }
};

//API TO MARK MESSAGES SEEN USING MESSAGE-ID
export const markMessagesSeen = async (req, res, next) => {
  try {
    const messageId = req.params.messageId;
    await MessageModel.findByIdAndUpdate(messageId, { seen: true });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//API TO SEND MESSAGES
export const sendMessage = async (req, res, next) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageURL;
    if (image && image.startsWith("data:image/")) {
      imageURL = await uploadToCloudinary(image, "/chat-test");
    }

    const newMessage = await MessageModel.create({
      senderId,
      receiverId,
      text: text || "",
      image: imageURL,
    });

    //*EMIT NEW MESSAGE TO RECEIVER'S SOCKET
    //STEP-1 GET RECEIVER'S SOCKET ID
    const receiverSocketId = userSocketMap[receiverId];
    //IF SOCKET ID AVAILABLE
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(200).json({ success: true, newMessage });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
