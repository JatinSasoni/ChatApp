import { Router } from "express";
import {
  addMembersToGroup,
  createGroup,
  getAllGroups,
  getGroupMessages,
  sendMessageToGroup,
} from "../Controller/Group-Controller.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
const groupRouter = Router();

groupRouter.get("/my", isAuthenticated, getAllGroups);
groupRouter.get("/messages/group/:groupId", isAuthenticated, getGroupMessages);
groupRouter.post("/create", isAuthenticated, createGroup);
groupRouter.post("/:groupId/add-members", isAuthenticated, addMembersToGroup);
groupRouter.post(
  "/messages/send/group/:groupId",
  isAuthenticated,
  sendMessageToGroup
);

export default groupRouter;
