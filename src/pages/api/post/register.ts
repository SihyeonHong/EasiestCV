import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { query } from "./../../../pages/util/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let { userid, username, email, password } = req.body;

    // encrypt password
    const hash = await bcrypt.hash(password, 10);
    password = hash;

    // insert into DB `easiest-cv`.
    try {
      const result = await query(
        "INSERT INTO users (userid, username, email, password) VALUES ($1, $2, $3, $4)",
        [userid, username, email, password]
      );
      const result2 = await query("INSERT INTO userinfo (userid) VALUES ($1)", [
        userid,
      ]);
      const result3 = await query(
        "INSERT INTO tabs (userid, tname, torder) VALUES ($1, $2, $3)",
        [userid, "Tab1", 0]
      );
      res.status(200).json("ok");
    } catch (e: any) {
      console.log("server error", e);
      res.status(500).json({ message: e.message });
    }
  }
}
