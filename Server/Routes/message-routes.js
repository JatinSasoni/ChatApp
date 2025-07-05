import { Router } from "express";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import {
  getSelectedUser,
  markMessagesSeen,
  sendMessage,
} from "../Controller/User-controller.js";

const messageRouter = Router();

//GET SELECTED USER MESSAGES
messageRouter.get("/:id", isAuthenticated, getSelectedUser);
//MARK MESSAGE AS SEEN
messageRouter.put("/mark/:messageId", isAuthenticated, markMessagesSeen);
//SEND MESSAGE
messageRouter.post("/send/:id", isAuthenticated, sendMessage);

export default messageRouter;
