import { Router } from "express";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import {
  getSelectedUser,
  markMessagesSeen,
  sendMessage,
} from "../Controller/User-Message-controller.js";
import { body, param } from "express-validator";
import { validateMongooseID } from "../Validations/AuthValidations.js";
import { validateResults } from "../Middleware/ValidationResult.js";

const messageRouter = Router();

//GET SELECTED USER MESSAGES
messageRouter.get(
  "/:selectedUserId",
  isAuthenticated,
  param("selectedUserId").custom(validateMongooseID),
  validateResults,
  getSelectedUser
);
//MARK MESSAGE AS SEEN
messageRouter.put(
  "/mark/:messageId",
  isAuthenticated,
  param("messageId").custom(validateMongooseID),
  validateResults,
  markMessagesSeen
);
//SEND MESSAGE
messageRouter.post(
  "/send/:id",
  isAuthenticated,
  param("id").custom(validateMongooseID),
  validateResults,
  sendMessage
);

export default messageRouter;
