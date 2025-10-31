import { NextResponse } from "next/server";

/**
 * 성공 응답 헬퍼 함수들
 */

/**
 * 데이터 조회 성공 응답 (GET)
 * 단순히 데이터를 그대로 반환
 */
export function createSuccessResponse<T>(data: T): NextResponse<T> {
  return NextResponse.json(data, { status: 200 });
}

/**
 * 생성 성공 응답 (POST)
 * 201 Created 상태 코드와 함께 데이터 반환
 */
export function createCreatedResponse<T>(
  data: T,
  message?: string,
): NextResponse<T | { message: string; data: T }> {
  if (message) {
    return NextResponse.json({ message, data }, { status: 201 });
  }
  return NextResponse.json(data, { status: 201 });
}

/**
 * 수정 성공 응답 (PUT/PATCH)
 * 수정된 데이터 또는 성공 메시지 반환
 */
export function createUpdatedResponse<T>(
  data?: T,
  message?: string,
): NextResponse<T | { message: string; data?: T }> {
  if (message && data) {
    return NextResponse.json({ message, data }, { status: 200 });
  }
  if (message) {
    return NextResponse.json({ message }, { status: 200 });
  }
  if (data) {
    return NextResponse.json(data, { status: 200 });
  }
  return NextResponse.json({ message: "수정되었습니다." }, { status: 200 });
}

/**
 * 삭제 성공 응답 (DELETE)
 */
export function createDeletedResponse(
  message: string = "삭제되었습니다.",
): NextResponse<{ message: string }> {
  return NextResponse.json({ message }, { status: 200 });
}

/**
 * 편의 함수들 - 자주 사용하는 성공 응답 패턴
 */
export const ApiSuccess = {
  /**
   * 데이터 조회 성공 (GET)
   */
  ok: <T>(data: T) => createSuccessResponse(data),

  /**
   * 생성 성공 (POST 201)
   */
  created: <T>(data: T, message?: string) =>
    createCreatedResponse(data, message),

  /**
   * 수정 성공 (PUT/PATCH 200)
   */
  updated: <T>(data?: T, message?: string) =>
    createUpdatedResponse(data, message),

  /**
   * 삭제 성공 (DELETE 200)
   */
  deleted: (message?: string) => createDeletedResponse(message),

  /**
   * 단순 성공 메시지 (200)
   */
  success: (message: string = "처리되었습니다.") =>
    NextResponse.json({ message }, { status: 200 }),
};
