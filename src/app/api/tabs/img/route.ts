import { ApiError, handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";
import { uploadFile } from "@/utils/gcs";
import { validateMissingFields } from "@/utils/validateMissingFields";

export async function POST(request: Request) {
  try {
    // multipart/form-data 형식으로 넘어온 데이터를 받기
    const formData = await request.formData();

    // formData에서 파일과 userid 가져오기
    const file = formData.get("file") as File | null;
    const userId = formData.get("userid") as string | null;

    // validation
    const errorResponse = validateMissingFields({
      file,
      userid: userId,
    });
    if (errorResponse) {
      return errorResponse;
    }
    // validateMissingFields 통과했으므로 file은 null이 아님
    const validFile = file as File;

    // 파일 크기 검증
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (validFile.size > maxSize) {
      return ApiError.fileSize();
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
    if (!allowedTypes.includes(validFile.type)) {
      return ApiError.invalidImageType();
    }

    // 이미지 GCS에 업로드
    const arrayBuffer = await validFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uniqueFilename = `${validFile.name}-${Date.now()}`;
    const imageUrl = `https://storage.googleapis.com/easiest-cv/${uniqueFilename}`;

    await uploadFile(uniqueFilename, buffer, "image");

    // GCS 링크 전달
    return ApiSuccess.data({ imageUrl });
  } catch (error: unknown) {
    return handleApiError(error, "이미지 업로드 실패");
  }
}
