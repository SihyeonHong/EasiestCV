import { allowedImgTypes } from "@/constants/constants";
import { ApiError } from "@/utils/api-error";

/**
 * 업로드된 파일이 허용된 이미지 형식인지 검사
 * @param file - 검증할 File 객체
 * @returns 유효하지 않은 이미지 형식이면 ApiError 응답, 유효하면 null
 */
export function validateImageType(
  file: File,
): ReturnType<typeof ApiError.invalidImageType> | null {
  if (!allowedImgTypes.includes(file.type)) {
    return ApiError.invalidImageType();
  }
  return null;
}
