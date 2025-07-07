import jwt from "jsonwebtoken";
import { UserModel } from "../Model/User-model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);

    const user = await UserModel.findById(decoded.userID).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Unauthorized",
    });
  }
};
