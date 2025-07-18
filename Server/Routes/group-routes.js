import { Router } from "express";
import {
  addMembersToGroup,
  createGroup,
  deleteGroup,
  getAllGroupsAndUnseenMsgs,
  getGroupMessages,
  markMessagesSeenGroup,
  removeGroupMember,
  sendMessageToGroup,
  updateGroupInfo,
} from "../Controller/Group-Controller.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
const groupRouter = Router();

groupRouter.get("/my", isAuthenticated, getAllGroupsAndUnseenMsgs);
groupRouter.get("/messages/group/:groupId", isAuthenticated, getGroupMessages);
groupRouter.put("/mark/:messageId", isAuthenticated, markMessagesSeenGroup);
groupRouter.put("/update/:groupId", isAuthenticated, updateGroupInfo);
groupRouter.put(
  "/remove-member/:groupId/:memberId",
  isAuthenticated,
  removeGroupMember
);
groupRouter.post("/create", isAuthenticated, createGroup);
groupRouter.post("/:groupId/add-members", isAuthenticated, addMembersToGroup);
groupRouter.post(
  "/messages/send/group/:groupId",
  isAuthenticated,
  sendMessageToGroup
);
groupRouter.delete("/:groupId/delete", isAuthenticated, deleteGroup);

export default groupRouter;
