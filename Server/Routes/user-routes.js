import { Router } from "express";

import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import {
  getAllUsersAndUnseenMsgs,
  updateProfile,
} from "../Controller/User-controller.js";

const userRouter = Router();

//GET ALL USERS EXCEPT YOURSELF
userRouter.get("/get-users", isAuthenticated, getAllUsersAndUnseenMsgs);
userRouter.patch("/update-user", isAuthenticated, updateProfile);

export default userRouter;
