import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../../util/database";
import { Tab } from "@/redux/store";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    console.log("put_tabs: ", req.body);
    const body: Tab[] = [...req.body];

    try {
      const currentTabs = await query(
        "SELECT tid FROM `easiest-cv`.tabs WHERE userid = ? ",
        [body[0].userid]
      );

      // DB에 있는 탭 목록
      const currentTids = currentTabs.map((tab: Tab) => tab.tid);

      // FE에서 요청받은 탭 목록
      const receivedTids = body.map((tab: Tab) => tab.tid);

      // 새로 추가된 탭
      const newTids = receivedTids.filter(
        (tid: number) => !currentTids.includes(tid)
      );

      // 삭제된 탭
      const deletedTids = currentTids.filter(
        (tid: number) => !receivedTids.includes(tid)
      );

      // 삭제된 탭 제거
      await Promise.all(
        deletedTids.map(async (tid: number) => {
          return query(
            "DELETE FROM `easiest-cv`.tabs WHERE userid = ? and tid = ?",
            [body[0].userid, tid]
          );
        })
      );

      // 새로운 탭 추가
      await Promise.all(
        body
          .filter((tab: Tab) => newTids.includes(tab.tid))
          .map(async (tab: Tab) => {
            return query(
              "INSERT INTO `easiest-cv`.tabs (userid, tid, tname, torder) VALUES (?,?,?,?)",
              [tab.userid, tab.tid, tab.tname, tab.torder]
            );
          })
      );

      // 기존 탭 업데이트 (어 이걸 먼저 하면 새로운 탭 아이디 못찾아서 에러 나는 거 아니냐)
      await Promise.all(
        body.map(async (tab: Tab) => {
          return query(
            "UPDATE `easiest-cv`.tabs SET torder = ?, tname = ? WHERE userid = ? and tid = ?",
            [tab.torder, tab.tname, tab.userid, tab.tid]
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

/* put_tabs:  [
      { userid: 'testid', 
        tid: 1, 
        tname: 'Tab1', 
        torder: 0 
      },
      {
        userid: 'testid',
        tid: 982746.9207177691,
        tname: 'tab2',
        torder: 1
      }
    ]*/
