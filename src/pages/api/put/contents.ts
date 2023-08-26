import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../util/database";
import { TabContent } from "@/redux/store";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    console.log("put contents body ", req.body);
    const body: TabContent[] = [...req.body];

    try {
      // 데이터베이스의 현재 contents 가져오기
      const currentContents = await query(
        "SELECT cid FROM `easiest-cv`.contents WHERE userid = ? AND tid = ?",
        [body[0]?.userid, body[0]?.tid]
      ); // [   { cid: 1 },   { cid: 2 },   { cid: 3 } ]
      const currentCids = currentContents.map(
        (content: TabContent) => content.cid
      ); // [1,2,3]
      const receivedCids = body.map((content) => content.cid); // [1,2,3]

      // 새로 추가된 컬럼 찾기
      const newCids = receivedCids.filter((cid) => !currentCids.includes(cid));

      // 삭제된 컬럼 찾기
      const deletedCids = currentCids.filter(
        (cid: number) => !receivedCids.includes(cid)
      );

      // 새로운 컬럼 추가
      await Promise.all(
        body
          .filter((content) => newCids.includes(content.cid))
          .map(async (content) => {
            return query(
              "INSERT INTO `easiest-cv`.contents (cid, userid, tid, corder, type, ccontent) VALUES (?, ?, ?, ?, ?, ?)",
              [
                content.cid,
                content.userid,
                content.tid,
                content.corder,
                content.type,
                content.ccontent,
              ]
            );
          })
      );

      // 삭제된 컬럼 제거
      await Promise.all(
        deletedCids.map(async (cid: number) => {
          return query(
            "DELETE FROM `easiest-cv`.contents WHERE cid = ? AND userid = ? AND tid = ?",
            [cid, body[0]?.userid, body[0]?.tid]
          );
        })
      );

      // 기존 컬럼 업데이트
      await Promise.all(
        body.map(async (content) => {
          return query(
            "UPDATE `easiest-cv`.contents SET corder = ?, type = ?, ccontent = ? WHERE userid = ? and tid = ? and cid = ?",
            [
              content.corder,
              content.type,
              content.ccontent,
              content.userid,
              content.tid,
              content.cid,
            ]
          );
        })
      );

      res.status(200).json("ok");
    } catch (e: any) {
      console.log("server error", e);
      res.status(500).json({ message: e.message });
    }
  }
}

/* put contents body  [
    {
      userid: 'testid',
      tid: 1,
      cid: 0.37514404293673276,
      type: 'title',
      ccontent: 'New Title',
      corder: 0
    },
    {
      userid: 'testid',
      tid: 1,
      cid: 0.03377353282465867,
      type: 'description',
      ccontent: 'New description',
      corder: 1
    }
  ] */
