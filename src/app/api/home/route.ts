import { NextResponse } from "next/server";

import { createSuccessResponse } from "@/utils/api-success";
import { query } from "@/utils/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userid");

    const result = await query("SELECT * FROM user_home WHERE userid = $1", [
      userId,
    ]);

    return createSuccessResponse(result[0]);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log("server error: ", e);
      return NextResponse.json({ message: e.message }, { status: 500 });
    } else {
      console.log("unexpected error: ", e);
      return NextResponse.json(
        { message: "An unexpected error occurred" },
        { status: 500 },
      );
    }
  }
}
