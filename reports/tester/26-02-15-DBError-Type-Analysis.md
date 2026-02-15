# DBError 타입 분석 보고서

## 1. 분석 배경

`signup.test.ts`에서 `DBError` 타입을 사용하여 에러를 모킹할 때, `code` 필드에 `"23505"` (숫자 형태의 문자열)과 `"ECONNREFUSED"` (알파벳 문자열)이 함께 들어가는 것이 타입 설계상 올바른지에 대한 의문이 제기되었습니다.

## 2. DBError 타입 정의 (`src/types/error.ts`)

```typescript
export interface DBError extends Error {
  code?: string;
  detail?: string;
  constraint?: string;
  table?: string;
  column?: string;
}
```

`code` 필드는 `string | undefined` 타입으로 선언되어 있습니다.

## 3. 실제 사용처 분석 (`src/utils/api-error.ts`)

`handleApiError` 함수에서 `code` 필드를 기준으로 에러를 분류합니다:

```typescript
if (error && typeof error === "object" && "code" in error) {
  const dbError = error as DBError;

  // Node.js 시스템 에러 코드
  if (dbError.code === "ECONNREFUSED" || dbError.code === "ENOTFOUND") { ... }

  // PostgreSQL SQLSTATE 코드
  if (dbError.code === "23505") { ... }
  if (dbError.code === "23503") { ... }
  if (dbError.code === "23502") { ... }
}
```

`code` 필드에 들어오는 값은 두 가지 출처에서 발생합니다:

1. PostgreSQL SQLSTATE 코드: `"23505"` (Unique 제약 위반), `"23503"` (FK 제약 위반), `"23502"` (Not Null 제약 위반)
   - `pg` 라이브러리의 `DatabaseError` 클래스에서 `code: string`으로 정의됨
   - 숫자처럼 보이지만 PostgreSQL 표준에서 "5자리 문자열"로 규정된 값임
2. Node.js 시스템 에러 코드: `"ECONNREFUSED"`, `"ENOTFOUND"`
   - Node.js 내장 `SystemError`에서 `code: string`으로 정의됨
   - DB 연결 시도 과정에서 네트워크 수준 에러가 발생한 경우

## 4. 결론

`code?: string` 타입은 두 출처 모두에 대해 정확한 타입입니다. PostgreSQL SQLSTATE 코드와 Node.js 시스템 에러 코드 모두 원래 라이브러리에서 `string`으로 정의되어 있으므로, 현재 타입 설계에 오류는 없습니다.

다만, "DBError"라는 인터페이스 이름이 네트워크 수준의 연결 에러(`ECONNREFUSED`)까지 포괄하고 있어 이름만으로는 의미가 다소 모호할 수 있습니다. 그러나 `handleApiError` 함수가 DB 작업 중 발생할 수 있는 모든 에러를 한곳에서 처리하는 구조이므로, 현재 설계는 실용적으로 적절합니다.

## 5. 테스트 코드에서의 사용 검증

`signup.test.ts`에서 아래와 같이 사용하는 패턴은 `handleApiError` 함수의 실제 동작을 정확히 모사합니다:

```typescript
const dbError = new Error("...") as DBError;
dbError.code = "23505";
```

- `new Error()`로 생성한 객체는 `Error`를 확장한 `DBError`로 안전하게 타입 단언 가능
- `code` 필드 할당 후 `mockQuery.mockRejectedValueOnce()`로 전달하면, `handleApiError` 내부의 `"code" in error` 조건을 충족
- 이후 `dbError.code === "23505"` 등의 분기를 정확히 타게 됨

수정이 필요한 사항은 없습니다.
