import { NextResponse } from "next/server";

import { allowedImgTypesForMessage } from "@/constants/constants";
import {
  ApiErrorResponse,
  DBError,
  ErrorType,
  DEFAULT_ERROR_STATUS_CODES,
} from "@/types/error";

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
  const status = statusCode ?? DEFAULT_ERROR_STATUS_CODES[errorType];
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
  validation: (message: string = "잘못된 요청입니다.", statusCode?: number) =>
    createErrorNextResponse(ErrorType.VALIDATION_ERROR, message, statusCode),

  foreignKeyViolation: (
    message: string = "참조 무결성 제약 조건을 위반했습니다.",
  ) => createErrorNextResponse(ErrorType.VALIDATION_ERROR, message, 400),

  notNullViolation: (
    message: string = "데이터베이스 제약 조건 위반: 필수 필드가 누락되었습니다.",
  ) => createErrorNextResponse(ErrorType.VALIDATION_ERROR, message, 400),

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

  invalidImageType: (message?: string) => {
    // 메시지가 제공되지 않으면 allowedImgTypesForMessage 배열에서 동적으로 생성
    if (!message) {
      message = `지원하지 않는 이미지 형식입니다. ${allowedImgTypesForMessage.join(", ")}만 업로드 가능합니다.`;
    }
    return createErrorNextResponse(ErrorType.INVALID_IMAGE_TYPE, message);
  },
};

/**
 * catch 블록에서 발생한 에러를 자동으로 분류하여 적절한 ApiError 응답 반환
 *
 * @param error - catch 블록에서 받은 error (unknown 타입)
 * @param contextMessage - 로그에 출력할 한글 메시지 (예: "이미지 업로드 실패")
 * @returns 적절한 ApiError 응답
 */
export function handleApiError(
  error: unknown,
  contextMessage: string,
): NextResponse<ApiErrorResponse> {
  console.error(contextMessage);

  // 1. DB 에러 (가장 구체적인 것부터 체크)
  if (error && typeof error === "object" && "code" in error) {
    const dbError = error as DBError;

    // DB 연결 실패
    if (dbError.code === "ECONNREFUSED" || dbError.code === "ENOTFOUND") {
      return ApiError.database();
    }

    // PostgreSQL 제약 조건 위반
    if (dbError.code === "23505") {
      // Unique constraint violation
      return ApiError.duplicate();
    }

    if (dbError.code === "23503") {
      // Foreign key constraint violation
      return ApiError.foreignKeyViolation();
    }

    if (dbError.code === "23502") {
      // Not null constraint violation
      return ApiError.notNullViolation();
    }
  }

  // 2. JSON 파싱 오류
  if (error instanceof SyntaxError) {
    return ApiError.invalidJson();
  }

  // 3. 일반 Error 인스턴스
  if (error instanceof Error) {
    // duplicate key 에러 메시지 체크 (추가 안전장치)
    if (error.message.includes("duplicate key")) {
      return ApiError.duplicate();
    }

    return ApiError.server();
  }

  // 4. 알 수 없는 에러: 서버 에러로 표시
  return ApiError.server();
}
