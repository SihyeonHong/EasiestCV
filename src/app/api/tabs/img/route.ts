import { NextResponse } from "next/server";

import { ApiErrorResponse } from "@/types/error";
import { uploadFile } from "@/utils/gcs";

export async function POST(request: Request) {
  try {
    // multipart/form-data 형식으로 넘어온 데이터를 받기
    const formData = await request.formData();

    // formData에서 파일과 userid 가져오기
    const file = formData.get("file") as File | null;
    const userId = formData.get("userid") as string | null;

    if (!file || !userId) {
      const response: ApiErrorResponse = {
        message: "이미지 파일 혹은 userId가 누락되었습니다.",
        errorType: "VALIDATION_ERROR",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 파일 크기 검증 추가
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      const response: ApiErrorResponse = {
        message: "파일 크기는 20MB를 초과할 수 없습니다.",
        errorType: "FILE_SIZE_ERROR",
      };
      return NextResponse.json(response, { status: 400 });
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
    if (!allowedTypes.includes(file.type)) {
      const response: ApiErrorResponse = {
        message:
          "지원하지 않는 이미지 형식입니다. JPG, PNG, GIF, WebP, BMP만 업로드 가능합니다.",
        errorType: "INVALID_IMAGE_TYPE",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 이미지 GCS에 업로드
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uniqueFilename = `${file.name}-${Date.now()}`;
    const imageUrl = `https://storage.googleapis.com/easiest-cv/${uniqueFilename}`;

    await uploadFile(uniqueFilename, buffer, "image");

    // GCS 링크 전달
    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch {
    console.error("이미지 업로드 실패");
    return NextResponse.json(
      { error: "이미지 업로드 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
