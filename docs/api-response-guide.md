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
return ApiSuccess.created(data); // 데이터가 있으면 201, 없으면 204

// PUT/PATCH: 수정
return ApiSuccess.updated(data); // 데이터가 있으면 200, 없으면 204

// DELETE: 삭제
return ApiSuccess.deleted(); // 데이터가 있으면 200, 없으면 204
```

**HTTP 메서드별 함수:**

- `GET`: `ApiSuccess.data(data)` - 200 OK, 데이터 반환
- `POST`: `ApiSuccess.created(data?)` - 데이터가 있으면 201 Created, 없으면 204 No Content
- `PUT/PATCH`: `ApiSuccess.updated(data?)` - 데이터가 있으면 200 OK, 없으면 204 No Content
- `ApiSuccess.deleted(data?)` - 데이터가 있으면 200 OK, 없으면 204 No Content

### 응답 형식 원칙

**모든 성공 응답은 데이터를 직접 반환합니다.** 일관성을 위해 `{ data: T }` 형식의 래핑을 사용하지 않습니다.

```typescript
// ✅ 올바른 사용
return ApiSuccess.data({ userid: "user123" });  // GET: { userid: "user123" }
return ApiSuccess.created({ pdfUrl: "..." });   // POST: { pdfUrl: "..." }
return ApiSuccess.updated({ imageUrl: "..." }); // PUT: { imageUrl: "..." }
return ApiSuccess.deleted();                     // DELETE: 204 (본문 없음)

// ❌ 잘못된 사용
return ApiSuccess.data({ data: { userid: "user123" } });  // 이중 래핑
return ApiSuccess.created({ message: "성공", data: {...} }); // message 사용
```

### 204 No Content 사용

**데이터가 없을 때는 204 No Content를 반환합니다:**

- `POST`: 생성 후 반환할 데이터가 없을 때
- `PUT/PATCH`: 수정 후 반환할 데이터가 없을 때
- `DELETE`: 삭제 후 반환할 데이터가 없을 때

```typescript
return ApiSuccess.created();
return ApiSuccess.updated();
return ApiSuccess.deleted();
```

### 성공 메시지는 클라이언트 담당.

**성공 응답에 불필요한 `message` 필드를 포함하지 않습니다.** 클라이언트에서 i18n을 사용하여 적절한 성공 메시지를 표시합니다.

```typescript
// ❌ 잘못된 사용
return ApiSuccess.created(data, "회원가입이 완료되었습니다.");
return ApiSuccess.updated(undefined, "수정되었습니다.");

// ✅ 올바른 사용
return ApiSuccess.created(data); // 클라이언트가 i18n으로 메시지 표시
return ApiSuccess.updated(); // 204 반환
```

### 특수 케이스: 부분 성공 정보

일부 작업(예: 일괄 삭제)에서 **부분 성공 정보**가 필요한 경우, 데이터를 반환합니다. 이는 `ApiError`가 아니라 `ApiSuccess`입니다:

- 전체 요청은 성공했지만 일부 항목만 실패한 경우
- 클라이언트가 부분 실패 정보를 받아 적절히 처리해야 하는 경우

```typescript
// /api/files DELETE 예시: 일부 파일 삭제 실패
return ApiSuccess.updated({
  message: "일부 파일 삭제에 실패했습니다.",
  deletedCount: 3,
  failedCount: 2,
  failedFiles: ["file1.jpg", "file2.jpg"],
});

// 또는 DELETE 메서드이므로 deleted() 사용도 가능
return ApiSuccess.deleted({
  message: "일부 파일 삭제에 실패했습니다.",
  deletedCount: 3,
  failedCount: 2,
  failedFiles: ["file1.jpg", "file2.jpg"],
});
```

**부분 성공의 판단 기준:**

- DB 업데이트 등 핵심 작업이 성공한 경우 → `ApiSuccess` (200 OK + 데이터)
- 전체 작업이 실패한 경우 → `ApiError` (4xx/5xx)

**특수 케이스에서의 message:**

부분 성공 정보를 반환하는 경우, 클라이언트가 상황을 이해하기 쉽도록 `message` 필드를 포함할 수 있습니다. 이는 일반적인 성공 응답과 달리, 사용자에게 특별한 주의가 필요한 상황이기 때문입니다.

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
return ApiError.missingEnvVar(envVar);
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

## ApiError 직접 사용 vs throw 사용 가이드

### ApiError를 직접 사용하는 경우 (비즈니스 로직 검증)

**비즈니스 로직 검증 실패**는 `ApiError`를 직접 반환합니다. 이는 예상 가능한 에러로, 클라이언트가 처리할 수 있는 에러입니다:

```typescript
// ✅ 필수 필드 검증
if (!userid || !password) {
  return ApiError.missingFields(["userid", "password"]);
}

// ✅ 사용자 인증 실패
if (result.length === 0) {
  return ApiError.userNotFound();
}

if (!isMatch) {
  return ApiError.wrongPassword();
}

// ✅ 데이터 검증
if (!emailRegex.test(email)) {
  return ApiError.validation("올바른 이메일 형식이 아닙니다.");
}

// ✅ 파일 검증
if (file.size > maxSize) {
  return ApiError.fileSize("파일 크기는 20MB를 초과할 수 없습니다.");
}

if (!allowedImgTypes.includes(file.type)) {
  return ApiError.invalidImageType();
}

// ✅ 데이터 존재 여부 확인
if (result.length === 0) {
  return ApiError.validation("문서가 존재하지 않습니다.", 404);
}
```

**특징:**

- 클라이언트의 잘못된 요청이나 비즈니스 규칙 위반
- 예상 가능한 에러
- HTTP 상태 코드가 명확함 (400, 401, 404, 409 등)

### throw를 사용하는 경우 (예상치 못한 에러)

**예상치 못한 에러**나 **시스템 레벨 에러**는 `throw`를 사용하여 `handleApiError`에 맡깁니다:

```typescript
// ✅ 외부 라이브러리 에러
try {
  const decoded = jwt.verify(token, secret);
} catch (error) {
  // jwt.verify가 throw한 에러는 handleApiError가 처리
  throw error;
}
```

**특징:**

- 외부 라이브러리에서 발생한 예상치 못한 에러
- DB 연결 실패, 네트워크 오류 등 인프라 문제
- `handleApiError`가 자동으로 적절한 에러 타입으로 분류

### 환경변수 누락 처리

**환경변수 누락**은 `ApiError.missingEnvVar()`를 사용합니다:

```typescript
// ✅ 환경변수 누락 (서버 설정 오류)
const secret = process.env.JWT_SECRET;
if (!secret) {
  return ApiError.missingEnvVar("JWT_SECRET");
}
```

**특징:**

- 환경변수 이름을 인자로 받아 자동으로 메시지 생성: `${envVar} 환경변수를 찾을 수 없습니다.`
- 서버 설정 문제이므로 500 에러 반환

### 구분 기준

| 상황                 | 방법                                                   | 이유                 |
| -------------------- | ------------------------------------------------------ | -------------------- |
| 필수 필드 누락       | `ApiError.missingFields()`                             | 클라이언트 입력 검증 |
| 사용자 인증 실패     | `ApiError.userNotFound()` / `ApiError.wrongPassword()` | 비즈니스 로직 검증   |
| 데이터 형식 오류     | `ApiError.validation()`                                | 클라이언트 입력 검증 |
| 파일 크기/형식 오류  | `ApiError.fileSize()` / `ApiError.invalidImageType()`  | 클라이언트 입력 검증 |
| 데이터 존재 여부     | `ApiError.validation()` with 404                       | 비즈니스 로직 검증   |
| 환경변수 누락        | `ApiError.missingEnvVar(envVar)`                       | 서버 설정 오류       |
| DB 연결 실패         | `throw` → `handleApiError`                             | 인프라 문제          |
| 외부 라이브러리 에러 | `throw` → `handleApiError`                             | 예상치 못한 에러     |

### handleApiError가 처리하는 에러의 출처

`handleApiError`는 `catch` 블록에서 받은 에러를 처리합니다. 에러는 다음 두 가지 방식으로 발생합니다:

#### 1. 자동 throw (대부분의 경우)

비동기 작업이 실패하면 자동으로 throw됩니다. 명시적으로 `throw`를 작성할 필요가 없습니다:

```typescript
export async function GET(request: Request) {
  try {
    // ✅ DB 쿼리 실패 시 자동으로 throw됨 (명시적 throw 불필요)
    const result = await query("SELECT * FROM users WHERE userid = $1", [
      userId,
    ]);

    // ✅ 파일 다운로드 실패 시 자동으로 throw됨
    const fileBuffer = await downloadFile(gcsFileName);

    // ✅ 이메일 전송 실패 시 자동으로 throw됨
    await transporter.sendMail(mailOptions);

    // ✅ JSON 파싱 실패 시 자동으로 throw됨 (SyntaxError)
    const { userid, password } = await request.json();

    return ApiSuccess.data(result);
  } catch (error: unknown) {
    // 위의 모든 에러가 자동으로 catch되어 handleApiError로 전달됨
    return handleApiError(error, "사용자 정보 조회 실패");
  }
}
```

자동으로 throw되는 경우:

- DB 쿼리 실패 (`await query(...)`)
- 파일 업로드/다운로드 실패 (`await uploadFile(...)`, `await downloadFile(...)`)
- 네트워크 요청 실패 (`await fetch(...)`)
- JSON 파싱 실패 (`await request.json()`)
- 외부 라이브러리 함수 호출 실패 (`await bcrypt.hash(...)`, `jwt.verify(...)` 등)

#### 2. 명시적 throw

- 외부 라이브러리의 catch 블록에서 에러를 재throw하는 경우
- 커스텀 비즈니스 로직에서 예상치 못한 상황 발생 시

```typescript
export async function POST(request: NextRequest) {
    // ✅ 외부 라이브러리의 catch에서 재throw
    try {
      const decoded = jwt.verify(token, secret);
    } catch (error) {
      throw error; // handleApiError가 처리하도록 재throw
    }

    return ApiSuccess.data({ userid: decoded.userid });
  } catch (error: unknown) {
    return handleApiError(error, "로그인 처리 실패");
  }
}
```

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

## 클라이언트 에러 처리

클라이언트(React hooks, components)에서 API 에러를 처리할 때는 **사용자가 대처 가능한 에러**와 **사용자가 대처 불가능한 에러**를 구분하여 처리합니다.

**사용자가 대처 가능한 에러**: 상세한 안내 메시지를 표시합니다.
**사용자가 대처 불가능한 에러**: `generalError`로 통일하여 표시합니다.

### i18n 사용

모든 에러 메시지는 i18n 번역 키를 사용합니다. `src/utils/client-error-handler.ts`의 `ERROR_TO_MESSAGE` 매핑을 참고하세요.

## 참고 파일

- `src/utils/api-error.ts`: 에러 응답 유틸리티
- `src/utils/api-success.ts`: 성공 응답 유틸리티
- `src/utils/client-error-handler.ts`: 클라이언트 에러 처리 유틸리티
