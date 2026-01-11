export interface ApiErrorResponse {
  message: string;
  errorType?: string;
}

export interface DBError extends Error {
  code?: string;
  detail?: string;
  constraint?: string;
  table?: string;
  column?: string;
}

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
  MISSING_ENV_VAR: "MISSING_ENV_VAR",
} as const;

export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];

/**
 * 에러 타입별 기본 HTTP 상태 코드 매핑
 */
export const DEFAULT_ERROR_STATUS_CODES: Record<ErrorType, number> = {
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
  MISSING_ENV_VAR: 500,
};

/**
 * 에러 타입별 i18n 키 매핑
 * 사용자 대처 가능한 에러(1번)에 대한 상세 메시지 키
 */
export const ERROR_TYPE_TO_I18N_KEY: Record<ErrorType, string> = {
  MISSING_FIELDS: "missingFields",
  VALIDATION_ERROR: "missingFields",
  USER_NOT_FOUND: "userNotFound",
  WRONG_PASSWORD: "passwordMismatch",
  FILE_SIZE_ERROR: "fileSizeError",
  INVALID_IMAGE_TYPE: "invalidImageType",
  DUPLICATE_DATA: "duplicateId",
  INVALID_JSON: "unknownError",
  // 사용자 대처 불가능한 에러(2번)는 핸들러에서 직접 처리
  SERVER_ERROR: "serverError",
  DATABASE_CONNECTION_ERROR: "serverError",
  INTERNAL_ERROR: "serverError",
  UNKNOWN_ERROR: "unknownError",
  MISSING_ENV_VAR: "serverError",
};

/**
 * 사용자가 대처할 수 있는 에러인지 확인
 */
export function isUserActionableError(
  errorType: ErrorType | undefined,
): boolean {
  if (!errorType) return false;

  const actionableTypes: ErrorType[] = [
    ErrorType.MISSING_FIELDS,
    ErrorType.VALIDATION_ERROR,
    ErrorType.USER_NOT_FOUND,
    ErrorType.WRONG_PASSWORD,
    ErrorType.FILE_SIZE_ERROR,
    ErrorType.INVALID_IMAGE_TYPE,
    ErrorType.DUPLICATE_DATA,
    ErrorType.INVALID_JSON,
  ];

  return actionableTypes.includes(errorType);
}
