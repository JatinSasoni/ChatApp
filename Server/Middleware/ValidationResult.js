import { validationResult } from "express-validator";

export const validateResults = (req, res, next) => {
  const results = validationResult(req);

  if (!results.isEmpty()) {
    const error = new Error("Something doesn't seem right");
    error.statusCode = 422;
    error.errors = results.array();
    return next(error);
  }
  next();
};
