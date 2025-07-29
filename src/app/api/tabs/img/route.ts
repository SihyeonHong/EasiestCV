import { NextResponse } from "next/server";

import { query } from "@/util/database";
import { uploadFile } from "@/util/gcs";

export async function POST(request: Request) {
  try {
    // multipart/form-data 형식으로 넘어온 데이터를 받기
    const formData = await request.formData();

    // formData에서 파일과 userid 가져오기
    const file = formData.get("file") as File | null;
    const userId = formData.get("userid") as string | null;

    if (!file || !userId) {
      return NextResponse.json(
        { error: "이미지 파일 혹은 userId가 누락되었습니다." },
        { status: 400 },
      );
    }

    // 허용할 이미지 MIME 타입 목록
    const allowedTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
    ];

    // 업로드된 파일이 허용된 이미지 형식인지 검사
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "잘못된 파일 형식입니다. JPG, PNG, GIF, WebP, SVG, BMP만 업로드 가능합니다.",
        },
        { status: 400 },
      );
    }

    // 이미지 GCS에 업로드
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uniqueFilename = `${file.name}-${Date.now()}`;
    const imageUrl = `https://storage.googleapis.com/easiest-cv/${uniqueFilename}`;

    await uploadFile(uniqueFilename, buffer, "image");

    // DB에 GCS 링크 저장????????????
    await query("UPDATE tabs SET img = $1 WHERE userid = $2", [
      imageUrl,
      userId,
    ]);

    // 업로드 결과 반환
    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    return NextResponse.json(
      { error: "이미지 업로드 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
