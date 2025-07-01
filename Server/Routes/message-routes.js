import { Router } from "express";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import {
  getSelectedUser,
  markMessagesSeen,
  sendMessage,
} from "../Controller/User-Controller.js";

const messageRouter = Router();

//GET SELECTED USER MESSAGES
messageRouter.get("/:id", isAuthenticated, getSelectedUser);
messageRouter.put("/mark/:messageId", isAuthenticated, markMessagesSeen);
messageRouter.post("/send/:id", isAuthenticated, sendMessage);

export default messageRouter;
