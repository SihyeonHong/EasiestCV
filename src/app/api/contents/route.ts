import { NextResponse } from "next/server";

import { query } from "@/util/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userid");
    const tid = searchParams.get("tid");

    const result = await query(
      "SELECT contents FROM tabs WHERE userid = $1 AND tid = $2",
      [userId, tid],
    );

    return NextResponse.json(result[0].contents);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("server error: ", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 },
    );
  }
}

export interface UpdateContentsRequest {
  userid: string;
  tid: number;
  contents: string;
}

export async function PUT(request: Request) {
  try {
    const body: UpdateContentsRequest = await request.json();
    const { userid, tid, contents } = body;

    const result1 = await query(
      `SELECT contents FROM tabs WHERE userid = $1 and tid = $2`,
      [userid, tid],
    );

    if (result1.length) {
      await query(
        "UPDATE tabs SET contents = $1 WHERE userid = $2 and tid = $3",
        [contents, userid, tid],
      );
    } else {
      await query(
        "INSERT INTO tabs (userid, tid, contents) VALUES ($1, $2, $3)",
        [userid, tid, contents],
      );
    }

    return NextResponse.json({ message: "ok" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("server error:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 },
    );
  }
}
