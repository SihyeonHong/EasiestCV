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
        `SELECT page_id FROM tab_pages WHERE user_id = $1 and tab_id = $2`,
        [userid, tid]
      );
      if (result1) {
        const result2 = await query(
          "UPDATE tab_pages SET contents = $1 WHERE user_id = $2 and tab_id = $3",
          [contents, userid, tid]
        );
      } else {
        const result3 = await query(
          "INSERT INTO tab_pages (user_id, tab_id, contents) VALUES ($1, $2, $3)",
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
