import { NextResponse } from "next/server";

import { ApiErrorResponse } from "@/types/error";
import { ApiError } from "@/utils/api-error";

/**
 * 필드 값과 필드명의 쌍을 받아서 누락된 필드명 배열을 반환합니다.
 * 값이 null, undefined, 빈 문자열("")이면 누락된 것으로 간주합니다.
 *
 * @param fields 필드명과 값의 쌍 객체. 예: { userid: userId, imgFile: file }
 * @returns 누락된 필드명 배열
 *
 * @example
 * ```typescript
 * const missingFields = getMissingFields({
 *   userid: userId,
 *   imgFile: imgFile
 * });
 * if (missingFields.length > 0) {
 *   return ApiError.missingFields(missingFields);
 * }
 * ```
 */
export function getMissingFields(fields: Record<string, unknown>): string[] {
  const missingFields: string[] = [];

  for (const [key, value] of Object.entries(fields)) {
    if (value === null || value === undefined || value === "") {
      missingFields.push(key);
    }
  }

  return missingFields;
}

/**
 * 필드 값과 필드명의 쌍을 받아서 누락된 필드가 있으면 에러 응답을 반환하고,
 * 없으면 null을 반환합니다.
 *
 * @param fields 필드명과 값의 쌍 객체. 예: { userid: userId, imgFile: file }
 * @returns 누락된 필드가 있으면 NextResponse<ApiErrorResponse>, 없으면 null
 *
 * @example
 * ```typescript
 * const errorResponse = validateMissingFields({
 *   userid: userId,
 *   imgFile: imgFile
 * });
 * if (errorResponse) {
 *   return errorResponse;
 * }
 * ```
 */
export function validateMissingFields(
  fields: Record<string, unknown>,
): NextResponse<ApiErrorResponse> | null {
  const missingFields = getMissingFields(fields);

  if (missingFields.length > 0) {
    return ApiError.missingFields(missingFields);
  }

  return null;
}
