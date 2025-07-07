import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {
    expiresIn: "10s",
  });
};
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "20s",
  });
};
