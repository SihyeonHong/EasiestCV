import { isAxiosError } from "axios";

/**
 * 서버 사이드 에러 로깅
 *
 * SSR 환경에서 발생하는 에러를 로깅합니다.
 * 사용자에게 메시지를 표시할 수 없으므로 로깅만 수행합니다.
 *
 * @param error - 발생한 에러
 * @param context - 로그에 표시할 컨텍스트 (함수명 등)
 * @param additionalInfo - 추가 로그 정보 (userid 등)
 */
export function logServerError(
  error: unknown,
  context: string,
  additionalInfo?: Record<string, unknown>,
): void {
  const info = additionalInfo ? ` ${JSON.stringify(additionalInfo)}` : "";

  if (isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.message;

    if (status === 404) {
      // 404는 정상적인 경우일 수 있음 (리소스 없음)
      // 개발 환경에서만 경고 로그
      if (process.env.NODE_ENV === "development") {
        console.warn(`[${context}] 리소스를 찾을 수 없음${info}`);
      }
    } else {
      console.error(
        `[${context}] API 요청 실패${info}:`,
        status ? `HTTP ${status}` : "네트워크 에러",
        message,
      );
    }
  } else if (error instanceof Error) {
    console.error(`[${context}] 에러 발생${info}:`, error.message);
  } else {
    console.error(`[${context}] 알 수 없는 에러 발생${info}:`, error);
  }
}

/**
 * SSR에서 데이터 페칭을 안전하게 수행하는 헬퍼
 *
 * 서버 사이드 렌더링에서 데이터를 가져올 때 에러가 발생해도
 * 페이지 렌더링을 막지 않기 위해 fallback 값을 반환합니다.
 *
 * @param fetchFn - 실행할 데이터 페칭 함수
 * @param fallback - 실패 시 반환할 기본값
 * @param context - 로그에 표시할 컨텍스트 (함수명 등)
 * @param additionalInfo - 추가 로그 정보 (userid 등)
 * @param throwOnError - true일 경우 에러를 throw하여 상위에서 처리 (기본값: false)
 * @returns 페칭 성공 시 데이터, 실패 시 throwOnError가 false면 fallback 값, true면 에러 throw
 */
export async function serverFetch<T>(
  fetchFn: () => Promise<T>,
  fallback: T,
  context: string,
  additionalInfo?: Record<string, unknown>,
  throwOnError?: boolean,
): Promise<T> {
  try {
    return await fetchFn();
  } catch (error: unknown) {
    logServerError(error, context, additionalInfo);
    if (throwOnError) {
      throw error;
    }
    return fallback;
  }
}
