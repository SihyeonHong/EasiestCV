import { NextResponse } from "next/server";

import { createSuccessResponse } from "@/utils/api-success";
import { query } from "@/utils/database";
import { uploadFile, deleteFile } from "@/utils/gcs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userid");

    if (!userId) {
      return NextResponse.json(
        { message: "userid is required" },
        { status: 400 },
      );
    }

    const result = await query<{ url?: string }>(
      "SELECT url FROM documents WHERE userid = $1",
      [userId],
    ); // [{ url: "url1" }, { url: "url2" }, { url: "url3" }]

    const urls = result
      .map((row) => row.url)
      .filter((url): url is string => url !== undefined);

    return createSuccessResponse(urls);
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

export async function POST(req: Request) {
  try {
    // multipart/form-data 형식으로 넘어온 데이터를 받기
    const formData = await req.formData();

    // formData에서 파일과 userid 가져오기
    const document = formData.get("document") as File | null;
    const userId = formData.get("userid") as string | null;

    if (!document || !userId) {
      return NextResponse.json(
        { error: "PDF 파일 혹은 userId가 누락되었습니다." },
        { status: 400 },
      );
    }

    // PDF 파일인지 체크
    if (document.type !== "application/pdf") {
      return NextResponse.json(
        { error: "잘못된 파일 형식입니다. PDF만 업로드 가능합니다." },
        { status: 400 },
      );
    }

    // 1) 기존에 DB에 저장된 PDF 경로가 있으면 GCS에서 삭제
    const existing = await query<{ pdf: string | null }>(
      "SELECT url FROM documents WHERE userid = $1",
      [userId],
    );
    if (existing.length > 0 && existing[0]?.pdf) {
      const oldFileName = existing[0].pdf.split("/").pop() ?? "";
      try {
        await deleteFile(oldFileName);
      } catch (err) {
        console.error("기존 PDF 삭제 오류:", err);
      }
    }

    // 2) 새로운 PDF 업로드
    const arrayBuffer = await document.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uniqueFilename = `${document.name}-${Date.now()}`;
    const pdfUrl = `https://storage.googleapis.com/easiest-cv/${uniqueFilename}`;

    // GCS에 업로드
    await uploadFile(uniqueFilename, buffer, "pdf");

    // 3) DB에 새 PDF URL 업데이트
    await query("UPDATE documents SET url = $1 WHERE userid = $2", [
      pdfUrl,
      userId,
    ]);

    // 4) 업로드 결과 반환
    return NextResponse.json({ pdfUrl }, { status: 200 });
  } catch (error) {
    console.error("PDF 업로드 실패:", error);
    return NextResponse.json(
      { error: "PDF 업로드 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
