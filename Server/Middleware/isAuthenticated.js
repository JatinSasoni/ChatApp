import jwt from "jsonwebtoken";
import { UserModel } from "../Model/User-model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    const user = await UserModel.findById(decoded.userID).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token expired",
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message || "Authentication failed",
    });
  }
};
