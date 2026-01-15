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
  DATABASE_CONNECTION_ERROR: "DATABASE_CONNECTION_ERROR",
  DUPLICATE_DATA: "DUPLICATE_DATA",
  FILE_SIZE_ERROR: "FILE_SIZE_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  INVALID_IMAGE_TYPE: "INVALID_IMAGE_TYPE",
  INVALID_JSON: "INVALID_JSON",
  MISSING_ENV_VAR: "MISSING_ENV_VAR",
  MISSING_FIELDS: "MISSING_FIELDS",
  SERVER_ERROR: "SERVER_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  WRONG_PASSWORD: "WRONG_PASSWORD",
} as const;

export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];

/**
 * 에러 타입별 기본 HTTP 상태 코드 매핑
 */
export const DEFAULT_ERROR_STATUS_CODES: Record<ErrorType, number> = {
  FILE_SIZE_ERROR: 400,
  INVALID_IMAGE_TYPE: 400,
  INVALID_JSON: 400,
  MISSING_FIELDS: 400,
  VALIDATION_ERROR: 400,
  WRONG_PASSWORD: 401,
  USER_NOT_FOUND: 404,
  DUPLICATE_DATA: 409,
  INTERNAL_ERROR: 500,
  MISSING_ENV_VAR: 500,
  SERVER_ERROR: 500,
  UNKNOWN_ERROR: 500,
  DATABASE_CONNECTION_ERROR: 503,
};
