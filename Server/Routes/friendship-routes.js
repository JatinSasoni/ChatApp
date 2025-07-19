import { Router } from "express";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import {
  acceptFriendRequest,
  getAllFriends,
  getFriendsAndRequests,
  rejectOrCancelFriendRequest,
  sendFriendRequest,
} from "../Controller/Friendship-Controller.js";
import { validateResults } from "../Middleware/ValidationResult.js";
import { validateMongooseID } from "../Validations/AuthValidations.js";
import { param } from "express-validator";
const friendshipRoute = Router();

friendshipRoute.post(
  "/send/:receiverId/request",
  isAuthenticated,
  param("receiverId").custom(validateMongooseID),
  validateResults,
  sendFriendRequest
);

friendshipRoute.patch(
  "/accept/:requesterID/request",
  isAuthenticated,
  param("requesterID").custom(validateMongooseID),
  validateResults,
  acceptFriendRequest
);

friendshipRoute.delete(
  "/delete/:userId/request",
  isAuthenticated,
  param("userId").custom(validateMongooseID),
  validateResults,
  rejectOrCancelFriendRequest
);

friendshipRoute.get("/get/friends", isAuthenticated, getAllFriends);
friendshipRoute.get("/get/requests", isAuthenticated, getFriendsAndRequests);

export default friendshipRoute;
