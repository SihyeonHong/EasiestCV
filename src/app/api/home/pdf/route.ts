import { NextResponse } from "next/server";
import { query } from "@/util/database";
import { uploadFile, deleteFile } from "@/util/gcs";

export async function POST(req: Request) {
  try {
    // multipart/form-data 형식으로 넘어온 데이터를 받기
    const formData = await req.formData();

    // formData에서 파일과 userid 가져오기
    const file = formData.get("file") as File | null;
    const userId = formData.get("userid") as string | null;

    if (!file || !userId) {
      return NextResponse.json(
        { error: "PDF 파일 혹은 userId가 누락되었습니다." },
        { status: 400 },
      );
    }

    // PDF 파일인지 체크
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "잘못된 파일 형식입니다. PDF만 업로드 가능합니다." },
        { status: 400 },
      );
    }

    // 1) 기존에 DB에 저장된 PDF 경로가 있으면 GCS에서 삭제
    const existing = await query("SELECT pdf FROM userinfo WHERE userid = $1", [
      userId,
    ]);
    if (existing[0]?.pdf) {
      const oldFileName = existing[0].pdf.split("/").pop();
      try {
        await deleteFile(oldFileName);
      } catch (err) {
        console.error("기존 PDF 삭제 오류:", err);
      }
    }

    // 2) 새로운 PDF 업로드
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uniqueFilename = `${file.name}-${Date.now()}`;
    const pdfUrl = `https://storage.googleapis.com/easiest-cv/${uniqueFilename}`;

    // GCS에 업로드
    await uploadFile(uniqueFilename, buffer, "pdf");

    // 3) DB에 새 PDF URL 업데이트
    await query("UPDATE userinfo SET pdf = $1 WHERE userid = $2", [
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
