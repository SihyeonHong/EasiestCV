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

mailer 리팩터링 과정에서 에러 처리 패턴이 프로젝트 컨벤션(`api-response-guide.md`)과 일치하지 않는 부분이 발견되었습니다.

### 2.2. mailer.ts의 환경변수 가드

현재:

```typescript
if (!email_host || !email_port || !email_user || !email_pass) {
  throw new Error("Email Environment Variables not set");
}
```

권장: "현행 유지"

- `api-response-guide.md`는 환경변수 누락 시 `ApiError.missingEnvVar(envVar)`를 권장하지만, 이 함수는 `NextResponse`를 반환하므로 라우트 핸들러 안에서만 사용 가능합니다.
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
