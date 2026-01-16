import { NextResponse } from "next/server";

import { ApiErrorResponse } from "@/types/error";
import { uploadFile } from "@/utils/gcs";

// GCS에 pdf 파일 업로드하는 api입니다.

export async function POST(request: Request) {
  try {
    // multipart/form-data 형식으로 넘어온 데이터를 받기
    const formData = await request.formData();

    // formData에서 파일과 userid 가져오기
    const file = formData.get("file") as File | null;
    const userId = formData.get("userid") as string | null;

    if (!file || !userId) {
      const response: ApiErrorResponse = {
        message: "PDF 파일 혹은 userId가 누락되었습니다.",
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

    // PDF 파일인지 체크
    if (file.type !== "application/pdf") {
      const response: ApiErrorResponse = {
        message: "지원하지 않는 파일 형식입니다. PDF만 업로드 가능합니다.",
        errorType: "INVALID_FILE_TYPE",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // PDF GCS에 업로드
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uniqueFilename = `${file.name}-${Date.now()}`;
    const pdfUrl = `https://storage.googleapis.com/easiest-cv/${uniqueFilename}`;

    await uploadFile(uniqueFilename, buffer, "pdf");

    // GCS 링크 전달
    return NextResponse.json({ pdfUrl }, { status: 200 });
  } catch (error) {
    console.error("PDF 업로드 실패:", error);
    return NextResponse.json(
      { error: "PDF 업로드 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
