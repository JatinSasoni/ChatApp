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
import { param } from "express-validator";
import {
  validateCreateGroup,
  validateGroupMembersUpdate,
  validateMongooseID,
} from "../Validations/AuthValidations.js";
import { validateResults } from "../Middleware/ValidationResult.js";
const groupRouter = Router();

groupRouter.get("/my", isAuthenticated, getAllGroupsAndUnseenMsgs);
groupRouter.get(
  "/messages/group/:groupId",
  isAuthenticated,
  param("groupId").custom(validateMongooseID),
  validateResults,
  getGroupMessages
);
groupRouter.put(
  "/mark/:messageId",
  isAuthenticated,
  param("messageId").custom(validateMongooseID),
  validateResults,
  markMessagesSeenGroup
);
groupRouter.put(
  "/update/:groupId",
  isAuthenticated,
  param("groupId").custom(validateMongooseID),
  validateResults,
  updateGroupInfo
);
groupRouter.put(
  "/remove-member/:groupId/:memberId",
  isAuthenticated,
  param("groupId").custom(validateMongooseID),
  param("memberId").custom(validateMongooseID),
  validateResults,
  removeGroupMember
);
groupRouter.post(
  "/create",
  isAuthenticated,
  validateCreateGroup,
  validateResults,
  createGroup
);
groupRouter.post(
  "/:groupId/add-members",
  isAuthenticated,
  validateGroupMembersUpdate,
  validateResults,
  addMembersToGroup
);
groupRouter.post(
  "/messages/send/group/:groupId",
  isAuthenticated,
  param("groupId").custom(validateMongooseID),
  validateResults,
  sendMessageToGroup
);
groupRouter.delete(
  "/:groupId/delete",
  isAuthenticated,
  param("groupId").custom(validateMongooseID),
  validateResults,
  deleteGroup
);

export default groupRouter;
