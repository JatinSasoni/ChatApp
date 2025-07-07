import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {
    expiresIn: "15m",
  });
};
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
};
