import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../util/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    console.log(req.body); // redux
    // let { userinfo } = req.body;
    // console.log(userinfo); // { userid: 'testid', intro: 'Hello! 추가', img: null, pdf: null }
    let { userid, username, intro, img, pdf } = req.body;

    // try update DB
    try {
      // `easiest-cv`.userinfo 테이블에서, userid가 userinfo.userid와 같은 column을 찾아서 업데이트
      const result = await query(
        "UPDATE `easiest-cv`.userinfo SET intro = ?, img = ?, pdf = ? WHERE userid = ?",
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
