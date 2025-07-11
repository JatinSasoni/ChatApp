import { Friendship } from "../Model/Friendship-model.js";

//* SEND FRIEND REQUEST
export const sendFriendRequest = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { receiverId } = req.params;

    //check if already exists
    const alreadyExists = await Friendship.findOne({
      $or: [
        { requester: userID, receiver: receiverId },
        { requester: receiverId, receiver: userID },
      ],
    });
    if (alreadyExists) {
      const error = new Error("Already requested or friends");
      error.statusCode = 400;
      throw error;
    }
    await Friendship.create({
      requester: userID,
      receiver: receiverId,
    });
    return res.status(200).json({
      success: true,
      message: "Request sent",
    });
  } catch (error) {
    next(error);
  }
};

//* ACCEPT FRIEND REQUEST
export const acceptFriendRequest = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const { requesterID } = req.params;

    const request = await Friendship.findOneAndUpdate(
      {
        requester: requesterID,
        receiver: userID,
      },
      {
        status: "accepted",
      },
      {
        new: true,
      }
    );
    if (!request) {
      const error = new Error("No request found");
      error.statusCode = 400;
      throw error;
    }
    return res.status(200).json({
      success: true,
      message: "Friend request accepted",
    });
  } catch (error) {
    next(error);
  }
};

//* REJECT OR CANCEL FRIEND REQUEST
export const rejectOrCancelFriendRequest = async (req, res, next) => {
  try {
    const selfID = req.user._id;
    const { userId } = req.params;
    const deleted = await Friendship.findOneAndDelete({
      $or: [
        {
          requester: userId,
          receiver: selfID,
        },
        {
          requester: selfID,
          receiver: userId,
        },
      ],
    });
    if (!deleted) {
      const error = new Error("No request found");
      error.statusCode = 400;
      throw error;
    }
    return res.status(200).json({
      success: true,
      message: "Friend request accepted",
    });
  } catch (error) {
    next(error);
  }
};

//* GET FRIENDS
export const getAllFriends = async (req, res, next) => {
  try {
    const selfID = req.user._id;
    const allFriends = await Friendship.find({
      $or: [
        {
          requester: selfID,
          status: "accepted",
        },
        {
          receiver: selfID,
          status: "accepted",
        },
      ],
    }).populate("requester receiver", "-password"); //POPULATE AND INCLUDE ONLY USERNAME

    const friendList = allFriends.map((friend) => {
      return friend.requester._id.toString() === selfID.toString()
        ? friend.receiver
        : friend.requester;
    });

    return res.status(200).json({
      success: true,
      friendList,
    });
  } catch (error) {
    next(error);
  }
};
