# 2026-02-28 Daily Log

## 1. 공통 Mailer 유틸리티 추출

`resetPW/route.ts`와 `contact/route.ts`에 각각 존재하던 `nodemailer.createTransport()` 설정 및 환경변수 검증 중복 코드를 `src/utils/mailer.ts`로 통합했습니다. 이메일 기능 검토 보고서(`26-02-24-Email-Features.md`) 섹션 4의 "공통 사전 작업"에 해당합니다.

| 파일                                 | 작업                                                       |
| ------------------------------------ | ---------------------------------------------------------- |
| `src/utils/mailer.ts`                | [신규] `transporter`, `SENDER_EMAIL` export, 환경변수 가드 |
| `src/app/api/users/resetPW/route.ts` | 중복 코드 제거, 공통 모듈 import, `from: SENDER_EMAIL`     |
| `src/app/api/contact/route.ts`       | 중복 코드 제거, 공통 모듈 import, `to: SENDER_EMAIL`       |

기존 두 파일의 동작은 변경되지 않았습니다. 향후 이메일 기능(환영 메일, 인증 코드 등) 추가 시 `mailer.ts`를 import하여 바로 사용할 수 있습니다.

---

## 2. 이메일 관련 에러 처리 통일성 검토

### 2.1. 검토 배경

mailer 리팩터링 과정에서 에러 처리 패턴이 프로젝트 컨벤션(`api-guide.md`)과 일치하지 않는 부분이 발견되었습니다.

### 2.2. mailer.ts의 환경변수 가드

현재:

```typescript
if (!email_host || !email_port || !email_user || !email_pass) {
  throw new Error("Email Environment Variables not set");
}
```

권장: "현행 유지"

- `api-guide.md`는 환경변수 누락 시 `ApiError.missingEnvVar(envVar)`를 권장하지만, 이 함수는 `NextResponse`를 반환하므로 라우트 핸들러 안에서만 사용 가능합니다.
- `mailer.ts`는 유틸리티 모듈이며 모듈 로드 시점에 검증이 수행됩니다. `NextResponse`를 반환할 수 있는 컨텍스트가 아니므로 `throw`가 유일한 선택입니다.
- 이메일 환경변수가 없으면 이메일 기능 전체가 작동 불가능하므로 fail-fast(즉시 실패)가 적절합니다.

### 2.3. resetPW/route.ts의 이중 try-catch

수정 전:

```typescript
try {
  // 비즈니스 로직...
  try {
    await transporter.sendMail(mailOptions);    // ─┐ 같은 내부 try 안
    await query("UPDATE users SET ...", [...]);  // ─┘
    return ApiSuccess.updated();
  } catch {
    console.error("이메일 전송 실패");           // sendMail이든 query든 여기로 옴
    throw new Error("이메일 전송에 실패했습니다.");
  }
} catch (error: unknown) {
  return handleApiError(error, "비밀번호 재설정 실패");
}
```

이메일 전송이 실패한 경우와, 이메일은 성공했지만 DB 업데이트가 실패한 경우를 구분해 다른 에러를 반환하려는 의도의 코드입니다.
그러나 내부 try-catch의 범위 안에 `sendMail`과 `query`가 모두 포함되어 있습니다. 어느 쪽이 실패하든 동일하게 "이메일 전송 실패"로 처리됩니다. 또한 내부 catch가 원본 에러를 버리고 새 Error를 생성하므로, `handleApiError`가 에러 종류를 자동 분류할 수 없게 됩니다.

수정 후:

```typescript
try {
  // 비즈니스 로직...
  await transporter.sendMail(mailOptions);
  await query("UPDATE users SET ...", [...]);
  return ApiSuccess.updated();
} catch (error: unknown) {
  return handleApiError(error, "비밀번호 재설정 실패");
}
```

내부 try-catch를 제거하면 두 에러 모두 원본 상태로 외부 `handleApiError`에 전달됩니다. `handleApiError`는 원본 에러 객체의 타입과 코드를 보고 자동 분류합니다.

- sendMail 실패: 일반 Error -> `ApiError.server()` (500)
- query 실패 (DB 연결 문제): `error.code === "ECONNREFUSED"` -> `ApiError.database()` (503)
- query 실패 (제약 조건 위반): `error.code === "23505"` -> `ApiError.duplicate()` (409)

"이메일 전송 성공 시에만 DB 업데이트"라는 비즈니스 로직은 내부 try-catch 없이도 보장됩니다. `sendMail`이 실패하면 자동으로 throw되어 다음 줄의 `query`에 도달하지 않기 때문입니다.

### 2.4. 수정 대상 파일

| 파일                                 | 작업                  | 비고      |
| ------------------------------------ | --------------------- | --------- |
| `src/utils/mailer.ts`                | 변경 없음 (현행 유지) | -         |
| `src/app/api/users/resetPW/route.ts` | 내부 try-catch 제거   | 수정 완료 |

---

## 3. 환영 메일 및 중복 확인 기능 구현 계획

회원가입 과정에서 사용자 경험 증대 및 혼선 방지를 위해 이메일 중복 확인 기능과 환영 메일 발송 기능을 구현할 예정입니다. 두 기능은 분리된 커밋으로 순차적으로 작업하며, 독립적인 API로 검증이 가능한 **이메일 중복 확인 기능**을 먼저 구현합니다.

### 3.1. 작업 순서 및 우선순위

1. **이메일 중복 확인 API 구현 (우선 작업)**
   - 기존의 회원가입 로직과 분리된 독립된 기능이므로 먼저 작업하여 검증하기 좋습니다.
   - 단독 API로 프론트엔드 연동 전 백엔드에서 Postman/cURL을 통한 자체 테스트가 용이합니다.

2. **환영 메일 발송 기능 구현 (후속 작업)**
   - 기존의 `signup` API 내부에 메일 발송 로직을 추가하는 방식입니다.
   - 이미 작성된 공통 `mailer.ts`를 활용하여 회원가입 성공 처리 시 발송되도록 연동합니다.

### 3.2. 이메일 중복 확인 기능 (`GET /api/users/check-email`)

`userid`가 기본 키(Primary Key)인 서비스 특성상 동일 이메일의 다중 가입이 허용되지만, 중복 가입을 깜빡한 사용자의 혼동을 방지하기 위해 이미 가입된 `userid` 목록을 알려주는 API입니다.

- **API Specification**
  - **Endpoint**: `GET /api/users/check-email`
  - **Query Parameter**: `email` (예: `?email=test@example.com`)
  - **동작 방식**:
    1. 데이터베이스 `users` 테이블에서 Query 파라미터로 전달된 `email`과 매칭되는 데이터 조회
    2. 중복되는 계정이 있을 경우, 해당 계정들의 `userid` 목록을 응답 데이터로 반환
  - **Response (Success - 중복 있음)**:
    ```json
    {
      "status": "success",
      "data": {
        "exists": true,
        "userids": ["user1", "user2"]
      }
    }
    ```
  - **Response (Success - 중복 없음)**:
    ```json
    {
      "status": "success",
      "data": {
        "exists": false,
        "userids": []
      }
    }
    ```
- **비고**: 이메일 검증(Verification)은 별도로 진행하지 않습니다.

### 3.3. 환영 메일 기능 (`POST /api/users/signup`)

회원가입이 완료된 직후 사용자에게 가입 환영 이메일을 발송합니다.

- **구현 방식**
  - 신규 이메일 템플릿(`src/utils/welcomeEmailTemplate.ts`) 생성 (기존 `tempPWTemplate.ts` 구조 활용)
  - `src/app/api/users/signup/route.ts`의 로직 마지막 부분(`ApiSuccess.created()` 반환 직전)에 `transporter.sendMail()` 호출 로직 추가
  - **Fire-and-forget 패턴 적용**: 이메일 발송은 부가적인 액션이므로, 발송 실패가 회원가입 성공 자체를 블로킹하거나 롤백시키지 않도록 `try-catch`로 감싼 후 `catch` 블록에서는 에러 로깅만 수행하고 가입 성공 응답을 정상 반환합니다.
