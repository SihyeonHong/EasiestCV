import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import { SignupRequest } from "@/models/user.model";
import { query } from "@/util/database";

export async function POST(request: NextRequest) {
  const startAll = Date.now();
  try {
    const startBody = Date.now();
    const { userid, password } = await request.json();
    console.log("Parsing request body took", Date.now() - startBody, "ms");

    if (!userid || !password) {
      return NextResponse.json(
        { message: "아이디와 비밀번호를 입력해주세요." },
        { status: 400 },
      );
    }

    const startQuery = Date.now();
    const result = await query<SignupRequest>(
      "SELECT * FROM users WHERE userid = $1",
      [userid],
    );
    console.log("DB query took", Date.now() - startQuery, "ms");

    const startCompare = Date.now();
    const isMatch = await bcrypt.compare(password, result[0].password);
    console.log("bcrypt.compare took", Date.now() - startCompare, "ms");

    if (result.length > 0 && isMatch) {
      const payload = { userid: result[0].userid };
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new Error("JWT_SECRET is not defined in .env.local");
      }

      const startJwt = Date.now();
      const token = jwt.sign(payload, secret, { expiresIn: "12h" });
      console.log("JWT signing took", Date.now() - startJwt, "ms");

      const response = NextResponse.json(
        {
          message: "login success",
          user: {
            userid: result[0].userid,
          },
        },
        { status: 200 },
      );

      response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: undefined, // session cookie
        expires: undefined, // session cookie
        path: "/",
      });

      console.log("Total login time:", Date.now() - startAll, "ms");
      return response;
    }

    return NextResponse.json(
      { message: "Invalid ID or Password" },
      { status: 401 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Login Error");
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { message: "An unexpected error occurred" },
        { status: 500 },
      );
    }
  }
}
