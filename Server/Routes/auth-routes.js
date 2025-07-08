import { Router } from "express";
import {
  changePasswordController,
  checkAuth,
  getOTP,
  loginController,
  logoutController,
  refreshTokenController,
  signupController,
  verifyOTP,
} from "../Controller/Auth-Controller.js";
import {
  loginValidation,
  newPasswordValidation,
  otpRouteValidation,
  signupValidation,
  verifyOtpRouteValidation,
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
authRouter.post("/get/otp", otpRouteValidation, validateResults, getOTP);
authRouter.post(
  "/verify/:userID",
  verifyOtpRouteValidation,
  validateResults,
  verifyOTP
);
authRouter.post(
  "/set/new-password",
  newPasswordValidation,
  validateResults,
  changePasswordController
);

export default authRouter;
