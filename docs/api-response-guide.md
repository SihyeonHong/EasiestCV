# API 에러 처리 가이드

## 기본 원칙

모든 API 라우트는 `src/utils/api-error.ts`와 `src/utils/api-success.ts`의 유틸리티 함수를 사용하여 일관된 응답 형식을 유지합니다.

## 성공 응답

성공 시 `ApiSuccess` 객체의 편의 함수를 우선 사용합니다:

```typescript
import { ApiSuccess } from "@/utils/api-success";

// GET: 데이터 조회
return ApiSuccess.data(data);

// POST: 생성
return ApiSuccess.created(data);

// PUT/PATCH: 수정
return ApiSuccess.updated(data);

// DELETE: 삭제
return ApiSuccess.deleted();
```

**HTTP 메서드별 함수:**

- `GET`: `ApiSuccess.data(data)` - 200 OK
- `POST`: `ApiSuccess.created(data)` - 201 Created
- `PUT/PATCH`: `ApiSuccess.updated(data?)` - 200 OK
- `DELETE`: `ApiSuccess.deleted()` - 200 OK

## 에러 응답

에러 발생 시 `ApiError` 객체의 편의 함수를 사용합니다. 기본 메시지를 사용하는 것을 권장합니다:

```typescript
import { ApiError } from "@/utils/api-error";

// 서버 에러 (기본 메시지 사용)
return ApiError.server();

// 기타 에러 타입들
return ApiError.validation(message, statusCode?);
return ApiError.missingFields(fields);
return ApiError.database();
return ApiError.duplicate();
return ApiError.userNotFound();
return ApiError.wrongPassword();
return ApiError.invalidImageType();
```

## 기본 구조

```typescript
export async function POST(req: Request) {
  try {
    // API 로직
    return ApiSuccess.created(data);
  } catch (error: unknown) {
    console.error("이미지 업로드 실패:", error);
    return ApiError.server();
  }
}
```

**에러 처리 규칙:**

- `catch` 블록의 파라미터는 무조건 `error: unknown`을 사용합니다 (`e`, `err` 등은 사용하지 않음)
- `console.error`에는 정확한 위치 정보를 포함합니다 (어느 API의 무슨 라우트 함수인지 한글로 명시)
  - 예: `"이미지 업로드 실패:"`, `"이미지 URL 업데이트 실패:"`, `"PDF 업로드 실패:"`, `"문서 삭제 실패:"`

## 참고 파일

- `src/utils/api-error.ts`: 에러 응답 유틸리티
- `src/utils/api-success.ts`: 성공 응답 유틸리티
