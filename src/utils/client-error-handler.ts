import { isAxiosError } from "axios";

import { ApiErrorResponse, ErrorType } from "@/types/error";

/**
 * 에러 타입에 맞는 i18n 번역 키를 반환합니다.
 *
 * @param error - 발생한 에러
 * @returns i18n 번역 키 문자열
 */
export function getErrorI18nKey(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return "generalError";
    }

    const errorData = error.response.data as ApiErrorResponse;
    const errorType = errorData?.errorType as ErrorType | undefined;

    if (errorType && errorType in ERROR_TO_MESSAGE) {
      return ERROR_TO_MESSAGE[errorType];
    }

    return "generalError";
  }

  return "generalError";
}

/**
 * 에러 타입별 i18n 키 매핑
 */
const ERROR_TO_MESSAGE: Record<ErrorType, string> = {
  // 사용자가 고칠 수 있는 에러: 상세 안내
  MISSING_FIELDS: "missingFields",
  VALIDATION_ERROR: "missingFields",
  USER_NOT_FOUND: "userNotFound",
  WRONG_PASSWORD: "passwordMismatch",
  FILE_SIZE_ERROR: "fileSizeError",
  INVALID_IMAGE_TYPE: "invalidImageType",
  DUPLICATE_DATA: "duplicateId",

  // 사용자가 수정 불가능한 에러: "generalError"로 통일
  DATABASE_CONNECTION_ERROR: "generalError",
  INTERNAL_ERROR: "generalError",
  INVALID_JSON: "generalError",
  MISSING_ENV_VAR: "generalError",
  SERVER_ERROR: "generalError",
  UNKNOWN_ERROR: "generalError",
};
