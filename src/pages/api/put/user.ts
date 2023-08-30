import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../util/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    console.log(req.body);
    let { userid, username, email } = req.body;

    // try update DB
    try {
      const result = await query(
        "UPDATE `easiest-cv`.users SET username = ?, email = ? WHERE userid = ?",
        [username, email, userid]
      );
      //   console.log("put user: ", result);
      res.status(200).json("ok");
    } catch (e: any) {
      console.log("server error", e);
      res.status(500).json({ message: e.message });
    }
  }
}
