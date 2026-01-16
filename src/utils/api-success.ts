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
   * 생성 성공 (POST)
   * 데이터가 있으면 201 Created, 없으면 204 No Content
   */
  created: <T>(data?: T) => {
    if (data !== undefined) {
      return NextResponse.json(data, { status: 201 });
    }
    return new NextResponse(null, { status: 204 });
  },

  /**
   * 수정 성공 (PUT/PATCH)
   * 데이터가 있으면 200 OK, 없으면 204 No Content
   */
  updated: <T>(data?: T) => {
    if (data !== undefined) {
      return NextResponse.json(data, { status: 200 });
    }
    return new NextResponse(null, { status: 204 });
  },

  /**
   * 삭제 성공 (DELETE)
   * 데이터가 있으면 200 OK, 없으면 204 No Content
   */
  deleted: <T>(data?: T) => {
    if (data !== undefined) {
      return NextResponse.json(data, { status: 200 });
    }
    return new NextResponse(null, { status: 204 });
  },
};
