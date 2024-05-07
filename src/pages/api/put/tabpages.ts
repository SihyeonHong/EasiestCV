import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../util/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { userid, tid, contents } = req.body;
    console.log(req.body);

    try {
      const result1 = await query(
        `SELECT contents FROM tabs WHERE userid = $1 and tid = $2`,
        [userid, tid]
      );

      if (result1.length) {
        const result2 = await query(
          "UPDATE tabs SET contents = $1 WHERE userid = $2 and tid = $3",
          [contents, userid, tid]
        );
      } else {
        const result3 = await query(
          "INSERT INTO tabs (userid, tid, contents) VALUES ($1, $2, $3)",
          [userid, tid, contents]
        );
      }

      res.status(200).json("ok");
    } catch (e: any) {
      console.log("server error", e);
      res.status(500).json({ message: e.message });
    }
  }
}
