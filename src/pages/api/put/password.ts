import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../util/database";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    // console.log(req.body);
    let { userid, username, email, currentPW, newPW } = req.body;

    // try update DB
    try {
      const result = await query(
        "SELECT * FROM `easiest-cv`.users WHERE userid = ?",
        [userid]
      );
      //   console.log("result", result);
      if (
        result.length > 0 &&
        (await bcrypt.compare(currentPW, result[0].password))
      ) {
        // If there's a match of userid and password,
        const hash = await bcrypt.hash(newPW, 10);
        // console.log("hash", hash);
        const result2 = await query(
          "UPDATE `easiest-cv`.users SET username = ?, email = ?, password = ? WHERE userid = ?",
          [username, email, hash, userid]
        );
        // console.log("result2", result2);
        res.status(200).json("ok");
      } else {
        res.status(401).json({ message: "Invalid Password!" });
      }
    } catch (e: any) {
      console.log("server error", e);
      res.status(500).json({ message: e.message });
    }
  }
}
