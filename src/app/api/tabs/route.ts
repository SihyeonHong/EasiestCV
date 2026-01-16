import { ReturnedTid, Tab } from "@/types/tab";
import { ApiError, handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
import { query } from "@/utils/database";

export async function PUT(request: Request) {
  try {
    const body: Tab[] = await request.json();

    const currentTabs = await query<Tab>(
      "SELECT tid FROM tabs WHERE userid = $1",
      [body[0].userid],
    );

    // DB에 있는 탭 목록
    const currentTids = currentTabs.map((tab: Tab) => tab.tid);

    // FE에서 요청받은 탭 목록
    const receivedTids = body.map((tab: Tab) => tab.tid);

    // 새로 추가된 탭
    const newTids = receivedTids.filter(
      (tid: number) => !currentTids.includes(tid),
    );

    // 삭제된 탭
    const deletedTids = currentTids.filter(
      (tid: number) => !receivedTids.includes(tid),
    );

    // 삭제된 탭 제거
    await Promise.all(
      deletedTids.map(async (tid: number) => {
        await query("DELETE FROM tabs WHERE userid = $1 and tid = $2", [
          body[0].userid,
          tid,
        ]);
        return query("DELETE FROM contents WHERE userid = $1 and tid = $2", [
          body[0].userid,
          tid,
        ]);
      }),
    );

    // 새로운 탭 추가: DB가 자동생성해준 tid 받아서 slug 업데이트
    await Promise.all(
      body
        .filter((tab: Tab) => newTids.includes(tab.tid))
        .map(async (tab: Tab) => {
          const generatedTid: ReturnedTid = await query(
            "INSERT INTO tabs (userid, tname, torder, slug) VALUES ($1, $2, $3, $4) RETURNING tid",
            [tab.userid, tab.tname, tab.torder, ""],
          );
          if (generatedTid && generatedTid[0]?.tid) {
            await query("UPDATE tabs SET slug = $1 WHERE tid = $2", [
              generatedTid[0].tid.toString(),
              generatedTid[0].tid,
            ]);
          }
        }),
    );

    // 기존 탭 업데이트
    await Promise.all(
      body.map(async (tab: Tab) => {
        return query(
          "UPDATE tabs SET torder = $1, tname = $2, slug = $3 WHERE userid = $4 and tid = $5",
          [tab.torder, tab.tname, tab.slug, tab.userid, tab.tid],
        );
      }),
    );

    return ApiSuccess.updated();
  } catch (error: unknown) {
    return handleApiError(error, "탭 업데이트 실패");
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userid");

    const result = await query<Tab>("SELECT * FROM tabs WHERE userid = $1", [
      userId,
    ]);

    if (!result || result.length === 0) {
      return ApiError.userNotFound("탭을 찾을 수 없습니다.");
    }

    return ApiSuccess.data(
      result.sort((a: Tab, b: Tab) => a.torder - b.torder),
    );
  } catch (error: unknown) {
    return handleApiError(error, "탭 조회 실패");
  }
}
