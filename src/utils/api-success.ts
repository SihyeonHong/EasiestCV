import { NextResponse } from "next/server";

/**
 * 성공 응답 헬퍼 함수들
 */
export const ApiSuccess = {
  /**
   * 데이터 조회 성공 (GET)
   * 단순히 데이터를 그대로 반환
   */
  data: <T>(data: T): NextResponse<T> => {
    // data가 null이어도 되는데 undefined는 직렬화 안 됨
    return NextResponse.json(data, { status: 200 });
  },

  /**
   * 생성 성공 (POST 201)
   * 201 Created 상태 코드와 함께 데이터 반환
   */
  created: <T>(
    data: T,
    message?: string,
  ): NextResponse<T | { message: string; data: T }> => {
    if (message) {
      return NextResponse.json({ message, data }, { status: 201 });
    }
    return NextResponse.json(data, { status: 201 });
  },

  /**
   * 수정 성공 (PUT/PATCH 200)
   * 수정된 데이터 또는 성공 메시지 반환
   */
  updated: <T>(
    data?: T,
    message?: string,
  ): NextResponse<T | { message: string; data?: T }> => {
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
  },

  /**
   * 삭제 성공 (DELETE 200)
   */
  deleted: (
    message: string = "삭제되었습니다.",
  ): NextResponse<{ message: string }> => {
    return NextResponse.json({ message }, { status: 200 });
  },

  /**
   * 단순 성공 메시지 (200)
   */
  success: (message: string = "처리되었습니다.") =>
    NextResponse.json({ message }, { status: 200 }),
};
