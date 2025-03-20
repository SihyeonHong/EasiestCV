import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(null, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, secret) as { userid: string };

    return NextResponse.json({ userid: decoded.userid });
  } catch (error) {
    console.error(error);
    return NextResponse.json(null, { status: 401 });
  }
}
