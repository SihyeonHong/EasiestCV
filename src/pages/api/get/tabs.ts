import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../util/database";
import { Tab } from "../../../models/tab.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      console.log(req.query);
      let userId = req.query.userid;
      const result = await query("SELECT * FROM tabs WHERE userid = $1", [
        userId,
      ]);
      //   console.log("getTabs result: ", result);
      res.json(result.sort((a: Tab, b: Tab) => a.torder - b.torder));
    } catch (e: any) {
      console.log("server error: ", e);
      res.status(500).json({ message: e.message });
    }
  }
}
