import { Router } from "express";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import {
  acceptFriendRequest,
  getAllFriends,
  rejectOrCancelFriendRequest,
  sendFriendRequest,
} from "../Controller/Friendship-Controller.js";
const friendshipRoute = Router();

friendshipRoute.post(
  "/send/:receiverId/request",
  isAuthenticated,
  sendFriendRequest
);

friendshipRoute.patch(
  "/accept/:requesterID/request",
  isAuthenticated,
  acceptFriendRequest
);

friendshipRoute.delete(
  "/delete/:userId/request",
  isAuthenticated,
  rejectOrCancelFriendRequest
);

friendshipRoute.get("/get/friends", isAuthenticated, getAllFriends);

export default friendshipRoute;
