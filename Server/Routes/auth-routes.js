import { Router } from "express";
import {
  loginController,
  signupController,
} from "../Controller/Auth-Controller.js";
import {
  loginValidation,
  signupValidation,
} from "../Validations/AuthValidations.js";
import { validateResults } from "../Middleware/ValidationResult.js";

//ROUTER
const authRouter = Router();

//ROUTES
authRouter.post("/signup", signupValidation, validateResults, signupController);
authRouter.post("/login", loginValidation, validateResults, loginController);

export default authRouter;
