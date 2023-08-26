import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../util/database";
import { TabContent } from "@/redux/store";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      console.log(req.query);
      const userId = req.query.userid;
      const tid = req.query.tid;
      const result = await query(
        "SELECT * FROM `easiest-cv`.contents WHERE userid = ? AND tid = ?",
        [userId, tid]
      );
      console.log("getContents result: ", result);
      const sortedRes = result.sort(
        (a: TabContent, b: TabContent) => a.corder - b.corder
      );
      res.json(result);
    } catch (e: any) {
      console.log("server error: ", e);
      res.status(500).json({ message: e.message });
    }
  }
}
