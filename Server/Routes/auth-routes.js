import { Router } from "express";
import {
  checkAuth,
  loginController,
  logoutController,
  refreshTokenController,
  signupController,
} from "../Controller/Auth-Controller.js";
import {
  loginValidation,
  signupValidation,
} from "../Validations/AuthValidations.js";
import { validateResults } from "../Middleware/ValidationResult.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";

//ROUTER
const authRouter = Router();

//ROUTES
authRouter.post("/signup", signupValidation, validateResults, signupController);
authRouter.post("/login", loginValidation, validateResults, loginController);
authRouter.get("/refresh-token", refreshTokenController);
authRouter.get("/logout", isAuthenticated, logoutController);
authRouter.get("/check", isAuthenticated, checkAuth);

export default authRouter;
