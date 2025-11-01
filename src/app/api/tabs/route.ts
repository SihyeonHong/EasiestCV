import { NextResponse } from "next/server";

import { Tab } from "@/types/tab";
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

    // 새로운 탭 추가
    await Promise.all(
      body
        .filter((tab: Tab) => newTids.includes(tab.tid))
        .map(async (tab: Tab) => {
          return query(
            "INSERT INTO tabs (userid, tname, torder) VALUES ($1,$2,$3)",
            [tab.userid, tab.tname, tab.torder],
          );
        }),
    );

    // 기존 탭 업데이트
    await Promise.all(
      body.map(async (tab: Tab) => {
        return query(
          "UPDATE tabs SET torder = $1, tname = $2 WHERE userid = $3 and tid = $4",
          [tab.torder, tab.tname, tab.userid, tab.tid],
        );
      }),
    );

    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { message: "An unexpected error occurred" },
        { status: 500 },
      );
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userid");

    const result = await query<Tab>("SELECT * FROM tabs WHERE userid = $1", [
      userId,
    ]);
    return NextResponse.json(
      result.sort((a: Tab, b: Tab) => a.torder - b.torder),
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { message: "An unexpected error occurred" },
        { status: 500 },
      );
    }
  }
}
