import { allowedTypes, DEFAULT_IMG } from "@/constants/constants";
import { ApiError, handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
import { query } from "@/utils/database";
import extractFileName from "@/utils/extractFileName";
import { uploadFile, deleteFile } from "@/utils/gcs";
import { validateMissingFields } from "@/utils/validateMissingFields";

// 클라이언트가 img url을 직접 주는 경우
export async function PUT(request: Request) {
  try {
    const { userid, imgUrl, oldFileName } = await request.json();

    if (oldFileName) {
      await deleteFile(oldFileName);
    }

    await query("UPDATE user_home SET img_url = $1 WHERE userid = $2", [
      imgUrl,
      userid,
    ]);

    return ApiSuccess.updated();
  } catch (error: unknown) {
    return handleApiError(error, "이미지 URL 업데이트 실패");
  }
}

// 클라이언트가 업로드할 이미지 파일을 주는 경우(formData)
export async function POST(req: Request) {
  try {
    // 1) 데이터 받기
    const formData = await req.formData();
    const imgFile = formData.get("imgFile") as File | null;
    const userId = formData.get("userid") as string | null;

    // 2) 데이터 검증
    const errorResponse = validateMissingFields({ imgFile, userId });
    if (errorResponse) return errorResponse;

    // missingFields 통과했으므로 imgFile과 userId는 null이 아님. TypeScript가 이를 인식하도록 타입 단언 사용
    const validImgFile = imgFile as File;
    const validUserId = userId as string;

    // 업로드된 파일이 허용된 이미지 형식인지 검사
    if (!allowedTypes.includes(validImgFile.type)) {
      return ApiError.invalidImageType();
    }

    // 3) 기존 파일 있으면 삭제
    await deleteOldImg(validUserId);

    // 4) GCS에 새 이미지 업로드
    const uniqueFilename = `${validImgFile.name}-${Date.now()}`;
    const imageUrl = `https://storage.googleapis.com/easiest-cv/${uniqueFilename}`;
    const buffer = Buffer.from(await validImgFile.arrayBuffer());
    await uploadFile(uniqueFilename, buffer, "image");

    // 5) DB에 새 URL 업데이트
    await query("UPDATE user_home SET img_url = $1 WHERE userid = $2", [
      imageUrl,
      validUserId,
    ]);

    // 6) 성공 리턴
    return ApiSuccess.created(imageUrl);
  } catch (error: unknown) {
    return handleApiError(error, "이미지 업로드 실패");
  }

  async function deleteOldImg(userId: string) {
    // DB에 현재 저장된 이미지가 있는지 확인
    const existing = await query<{ img_url: string | null }>(
      "SELECT img_url FROM user_home WHERE userid = $1",
      [userId],
    );
    if (
      existing.length > 0 &&
      existing[0]?.img_url &&
      existing[0].img_url !== DEFAULT_IMG
    ) {
      try {
        await deleteFile(extractFileName(existing[0].img_url));
      } catch {
        console.error("기존 이미지 삭제 오류");
        // 기존 이미지 삭제 실패해도 계속 진행
      }
    }
  }
}
