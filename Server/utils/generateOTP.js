export const generateOTP = (length) => {
  if (length <= 0) return "";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};
