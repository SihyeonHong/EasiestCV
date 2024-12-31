import { NextResponse } from "next/server";
import { query } from "@/util/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userid");
    const tid = searchParams.get("tid");

    const result = await query(
      "SELECT contents FROM tabs WHERE userid = $1 AND tid = $2",
      [userId, tid]
    );

    return NextResponse.json(result[0].contents);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("server error: ", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
