import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../util/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    // console.log(req.body); // redux
    const { userinfo } = req.body;
    console.log(userinfo); // { userid: 'testid', intro: 'Hello! 추가', img: null, pdf: null }
    const { userid, intro, img, pdf } = req.body;

    // try update DB
    try {
      const result = await query(
        "UPDATE userinfo SET intro = $1, img = $2, pdf = $3 WHERE userid = $4",
        [intro, img, pdf, userid]
      );
      console.log("put home: ", result);
      res.status(200).json("ok");
    } catch (e: any) {
      console.log("server error", e);
      res.status(500).json({ message: e.message });
    }
  }
}
