import { Router } from "express";
import { getAllUsers } from "../Controller/User-Controller.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";

const userRouter = Router();

//GET ALL USERS EXCEPT YOURSELF
userRouter.get("/", isAuthenticated, getAllUsers);

export default userRouter;
