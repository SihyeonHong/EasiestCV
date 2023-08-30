import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../util/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      let userId = req.query.userid;
      const result = await query(
        "SELECT * FROM `easiest-cv`.users WHERE userid = ?",
        [userId]
      );

      //   console.log("server result: ", result);
      res.json(result);
    } catch (e: any) {
      console.log("server error: ", e);
      res.status(500).json({ message: e.message });
    }
  }
}
