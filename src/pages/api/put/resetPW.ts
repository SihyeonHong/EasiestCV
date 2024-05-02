import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../util/database";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const { email_service, user, pass } = process.env;

const transporter = nodemailer.createTransport({
  service: email_service,
  auth: {
    user: user,
    pass: pass,
  },
});

function generateRandomPW(): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    // console.log(req.body);
    let { userid, email } = req.body;

    // make random password
    const randomStr = generateRandomPW();

    try {
      const result = await query("SELECT * FROM users WHERE userid = $1", [
        userid,
      ]);
      //   console.log("result", result);
      if (result.length > 0 && email === result[0].email) {
        // If there's a match of userid and email,

        // send email
        const mailOptions = {
          from: user,
          to: email,
          subject: "Easiest CV : Your Temporary Password",
          text: "Your Temporary Password: " + randomStr,
        };
        transporter.sendMail(mailOptions, async (error: any, info: any) => {
          if (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to send email." });
          } else {
            console.log("Email Sent : ", info);
            // update DB only when email is sent successfully
            const hash = await bcrypt.hash(randomStr, 10);
            // console.log("hash", hash);
            const result2 = await query(
              "UPDATE users SET password = $1 WHERE userid = $2",
              [hash, userid]
            );
            // console.log("result2", result2);
            res.status(200).json("ok");
          }
        });
      } else {
        res.status(401).json({ message: "Invalid Email!" });
      }
    } catch (e: any) {
      console.log("server error", e);
      res.status(500).json({ message: e.message });
    }
  }
}
