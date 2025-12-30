import { ApiError, handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
import { query } from "@/utils/database";
import extractFileName from "@/utils/extractFileName";
import { uploadFile, deleteFile, downloadFile } from "@/utils/gcs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userid");
    const shouldDownload = searchParams.get("download") === "true";

    if (!userId) {
      return ApiError.validation("userid가 필요합니다.", 400);
    }

    const result = await query<{ url?: string }>(
      "SELECT url FROM documents WHERE userid = $1",
      [userId],
    ); // [{ url: "url1" }, { url: "url2" }, { url: "url3" }]

    if (result.length === 0 || !result[0]?.url) {
      return ApiError.validation("문서가 존재하지 않습니다.", 404);
    }

    // 다운로드 요청인 경우 파일을 직접 반환
    if (shouldDownload) {
      const fileUrl = result[0].url;
      const gcsFileName = fileUrl.split("/").pop() ?? "";

      if (!gcsFileName) {
        return ApiError.validation("파일명을 찾을 수 없습니다.", 400);
      }

      try {
        // GCS에서 파일 다운로드
        const fileBuffer = await downloadFile(gcsFileName);

        // 원본 파일명 추출 (확장자 포함)
        const originalFileName = extractFileName(fileUrl) || "resume";
        const downloadFileName = `${originalFileName}.pdf`;

        // Buffer를 Uint8Array로 변환하여 Response 생성
        const uint8Array = new Uint8Array(fileBuffer);
        return new Response(uint8Array, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${encodeURIComponent(downloadFileName)}"`,
            "Cache-Control": "no-cache",
          },
        });
      } catch (error: unknown) {
        return handleApiError(error, "파일 다운로드 실패");
      }
    }

    // 기본 동작: URL 배열 반환
    const urls = result
      .map((row) => row.url)
      .filter((url): url is string => url !== undefined);

    return ApiSuccess.data(urls);
  } catch (error: unknown) {
    return handleApiError(error, "문서 조회 실패");
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
      const missingFields: string[] = [];
      if (!document) missingFields.push("document");
      if (!userId) missingFields.push("userid");
      return ApiError.missingFields(missingFields);
    }

    // PDF 파일인지 체크
    if (document.type !== "application/pdf") {
      return ApiError.validation(
        "잘못된 파일 형식입니다. PDF만 업로드 가능합니다.",
        400,
      );
    }

    // 1) 기존에 DB에 저장된 PDF 경로가 있으면 GCS에서 삭제
    const existing = await query<{ url: string | null }>(
      "SELECT url FROM documents WHERE userid = $1",
      [userId],
    );
    if (existing.length > 0 && existing[0]?.url) {
      const oldFileName = existing[0].url.split("/").pop() ?? "";
      try {
        await deleteFile(oldFileName);
      } catch {
        console.error("기존 PDF 삭제 오류");
        // 삭제 실패해도 계속 진행
      }
    }

    // 2) 새로운 PDF 업로드
    const arrayBuffer = await document.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uniqueFilename = `${document.name}-${Date.now()}`;
    const pdfUrl = `https://storage.googleapis.com/easiest-cv/${uniqueFilename}`;

    // GCS에 업로드
    await uploadFile(uniqueFilename, buffer, "pdf");

    // 3) DB에 새 PDF URL 업데이트 (UPSERT)
    // userid에 UNIQUE 제약이 없으므로 기존 레코드가 있으면 UPDATE, 없으면 INSERT
    if (existing.length > 0) {
      await query("UPDATE documents SET url = $1 WHERE userid = $2", [
        pdfUrl,
        userId,
      ]);
    } else {
      await query("INSERT INTO documents (userid, url) VALUES ($1, $2)", [
        userId,
        pdfUrl,
      ]);
    }

    // 4) 업로드 결과 반환
    return ApiSuccess.created({ pdfUrl });
  } catch (error: unknown) {
    return handleApiError(error, "PDF 업로드 실패");
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userid");

    if (!userId) {
      return ApiError.validation("userid가 필요합니다.", 400);
    }

    // 1) DB에서 기존 문서 조회
    const existing = await query<{ url: string | null }>(
      "SELECT url FROM documents WHERE userid = $1",
      [userId],
    );

    if (existing.length === 0 || !existing[0]?.url) {
      return ApiError.validation("문서가 존재하지 않습니다.", 404);
    }

    // 2) GCS에서 파일 삭제
    const fileUrl = existing[0].url;
    const fileName = fileUrl.split("/").pop() ?? "";

    if (fileName) {
      try {
        await deleteFile(fileName);
      } catch {
        console.error("GCS 파일 삭제 오류");
        // GCS 삭제 실패해도 DB 삭제는 진행
      }
    }

    // 3) DB에서 레코드 삭제
    await query("DELETE FROM documents WHERE userid = $1", [userId]);

    return ApiSuccess.deleted("문서가 삭제되었습니다.");
  } catch (error: unknown) {
    return handleApiError(error, "문서 삭제 실패");
  }
}
