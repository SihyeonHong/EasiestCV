import { NextResponse } from "next/server";

import { createErrorNextResponse } from "@/utils/api-error";
import { createSuccessResponse } from "@/utils/api-success";
import { query } from "@/utils/database";
import { uploadFile, deleteFile } from "@/utils/gcs";

export async function POST(req: Request) {
  try {
    // multipart/form-data 형식으로 넘어온 데이터를 받기
    const formData = await req.formData();

    // formData에서 파일과 userid 가져오기
    const imgFile = formData.get("imgFile") as File | null;
    const userId = formData.get("userid") as string | null;

    if (!imgFile || !userId) {
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
      "image/bmp",
    ];

    // 업로드된 파일이 허용된 이미지 형식인지 검사
    if (!allowedTypes.includes(imgFile.type)) {
      return createErrorNextResponse(
        "INVALID_IMAGE_TYPE",
        "잘못된 파일 형식입니다. JPG, PNG, GIF, WebP, BMP만 업로드 가능합니다.",
      );
    }

    // 1) 기존에 DB에 저장된 이미지 경로가 있으면 GCS에서 삭제
    const existing = await query<{ img_url: string | null }>(
      "SELECT img_url FROM user_home WHERE userid = $1",
      [userId],
    );
    if (existing.length > 0 && existing[0]?.img_url) {
      const oldFileName = existing[0].img_url.split("/").pop() ?? "";
      try {
        await deleteFile(oldFileName);
      } catch (err) {
        console.error("기존 이미지 삭제 오류:", err);
      }
    }

    // 2) 새로운 이미지 업로드
    const arrayBuffer = await imgFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uniqueFilename = `${imgFile.name}-${Date.now()}`;
    const imageUrl = `https://storage.googleapis.com/easiest-cv/${uniqueFilename}`;

    // GCS에 업로드 (uploadFile 함수 구현 방식에 맞춰 인자 전달)
    await uploadFile(uniqueFilename, buffer, "image");

    // 3) DB에 새 이미지 URL 업데이트
    await query("UPDATE user_home SET img_url = $1 WHERE userid = $2", [
      imageUrl,
      userId,
    ]);

    // 4) 업로드 결과 반환
    return createSuccessResponse(imageUrl);
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    return createErrorNextResponse(
      "SERVER_ERROR",
      "이미지 업로드 중 오류가 발생했습니다.",
    );
  }
}
