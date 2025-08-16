import { NextResponse } from "next/server";

import { query } from "@/utils/database";

export async function PATCH(request: Request) {
  try {
    const { userid, intro } = await request.json();
    await query("UPDATE userinfo SET intro = $1 WHERE userid = $2", [
      intro,
      userid,
    ]);
    return NextResponse.json({ success: true, intro: intro }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("server error: ", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      console.error("unexpected error: ", error);
      return NextResponse.json(
        { message: "An unexpected error occurred" },
        { status: 500 },
      );
    }
  }
}
