import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { query } from "./../../../util/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let { userid, username, email, password } = req.body;

    // encrypt password
    const hash = await bcrypt.hash(password, 10);
    password = hash;

    // insert into DB
    try {
      const result = await query(
        "INSERT INTO `easiest-cv`.users (userid, username, email, password) VALUES (?, ?, ?, ?)",
        [userid, username, email, password]
      );
      //   console.log("server result: ", result); // OkPacket OkPacket { affectedRows: 1, insertId: 0n, warningStatus: 0 }
      result.insertId = result.insertId.toString(); // BigInt 값을 문자열로 변환
      res.json(result);
    } catch (e: any) {
      console.log("server error", e);
      res.status(500).json({ message: e.message });
    }
  }
}
