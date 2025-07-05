import { Router } from "express";

import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import { getAllUsers, updateProfile } from "../Controller/User-controller.js";

const userRouter = Router();

//GET ALL USERS EXCEPT YOURSELF
userRouter.get("/get-users", isAuthenticated, getAllUsers);
userRouter.patch("/update-user", isAuthenticated, updateProfile);

export default userRouter;
