# API 라우트 응답 처리 가이드

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

### 방법 1: handleApiError 사용 (권장)

에러를 자동으로 분류하여 적절한 응답을 반환하는 `handleApiError` 함수를 사용합니다:

```typescript
import { handleApiError } from "@/utils/api-error";
import { ApiSuccess } from "@/utils/api-success";

export async function POST(req: Request) {
  try {
    // API 로직
    return ApiSuccess.created(data);
  } catch (error: unknown) {
    return handleApiError(error, "이미지 업로드 실패");
  }
}
```

### 방법 2: 수동 에러 처리

특정 에러 타입에 대한 커스텀 처리가 필요한 경우:

```typescript
export async function POST(req: Request) {
  try {
    // API 로직
    return ApiSuccess.created(data);
  } catch {
    console.error("이미지 업로드 실패");
    return ApiError.server();
  }
}
```

**에러 처리 규칙:**

- `catch` 블록에서 `error` 파라미터가 사용되지 않는 경우 파라미터를 생략합니다
- `console.error`에는 정확한 위치 정보를 포함합니다 (어느 API의 무슨 라우트 함수인지 한글로 명시)
  - 예: `"이미지 업로드 실패"`, `"이미지 URL 업데이트 실패"`, `"PDF 업로드 실패"`, `"문서 삭제 실패"`
  - **중요**: `error` 파라미터는 로그에 포함하지 않습니다. 한글 메시지만 출력합니다

## handleApiError 에러 분류 우선순위

`handleApiError` 함수는 다음 순서로 에러를 분류합니다:

1. **DB 에러 (code 속성 체크)**

   - `ECONNREFUSED` / `ENOTFOUND` → `ApiError.database()` (503)
   - `23505` (Unique constraint violation) → `ApiError.duplicate()` (409)
   - `23503` (Foreign key constraint violation) → `ApiError.foreignKeyViolation()` (400)
   - `23502` (Not null constraint violation) → `ApiError.notNullViolation()` (400)

2. **SyntaxError**

   - JSON 파싱 오류 → `ApiError.invalidJson()` (400)

3. **Error 인스턴스**

   - `error.message`에 "duplicate key" 포함 → `ApiError.duplicate()` (409)
   - 그 외 → `ApiError.server()` (500)

4. **알 수 없는 에러**
   - 위에 해당하지 않으면 → `ApiError.server()` (500)

## 참고 파일

- `src/utils/api-error.ts`: 에러 응답 유틸리티
- `src/utils/api-success.ts`: 성공 응답 유틸리티
