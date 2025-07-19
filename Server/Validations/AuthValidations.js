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

export const validateProfileUpdate = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3 to 30 characters long"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Bio must not exceed 150 characters"),
];

export const validateMongooseID = (value) => {
  if (!mongoose.isValidObjectId(value)) {
    throw new Error("Invalid MongoDB ObjectId");
  }
  return true; // validation passed
};

export const validateCreateGroup = [
  body("groupName")
    .trim()
    .notEmpty()
    .withMessage("Group name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Group name must be 3 to 50 characters"),

  body("members")
    .isArray({ min: 1 })
    .withMessage("Members must be a non-empty array")
    .custom((members) => {
      for (const memberId of members) {
        if (!mongoose.isValidObjectId(memberId)) {
          throw new Error(`Invalid member ID: ${memberId}`);
        }
      }
      return true;
    }),
];

export const validateGroupMembersUpdate = [
  param("groupId").custom((value) => {
    if (!mongoose.isValidObjectId(value)) {
      throw new Error("Invalid groupId");
    }
    return true;
  }),

  body("members")
    .isArray({ min: 1 })
    .withMessage("Members must be a non-empty array")
    .custom((members) => {
      for (const memberId of members) {
        if (!mongoose.isValidObjectId(memberId)) {
          throw new Error(`Invalid member ID: ${memberId}`);
        }
      }
      return true;
    }),
];

export const verifyOtpRouteValidation = [
  param("userID").custom(validateMongooseID),
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
