import { Friendship } from "../Model/Friendship-model.js";
import { GroupModel } from "../Model/Group-model.js";
import { MessageModel } from "../Model/Message-mode.js";
import { io } from "../server.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

//*POST REQ TO CREATE GROUP
export const createGroup = async (req, res, next) => {
  try {
    const { groupName, members } = req.body;
    console.log({ groupName, members });

    const userId = req.user._id;

    // Fetch only accepted friendships
    const friends = await Friendship.find({
      $or: [{ receiver: userId }, { requester: userId }],
      status: "accepted",
    });

    // Check if every member is a friend
    const friendIds = friends.map((f) =>
      f.requester.toString() === userId.toString()
        ? f.receiver.toString()
        : f.requester.toString()
    );

    const isAllFriends = members.every((m) => friendIds.includes(m));
    if (!isAllFriends) {
      const error = new Error("Only friends can be added to group");
      error.statusCode = 400;
      throw error;
    }
    const group = await GroupModel.create({
      name: groupName,
      admin: userId,
      members: [...new Set([...members, userId.toString()])],
    });
    return res.status(201).json({
      success: true,
      message: "Group created",
      group,
    });
  } catch (error) {
    next(error);
  }
};

//* GET REQ TO GET GROUPS
export const getAllGroups = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const allGroups = await GroupModel.find({
      members: userId,
    });
    return res.status(200).json({ success: true, allGroups });
  } catch (error) {
    next(error);
  }
};

//* POST REQ TO ADD MEMBERS TO GROUP
export const addMembersToGroup = async (req, res, next) => {
  try {
    const { members } = req.body;
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await GroupModel.findOne({
      admin: userId,
      _id: groupId,
    });

    if (!group) {
      const error = new Error("Only admin have privilege");
      error.statusCode = 400;
      throw error;
    }

    // Fetch only accepted friendships
    const friends = await Friendship.find({
      $or: [{ receiver: userId }, { requester: userId }],
      status: "accepted",
    });

    // Check if every member is a friend
    const friendIds = friends.map((f) =>
      f.requester.toString() === userId.toString()
        ? f.receiver.toString()
        : f.requester.toString()
    );

    const isAllFriends = members.every((m) => friendIds.includes(m));
    if (!isAllFriends) {
      const error = new Error("Only friends can be added to group");
      error.statusCode = 400;
      throw error;
    }
    await group.members.push(...members); //ensure members are duplicated ...new Set(...members,...group.members)
    await group.save();
    return res.status(200).json({ success: true, allGroups });
  } catch (error) {
    next(error);
  }
};

//* POST REQ TO SEND MESSAGE TO GROUP
export const sendMessageToGroup = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { message, image } = req.body;
    const { groupId } = req.params;

    const group = await GroupModel.findById(groupId);
    if (!group) throw new Error("Group not found");

    const isMember = group.members.includes(userId.toString());

    if (!isMember) {
      const error = new Error("You are not a member");
      error.statusCode = 400;
      throw error;
    }
    let imageURL = "";
    if (image && image.startsWith("data:image/")) {
      imageURL = await uploadToCloudinary(image, "/chat-test/group");
    }
    //create a message doc
    const messageDoc = await MessageModel.create({
      senderId: userId,
      groupId,
      text: message,
      image: imageURL,
    });
    //socket------
    //  Socket emit to group
    io.to(groupId).emit("groupMessage", {
      newMessage: messageDoc,
      groupId,
    });

    return res.status(201).json({
      success: true,
      newMessage: messageDoc,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

//* GET /api/messages/group/:groupId
export const getGroupMessages = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { groupId } = req.params;
    const group = await GroupModel.findById(groupId);

    const isMember = group.members.some(
      (member) => member.toString() === userId.toString()
    );
    if (!isMember) {
      const error = new Error("You are not a member");
      error.statusCode = 400;
      throw error;
    }
    const messages = await MessageModel.find({
      groupId: groupId,
    });
    // .populate("senderId", "-password");

    return res.status(200).json({
      success: true,
      messages: messages,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};
