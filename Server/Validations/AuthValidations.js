import { body } from "express-validator";

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
