import { AxiosError } from "axios";

import {
  ApiErrorResponse,
  ErrorType,
  ERROR_TYPE_TO_I18N_KEY,
  isUserActionableError,
} from "@/types/error";

/**
 * 클라이언트 에러 핸들러
 *
 * 사용자가 해결 가능한 에러와 불가능한 에러를 구분하여 처리합니다.
 *
 * - 사용자가 해결 가능한 에러 (틀린 비밀번호, 파일 형식/용량 제한 등): 상세한 안내 메시지 *
 * - 사용자가 해결할 수 없는 에러 (서버 에러, 타입 에러 등): "오류가 발생했습니다. 다시 시도해 주세요." 정도의 간단한 메시지
 */

export function handleClientError(
  error: AxiosError<ApiErrorResponse>,
  tError: (key: string) => string,
): void {
  // 네트워크 에러 (서버에 연결 불가)
  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      alert(tError("timeout"));
    } else {
      alert(tError("networkError"));
    }
    return;
  }

  // 서버에서 응답은 왔지만 에러인 경우
  const { status, data } = error.response;
  const errorType = data.errorType as ErrorType | undefined;

  // actionable - 상세 메시지 표시
  if (errorType && isUserActionableError(errorType)) {
    const key = ERROR_TYPE_TO_I18N_KEY[errorType];
    alert(tError(key));
    return;
  }

  // unactionable - 간단한 안내
  if (status >= 500) {
    alert(tError("serverError"));
  } else {
    alert(tError("unknownError"));
  }
}
