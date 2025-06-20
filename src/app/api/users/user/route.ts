import { NextResponse } from "next/server";

import { query } from "@/util/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userid");

    const result = await query("SELECT * FROM users WHERE userid = $1", [
      userId,
    ]);

    if (result.length === 0) {
      return NextResponse.json(
        { message: "사용자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json(result[0]);
  } catch (error: unknown) {
    console.log("server error: ", error);

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "알 수 없는 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userid, username, email } = body as {
      userid?: string;
      username?: string;
      email?: string;
    };

    const missingFields: string[] = [];
    if (!userid) missingFields.push("userid");
    if (!username) missingFields.push("username");
    if (!email) missingFields.push("email");

    if (!userid) {
      return NextResponse.json(
        { message: "userid가 누락되었습니다." },
        { status: 400 },
      );
    }
    if (!username) {
      return NextResponse.json(
        { message: "username이 누락되었습니다." },
        { status: 400 },
      );
    }
    if (!email) {
      return NextResponse.json(
        { message: "email이 누락되었습니다." },
        { status: 400 },
      );
    }

    await query(
      "UPDATE users SET username = $1, email = $2 WHERE userid = $3",
      [username, email, userid],
    );

    return NextResponse.json("ok");
  } catch (error: unknown) {
    console.log("server error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "알 수 없는 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
