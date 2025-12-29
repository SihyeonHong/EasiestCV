import { NextResponse } from "next/server";

import { ApiErrorResponse } from "@/types/error";

/**
 * API 에러 타입 상수
 */
export const ErrorType = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  MISSING_FIELDS: "MISSING_FIELDS",
  SERVER_ERROR: "SERVER_ERROR",
  DATABASE_CONNECTION_ERROR: "DATABASE_CONNECTION_ERROR",
  DUPLICATE_DATA: "DUPLICATE_DATA",
  INVALID_JSON: "INVALID_JSON",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  WRONG_PASSWORD: "WRONG_PASSWORD",
  FILE_SIZE_ERROR: "FILE_SIZE_ERROR",
  INVALID_IMAGE_TYPE: "INVALID_IMAGE_TYPE",
} as const;

export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];

/**
 * 에러 타입별 기본 HTTP 상태 코드 매핑
 */
const DEFAULT_STATUS_CODES: Record<ErrorType, number> = {
  VALIDATION_ERROR: 400,
  MISSING_FIELDS: 400,
  SERVER_ERROR: 500,
  DATABASE_CONNECTION_ERROR: 503,
  DUPLICATE_DATA: 409,
  INVALID_JSON: 400,
  INTERNAL_ERROR: 500,
  UNKNOWN_ERROR: 500,
  USER_NOT_FOUND: 404,
  WRONG_PASSWORD: 401,
  FILE_SIZE_ERROR: 400,
  INVALID_IMAGE_TYPE: 400,
};

/**
 * 에러 응답 객체 생성
 */
export function createErrorResponse(
  errorType: ErrorType,
  message: string,
): ApiErrorResponse {
  return {
    message,
    errorType,
  };
}

/**
 * NextResponse로 에러 응답 생성 및 반환
 */
export function createErrorNextResponse(
  errorType: ErrorType,
  message: string,
  statusCode?: number,
): NextResponse<ApiErrorResponse> {
  const status = statusCode ?? DEFAULT_STATUS_CODES[errorType];
  const response = createErrorResponse(errorType, message);
  return NextResponse.json(response, { status });
}

/**
 * 필수 필드 검증 헬퍼
 * 누락된 필드가 있으면 에러 응답을 반환하고, 없으면 null을 반환
 */
export function validateRequiredFields(
  fields: Record<string, unknown>,
): NextResponse<ApiErrorResponse> | null {
  const missingFields: string[] = [];

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === "") {
      missingFields.push(key);
    }
  }

  if (missingFields.length > 0) {
    return createErrorNextResponse(
      ErrorType.VALIDATION_ERROR,
      `필수 필드가 누락되었습니다: ${missingFields.join(", ")}`,
    );
  }

  return null;
}

/**
 * 편의 함수들 - 자주 사용하는 에러 타입별 헬퍼
 */
export const ApiError = {
  validation: (message: string, statusCode?: number) =>
    createErrorNextResponse(ErrorType.VALIDATION_ERROR, message, statusCode),

  missingFields: (fields: string[]) =>
    createErrorNextResponse(
      ErrorType.VALIDATION_ERROR,
      `필수 필드가 누락되었습니다: ${fields.join(", ")}`,
    ),

  server: (message: string = "서버 내부 오류가 발생했습니다.") =>
    createErrorNextResponse(ErrorType.SERVER_ERROR, message),

  database: (message: string = "데이터베이스 연결에 실패했습니다.") =>
    createErrorNextResponse(ErrorType.DATABASE_CONNECTION_ERROR, message),

  duplicate: (message: string = "중복된 데이터가 존재합니다.") =>
    createErrorNextResponse(ErrorType.DUPLICATE_DATA, message),

  invalidJson: (message: string = "잘못된 요청 형식입니다.") =>
    createErrorNextResponse(ErrorType.INVALID_JSON, message),

  internal: (message?: string) =>
    createErrorNextResponse(
      ErrorType.INTERNAL_ERROR,
      message || "서버 내부 오류가 발생했습니다.",
    ),

  unknown: (message: string = "알 수 없는 오류가 발생했습니다.") =>
    createErrorNextResponse(ErrorType.UNKNOWN_ERROR, message),

  userNotFound: (message: string = "일치하는 사용자가 없습니다.") =>
    createErrorNextResponse(ErrorType.USER_NOT_FOUND, message),

  wrongPassword: (message: string = "비밀번호가 일치하지 않습니다.") =>
    createErrorNextResponse(ErrorType.WRONG_PASSWORD, message),

  fileSize: (message: string = "파일 크기가 제한을 초과했습니다.") =>
    createErrorNextResponse(ErrorType.FILE_SIZE_ERROR, message),

  invalidImageType: (
    message: string = "지원하지 않는 이미지 형식입니다. JPG, PNG, GIF, WebP, BMP만 업로드 가능합니다.",
  ) => createErrorNextResponse(ErrorType.INVALID_IMAGE_TYPE, message),
};
