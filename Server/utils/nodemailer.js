import { createTransport } from "nodemailer";

export const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// SMTP_HOST = "smtp-relay.brevo.com";
// SMTP_PORT = 587;
// SMTP_USER = "865a40002@smtp-brevo.com";
// SMTP_PASS = "vPEd12A0fyQBKabO";
// OTP_LENGTH = 6;
