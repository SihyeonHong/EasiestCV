import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../../../util/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let { userid, password } = req.body;
    try {
      const result = await query("SELECT * FROM users WHERE userid = $1", [
        userid,
      ]);

      if (
        result.length > 0 &&
        (await bcrypt.compare(password, result[0].password))
      ) {
        // If there's a match of userid and password, log in with jwt token
        const payload = { userid: result[0].userid };
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error("JWT_SECRET is not defined in .env.local");
        }
        const token = jwt.sign(payload, secret, { expiresIn: "1h" });
        res.json({ token: token, userid: result[0].userid });
      } else {
        // Return the same response whether there's no such user or password is incorrect
        res.status(401).json({ message: "Invalid ID or Password!" });
      }
    } catch (e: any) {
      console.log("server error: ", e);
      res.status(500).json({ message: e.message });
    }
  }
}
