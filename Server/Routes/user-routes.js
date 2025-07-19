import { Router } from "express";

import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import {
  getAllUsersAndUnseenMsgs,
  isLive,
  updateProfile,
} from "../Controller/User-Message-controller.js";

const userRouter = Router();

//GET ALL USERS EXCEPT YOURSELF
userRouter.get("/get-users", isAuthenticated, getAllUsersAndUnseenMsgs);
userRouter.patch("/update-user", isAuthenticated, updateProfile);

//ROUTE FOR RENDER
userRouter.get("/check/isLive", isLive);

export default userRouter;
