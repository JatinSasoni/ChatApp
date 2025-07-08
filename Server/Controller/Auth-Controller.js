import { UserModel } from "../Model/User-model.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateAuthToken,
  generateRefreshToken,
} from "../utils/generateLoginToken.js";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/nodemailer.js";
import { generateOTP } from "../utils/generateOTP.js";

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

    const AccessToken = generateAccessToken(payload);
    const RefreshToken = generateRefreshToken(payload);

    return res
      .status(200)
      .cookie("refreshToken", RefreshToken, {
        secure: true,
        httpOnly: true,
      })
      .json({
        success: true,
        message: `Welcome ${user.username || "user"}`,
        loggedInUser: { ...user.toObject(), password: "" }, //toObject coz it has some hidden mongoDB fields
        AccessToken,
      });
  } catch (error) {
    next(error);
  }
};

//LOGOUT CONTROLLER
export const logoutController = async (req, res, next) => {
  return res.status(200).clearCookie("refreshToken").json({
    success: true,
    message: "Logged out",
  });
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
    const hashedPassword = await bcrypt.hash(password, salt);
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

//Refresh-token Controller
export const refreshTokenController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      const error = new Error("Refresh token not provided");
      error.statusCode = 401;
      throw error;
    }
    //validate refresh token
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decode) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      const payload = {
        userID: decode.userID,
      };

      const AccessToken = generateAccessToken(payload);

      return res.status(200).json({
        success: true,
        AccessToken,
        message: "Access-token fetched",
      });
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

//GET OTP FOR FORGET PASSWORD
export const getOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email }).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 400;
      throw error;
    }

    const otp = generateOTP(process.env.OTP_LENGTH);
    if (!otp) {
      throw new Error("Something went wrong");
    }
    await transporter.sendMail({
      from: '"QuickChat" <jatinhubhai6284@gmail.com>', // sender address
      to: user.email, // receivers
      subject: "Your One-Time Password (OTP)", // Subject line
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333;">Your One-Time Password</h2>
            <p>Hello ${user.name},</p>
            <p>Your One-Time Password (OTP) for authentication is:</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                ${otp}
            </div>
            
            <p>This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
            <p>If you didn't request this OTP, please ignore this email or contact our support team.</p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            
            <p style="font-size: 12px; color: #777;">
                For security reasons, we'll never ask for your password or OTP via email.
                <br>© ${new Date().getFullYear()} Your Company Name. All rights reserved.
            </p>
        </div>
    `,
      // You can also include a text version for email clients that don't support HTML
      text: `
        Hello ${user.name},\n\n
        Your One-Time Password (OTP) for authentication is:\n\n
        ${otp}\n\n
        This OTP is valid for 10 minutes. Please do not share this code with anyone.\n\n
        If you didn't request this OTP, please ignore this email or contact our support team.\n\n
        For security reasons, we'll never ask for your password or OTP via email.\n
        © ${new Date().getFullYear()} Jatin. All rights reserved.
    `,
    });
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `OTP sent to ${user.email}`,
      userID: user._id,
    });
  } catch (error) {
    next(error);
  }
};

//VERIFY OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const userID = req.params.userID;
    if (!otp) {
      const error = new Error("OTP required");
      error.statusCode = 400;
      throw error;
    }

    const user = await UserModel.findById(userID).select("-password");
    if (!user) {
      const error = new error("User not found");
      error.statusCode = 400;
      throw error;
    }

    if (otp !== user.otp || user.otpExpiresAt < Date.now()) {
      (user.otp = ""), (user.otpExpiresAt = ""), await user.save();
      const error = new Error("Expired or invalid OTP");
      error.statusCode = 400;
      throw error;
    }
    const payload = {
      userID: user._id,
    };
    const token = generateAuthToken(payload);
    (user.otp = ""), (user.otpExpiresAt = ""), await user.save();
    return res
      .status(200)
      .cookie("auth", token, {
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        message: "OTP verified",
        userID: user._id,
      });
  } catch (error) {
    next(error);
  }
};

//CHANGE PASSWORD
export const changePasswordController = async (req, res, next) => {
  try {
    const { password } = req.body;
    const authToken = req.cookies?.auth;
    if (!authToken) {
      const error = new Error("Unauthorized");
      error.statusCode = 400;
      throw error;
    }
    try {
      const decoded = jwt.verify(authToken, process.env.AUTH_SECRET_KEY);
      const user = await UserModel.findById(decoded.userID);
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 400;
        throw error;
      }
      const newHashedPass = await bcrypt.hash(password, 10);
      user.password = newHashedPass;
      await user.save();
    } catch (error) {
      error.statusCode = 400;
      throw error;
    }

    return res.status(200).clearCookie("auth").json({
      success: true,
      message: "Password changed",
    });
  } catch (error) {
    next(error);
  }
};
