import { Router } from "express";

import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import {
  getAllUsersAndUnseenMsgs,
  isLive,
  updateProfile,
} from "../Controller/User-Message-controller.js";
import { validateProfileUpdate } from "../Validations/AuthValidations.js";
import { validateResults } from "../Middleware/ValidationResult.js";

const userRouter = Router();

//GET ALL USERS EXCEPT YOURSELF
userRouter.get("/get-users", isAuthenticated, getAllUsersAndUnseenMsgs);
userRouter.patch(
  "/update-user",
  isAuthenticated,
  validateProfileUpdate,
  validateResults,
  updateProfile
);

//ROUTE FOR RENDER
userRouter.get("/check/isLive", isLive);

export default userRouter;
