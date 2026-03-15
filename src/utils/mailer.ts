import nodemailer from "nodemailer";

const { email_host, email_port, email_user, email_pass } = process.env;

if (!email_host || !email_port || !email_user || !email_pass) {
  throw new Error("Email Environment Variables not set");
}

export const transporter = nodemailer.createTransport({
  host: email_host,
  port: email_port,
  secure: true,
  auth: {
    user: email_user,
    pass: email_pass,
  },
} as nodemailer.TransportOptions);

export const SENDER_EMAIL = email_user;
