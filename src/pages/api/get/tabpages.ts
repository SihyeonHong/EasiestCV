import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../util/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = req.query.userid;
    const tid = req.query.tid;
    const result = await query(
      "SELECT contents FROM tabs WHERE userid = $1 AND tid = $2",
      [userId, tid]
    );
    res.json(result[0].contents);
  } catch (e: any) {
    console.log("server error: ", e);
    res.status(500).json({ message: e.message });
  }
}
