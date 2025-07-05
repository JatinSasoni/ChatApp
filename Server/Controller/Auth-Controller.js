import { UserModel } from "../Model/User-model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateLoginToken.js";

//LOGIN CONTROLLER
export const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      throw error;
    }

    const isPassMatched = await bcrypt.compare(password, user.password);

    if (!isPassMatched) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      return next(error);
    }

    //GENERATE TOKEN
    const payload = {
      userID: user._id,
    };

    const token = generateToken(payload);

    return res.status(200).json({
      success: true,
      message: `Welcome ${user.username || "user"}`,
      loggedInUser: { ...user.toObject(), password: "" }, //toObject coz it has some hidden mongoDB fields
      token,
    });
  } catch (error) {
    next(error);
  }
};

//SIGNUP CONTROLLER
export const signupController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const doesEmailExists = await UserModel.findOne({ email });

    if (doesEmailExists) {
      const error = new Error("Email already exists");
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await UserModel.create({
      email,
      password: hashedPassword,
      username,
    });
    return res.status(201).json({
      success: true,
      message: "Signup successful",
    });
  } catch (error) {
    next(error);
  }
};

//CHECK AUTH
export const checkAuth = async (req, res, next) => {
  const user = req.user; //isAuthenticated
  return res.status(200).json({ success: true, user });
};
