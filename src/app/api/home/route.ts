import { NextResponse } from "next/server";

import { HomeData } from "@/types/user-data";
import { query } from "@/utils/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userid");

    const result = await query("SELECT * FROM userinfo WHERE userid = $1", [
      userId,
    ]);

    return NextResponse.json(result[0]);
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

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userid, intro, img, pdf }: HomeData = body;

    if (!userid) {
      return NextResponse.json(
        { message: "userid is required" },
        { status: 400 },
      );
    }

    const fieldsToUpdate: string[] = [];
    const values: (string | null)[] = [];

    if (intro !== undefined) {
      fieldsToUpdate.push("intro");
      values.push(intro);
    }
    if (img !== undefined) {
      fieldsToUpdate.push("img");
      values.push(img);
    }
    if (pdf !== undefined) {
      fieldsToUpdate.push("pdf");
      values.push(pdf);
    }

    if (fieldsToUpdate.length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 },
      );
    }

    const setClause = fieldsToUpdate
      .map((field, idx) => `${field} = $${idx + 1}`)
      .join(", ");

    const sql = `UPDATE userinfo SET ${setClause} WHERE userid = $${
      fieldsToUpdate.length + 1
    } RETURNING *`;

    values.push(userid);

    const result = await query<HomeData>(sql, values);

    return NextResponse.json({
      message: "Update successful",
      updated: result,
    });
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userid, intro, img, pdf } = body;

    await query(
      "UPDATE userinfo SET intro = $1, img = $2, pdf = $3 WHERE userid = $4",
      [intro, img, pdf, userid],
    );

    return NextResponse.json("ok");
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
