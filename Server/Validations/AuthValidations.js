import { body, param } from "express-validator";
import mongoose from "mongoose";

export const signupValidation = [
  body("username")
    .notEmpty()
    .withMessage("username is required")
    .isLength({ min: 3 })
    .withMessage("minimum length:3")
    .trim()
    .escape(),
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .toLowerCase()
    .escape(),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    })
    .withMessage("Password is not strong enough")
    .escape(),
];

export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .trim()
    .toLowerCase()
    .normalizeEmail()
    .escape(),
  body("password")
    .isStrongPassword({
      minNumbers: 1,
      minLength: 8,
      minLowercase: 1,
      minSymbols: 1,
      minUppercase: 1,
    })
    .withMessage("Password is not strong enough"),
];

export const otpRouteValidation = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .trim()
    .toLowerCase()
    .normalizeEmail()
    .escape(),
];

const validateMongooseID = (ID) => {
  const isValid = mongoose.isValidObjectId(ID);
  if (!isValid) throw new Error("Invalid ID");
  return true;
};
export const verifyOtpRouteValidation = [
  param("userID").custom((value) => validateMongooseID(value)),
  body("otp").notEmpty().withMessage("OTP Is required"),
];

export const newPasswordValidation = [
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    })
    .withMessage("Password is not strong enough")
    .escape(),
];

// export const validateReceiverID = [
//   param("receiverId").custom((value) => validateMongooseID(value)),
// ];
