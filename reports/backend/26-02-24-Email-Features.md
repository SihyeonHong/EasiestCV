# 회원가입 관련 이메일 기능 검토 보고서

## 1. 현재 프로젝트 인프라 분석

본 프로젝트에는 이메일 발송을 위한 기반이 이미 구축되어 있습니다.

- 의존성: `nodemailer@^7.0.6` 설치 완료
- SMTP 환경변수 설정 완료: `email_host`, `email_port`, `email_user`, `email_pass`
- 기존 이메일 발송 구현체 2건 존재:
  1. `src/app/api/users/resetPW/route.ts` - 임시 비밀번호 발급 메일
  2. `src/app/api/contact/route.ts` - 문의 메일 발송
- HTML 이메일 템플릿 시스템 구현 완료: `src/utils/tempPWTemplate.ts`
- 다국어(ko/en) 이메일 지원 패턴 확립

현재 회원가입 흐름(`src/app/api/users/signup/route.ts`)은 userid, username, email, password를 받아 즉시 DB에 INSERT하며, 이메일 관련 검증이나 발송 로직은 포함되어 있지 않습니다.

---

## 2. 기능별 상세 분석

### 2.1. 기능 A: 회원가입 완료 이메일 발송

회원가입 성공 후 "가입이 완료되었습니다" 안내 이메일을 발송하는 기능입니다.

#### 2.1.1. 구현 방법

1. 이메일 템플릿 파일 생성
   - `src/utils/welcomeEmailTemplate.ts`를 신규 생성합니다.
   - 기존 `tempPWTemplate.ts`와 동일한 패턴(HTML 반환 함수 + 다국어 translations 객체)을 따릅니다.
   - 본문에는 가입 환영 메시지, 서비스 안내, 로그인 버튼(CTA)을 포함합니다.

2. 공통 이메일 유틸리티 추출
   - 현재 `resetPW/route.ts`와 `contact/route.ts`에 `nodemailer.createTransport()` 설정이 중복되어 있습니다.
   - `src/utils/mailer.ts`를 신규 생성하여 transporter 인스턴스를 공통으로 관리합니다.
   - 기존 두 파일도 이 공통 모듈을 import하도록 리팩터링합니다.

```typescript
// src/utils/mailer.ts (신규)
import nodemailer from "nodemailer";

const { email_host, email_port, email_user, email_pass } = process.env;

if (!email_host || !email_port || !email_user || !email_pass) {
  throw new Error("Email Environment Variables not set");
}

export const transporter = nodemailer.createTransport({
  host: email_host,
  port: email_port,
  secure: true,
  auth: { user: email_user, pass: email_pass },
} as nodemailer.TransportOptions);

export const SENDER_EMAIL = email_user;
```

3. Signup API 수정
   - `src/app/api/users/signup/route.ts`의 `ApiSuccess.created()` 반환 직전에 이메일 발송 로직을 추가합니다.
   - 이메일 발송 실패 시에도 회원가입 자체는 성공 처리합니다(fire-and-forget 패턴). 이메일은 부가 기능이므로 가입 성공 여부에 영향을 주지 않아야 합니다.

```typescript
// signup/route.ts 수정 부분 (기존 ApiSuccess.created() 반환 직전)
try {
  const mailOptions = {
    from: SENDER_EMAIL,
    to: email,
    subject: t.subject,
    html: welcomeEmailTemplate({ username, locale }),
  };
  await transporter.sendMail(mailOptions);
} catch {
  console.error("환영 이메일 발송 실패 - 회원가입은 정상 처리됨");
}

return ApiSuccess.created();
```

#### 2.1.2. 수정 대상 파일

| 파일                                 | 작업 내용                                 |
| ------------------------------------ | ----------------------------------------- |
| `src/utils/mailer.ts`                | [신규] 공통 transporter 모듈              |
| `src/utils/welcomeEmailTemplate.ts`  | [신규] 환영 이메일 HTML 템플릿            |
| `src/app/api/users/signup/route.ts`  | [수정] 이메일 발송 로직 추가              |
| `src/app/api/users/resetPW/route.ts` | [수정] 공통 mailer 모듈 사용으로 리팩터링 |
| `src/app/api/contact/route.ts`       | [수정] 공통 mailer 모듈 사용으로 리팩터링 |

#### 2.1.3. 난이도 및 소요 기간

- 난이도: "낮음"
- 예상 소요: 1~2시간
- 기존 패턴(tempPWTemplate.ts)을 그대로 복제하여 내용만 수정하면 되므로 새로 설계할 부분이 거의 없습니다.
- 추가 라이브러리 설치가 불필요합니다.

#### 2.1.4. 리스크 및 고려사항

- SMTP 서버의 발송 속도에 따라 회원가입 API 응답이 약간 지연될 수 있습니다. 현재 구조에서는 `await`를 사용하므로 이메일 발송 완료까지 대기합니다. 다만 fire-and-forget 패턴을 적용하면 응답 지연 없이 처리 가능합니다.
- 대량 가입 시 이메일 발송 한도(rate limit)에 주의해야 합니다.

---

### 2.2. 기능 B: 회원가입 이메일 인증

회원가입 과정 중 입력한 이메일 주소로 인증 코드(또는 인증 링크)를 발송하고, 사용자가 이를 확인해야 가입이 완료되는 기능입니다.

#### 2.2.1. 구현 방법

이 기능은 구현 방식에 따라 두 가지 접근법이 있습니다.

##### 방식 1: 인증 코드(6자리) 입력 방식

- 사용자가 회원가입 폼을 작성하고 "인증 코드 발송" 버튼을 클릭합니다.
- 서버가 6자리 랜덤 코드를 생성하여 이메일로 발송합니다.
- 사용자가 수신한 코드를 회원가입 폼의 인증 코드 입력란에 입력합니다.
- 서버가 코드를 검증한 후 회원가입을 완료합니다.

##### 방식 2: 인증 링크 클릭 방식

- 사용자가 회원가입 폼을 제출합니다.
- 서버가 사용자 정보를 임시 상태("미인증")로 DB에 저장하고, 이메일로 고유 인증 링크를 발송합니다.
- 사용자가 이메일의 링크를 클릭하면, 서버가 해당 계정을 "인증 완료" 상태로 전환합니다.

##### 권장 방식: 방식 1 (인증 코드)

현재 프로젝트 구조상 인증 코드 방식이 더 적합합니다. 이유는 다음과 같습니다.

- "인증 링크 방식"은 `users` 테이블에 `is_verified` 컬럼 추가 및 미인증 사용자 처리 로직(로그인 차단, 만료된 미인증 계정 정리 스케줄러 등)이 필요하여 변경 범위가 큽니다.
- "인증 코드 방식"은 임시 저장소(메모리 Map 또는 별도 테이블)만 추가하면 되므로 기존 `users` 테이블 스키마를 변경하지 않습니다.
- 사용자 경험 측면에서도 동일 페이지에서 코드 입력으로 바로 완료할 수 있어 더 간편합니다.

#### 2.2.2. 구현 상세 (인증 코드 방식)

1. 인증 코드 발송 API 신규 생성
   - `src/app/api/users/verify-email/route.ts` [신규]
   - POST: email을 받아 6자리 난수를 생성하고 이메일로 발송합니다.
   - 생성된 코드는 서버 메모리(Map 객체)에 `email -> { code, expiresAt }` 형태로 저장합니다. 유효 기간은 5분으로 설정합니다.

```typescript
// src/app/api/users/verify-email/route.ts (신규)
const verificationCodes = new Map<
  string,
  { code: string; expiresAt: number }
>();

export async function POST(request: NextRequest) {
  const { email, locale } = await request.json();

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5분

  verificationCodes.set(email, { code, expiresAt });

  // 이메일 발송
  await transporter.sendMail({
    from: SENDER_EMAIL,
    to: email,
    subject: t.subject,
    html: verificationCodeTemplate({ code, locale }),
  });

  return ApiSuccess.created();
}
```

2. 인증 코드 검증 API
   - 같은 파일에 PUT 메서드로 구현합니다.
   - email과 code를 받아 Map에서 조회 및 검증합니다.

```typescript
export async function PUT(request: NextRequest) {
  const { email, code } = await request.json();

  const stored = verificationCodes.get(email);
  if (!stored || stored.code !== code || Date.now() > stored.expiresAt) {
    return ApiError.validation("인증 코드가 올바르지 않거나 만료되었습니다.");
  }

  verificationCodes.delete(email);
  return ApiSuccess.updated();
}
```

3. 인증 코드 이메일 템플릿
   - `src/utils/verificationCodeTemplate.ts` [신규]
   - 기존 tempPWTemplate.ts 패턴을 따르되, 인증 코드를 표시합니다.

4. 프론트엔드 수정
   - `src/app/components/SignUpCard.tsx` [수정]
   - 이메일 입력란 옆에 "인증 코드 발송" 버튼을 추가합니다.
   - 코드 발송 후 인증 코드 입력란이 나타나게 합니다.
   - 인증 완료 전까지 회원가입 버튼을 비활성화합니다.
   - `src/hooks/useEmailVerification.ts` [신규] - 인증 코드 발송 및 검증 mutation 관리

5. Signup API 수정
   - 회원가입 시 이메일 인증 완료 여부를 확인하는 로직을 추가합니다.
   - 프론트엔드에서 인증 완료 상태를 함께 전송하거나, 서버 측에서 인증 완료 목록을 별도 관리하여 검증합니다.

#### 2.2.3. 수정 대상 파일

| 파일                                      | 작업 내용                               |
| ----------------------------------------- | --------------------------------------- |
| `src/app/api/users/verify-email/route.ts` | [신규] 인증 코드 발송 및 검증 API       |
| `src/utils/verificationCodeTemplate.ts`   | [신규] 인증 코드 이메일 템플릿          |
| `src/utils/mailer.ts`                     | [신규] 공통 transporter (기능 A와 공유) |
| `src/hooks/useEmailVerification.ts`       | [신규] 인증 관련 React Query hooks      |
| `src/app/components/SignUpCard.tsx`       | [수정] 인증 UI 추가                     |
| `src/app/api/users/signup/route.ts`       | [수정] 인증 완료 검증 로직 추가         |
| i18n 메시지 파일 (ko.json, en.json)       | [수정] 인증 관련 번역 키 추가           |

#### 2.2.4. 난이도 및 소요 기간

- 난이도: "중간"
- 예상 소요: 4~6시간
- 백엔드 API 2개(발송, 검증), 이메일 템플릿 1개, 프론트엔드 UI 변경, 커스텀 훅 1개를 새로 작성해야 합니다.
- 프론트엔드 UX 흐름(버튼 상태 관리, 타이머 표시, 재발송 제한 등)이 핵심 작업입니다.

#### 2.2.5. 리스크 및 고려사항

- 서버 메모리 기반 코드 저장 방식은 서버 재시작 시 모든 코드가 소멸합니다. 현재 프로젝트 규모에서는 큰 문제가 아니지만, 향후 확장 시에는 DB 테이블(`email_verifications`) 또는 Redis 도입을 고려해야 합니다.
- 동일 이메일에 대한 연속 발송 요청을 제한하는 쿨다운(예: 60초) 로직이 필요합니다. 없을 경우 악용 가능성이 있습니다.
- 인증 코드는 brute-force를 방지하기 위해 검증 시도 횟수 제한(예: 5회)을 두는 것이 권장됩니다.

---

### 2.3. 기능 C: 기존 이메일 중복 확인 및 비밀번호 찾기 안내

회원가입 시 입력한 이메일이 이미 다른 계정에 등록되어 있는 경우, 이를 감지하고 비밀번호 찾기를 안내하는 기능입니다.

#### 2.3.1. 현재 상태

현재 signup API(`src/app/api/users/signup/route.ts`)에서는 이메일 중복 검사를 수행하지 않습니다. userid는 DB의 PRIMARY KEY로 인해 중복 시 409 에러가 발생하지만, 동일 이메일로 여러 계정이 가입되는 것은 차단되지 않습니다. 또한 `users` 테이블에 email 컬럼의 UNIQUE 제약 조건이 설정되어 있는지 확인이 필요합니다.

#### 2.3.2. 구현 방법

1. 이메일 중복 확인 API
   - 방법 1: 기존 signup API 내부에서 INSERT 전에 이메일 중복 확인 쿼리를 추가합니다.
   - 방법 2: 별도 endpoint `src/app/api/users/check-email/route.ts`를 생성하여 프론트엔드가 실시간으로 조회합니다.
   - 권장: "방법 1"을 기본으로 하되, 사용자 경험 향상을 위해 "방법 2"도 함께 구현하는 것이 좋습니다.

2. Signup API 수정 (방법 1, 필수)

```typescript
// src/app/api/users/signup/route.ts - 이메일 중복 확인 로직 추가
const existingEmail = await query<User>(
  "SELECT userid FROM users WHERE email = $1",
  [email],
);

if (existingEmail.length > 0) {
  return NextResponse.json(
    {
      message: "이미 등록된 이메일입니다.",
      code: "EMAIL_ALREADY_EXISTS",
      suggestion: "resetPassword",
    },
    { status: 409 },
  );
}
```

3. 이메일 실시간 확인 API (방법 2, 선택)

```typescript
// src/app/api/users/check-email/route.ts (신규)
export async function GET(request: NextRequest) {
  const email = new URL(request.url).searchParams.get("email");

  const result = await query("SELECT userid FROM users WHERE email = $1", [
    email,
  ]);

  return ApiSuccess.data({ exists: result.length > 0 });
}
```

4. 프론트엔드 수정
   - `src/app/components/SignUpCard.tsx`에서 에러 응답 코드가 `EMAIL_ALREADY_EXISTS`인 경우, "이미 가입된 이메일입니다. 비밀번호를 잊으셨나요?"와 함께 비밀번호 찾기 페이지로의 링크를 안내합니다.
   - `src/hooks/useSignUp.ts`의 `onError` 핸들러에 409 + `EMAIL_ALREADY_EXISTS` 케이스를 추가합니다.

5. DB 고려사항
   - `users` 테이블의 `email` 컬럼에 UNIQUE 제약 조건이 없다면, 아래 SQL로 추가하는 것을 권장합니다:

```sql
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
```

- 이 제약 조건은 애플리케이션 레벨의 검증과 별개로 데이터 무결성을 보장합니다.

#### 2.3.3. 수정 대상 파일

| 파일                                     | 작업 내용                                    |
| ---------------------------------------- | -------------------------------------------- |
| `src/app/api/users/signup/route.ts`      | [수정] 이메일 중복 확인 로직 추가            |
| `src/app/api/users/check-email/route.ts` | [신규, 선택] 실시간 이메일 확인 API          |
| `src/hooks/useSignUp.ts`                 | [수정] 에러 핸들링에 이메일 중복 케이스 추가 |
| `src/app/components/SignUpCard.tsx`      | [수정] 중복 이메일 안내 UI 추가              |
| i18n 메시지 파일 (ko.json, en.json)      | [수정] 관련 번역 키 추가                     |
| DB 마이그레이션                          | [선택] email UNIQUE 제약 조건 추가           |

#### 2.3.4. 난이도 및 소요 기간

- 난이도: "낮음~중간"
- 예상 소요: 2~3시간
- 핵심 로직(이메일 중복 확인 쿼리)은 단순합니다.
- 프론트엔드에서 "비밀번호 찾기 안내" UI를 어떻게 보여줄지(모달, 인라인 메시지, 리다이렉트 등) 결정이 필요합니다.
- DB에 UNIQUE 제약 조건을 추가할 경우, 기존 데이터에 중복 이메일이 없는지 사전 확인이 필요합니다.

#### 2.3.5. 리스크 및 고려사항

- 보안 관점: 이메일 존재 여부를 외부에 노출하는 것은 사용자 열거(User Enumeration) 공격에 취약할 수 있습니다. `check-email` API를 공개할 경우 rate limit을 반드시 적용해야 합니다.
- 기존 데이터: 현재 DB에 동일 이메일로 가입된 복수 계정이 존재한다면, UNIQUE 제약 조건 추가 전에 데이터 정리가 선행되어야 합니다.

---

## 3. 종합 비교 및 우선순위 제안

| 항목          | 기능 A (환영 메일)      | 기능 B (이메일 인증)       | 기능 C (중복 확인)    |
| ------------- | ----------------------- | -------------------------- | --------------------- |
| 난이도        | 낮음                    | 중간                       | 낮음~중간             |
| 예상 소요     | 1~2시간                 | 4~6시간                    | 2~3시간               |
| 신규 파일     | 2개                     | 4개                        | 0~1개                 |
| DB 변경       | 없음                    | 없음                       | 선택 (UNIQUE 제약)    |
| 보안 영향     | 없음                    | 양호 (이메일 소유 검증)    | 주의 필요 (열거 공격) |
| 사용자 경험   | 개선 (신뢰감)           | 약간 번거로움 (추가 단계)  | 개선 (명확한 안내)    |
| 비즈니스 가치 | 낮음 (있으면 좋은 수준) | 중간~높음 (스팸 계정 방지) | 중간 (혼란 방지)      |

### 3.1. 우선순위 제안

1. 기능 C (이메일 중복 확인) - 즉시 구현 권장
   - signup API에 이메일 중복 확인 쿼리를 추가하는 것은 코드 몇 줄의 변경으로 즉시 적용 가능합니다.
   - 동일 이메일 다중 가입 방지는 데이터 무결성 차원에서 기본적으로 필요한 기능입니다.
   - 비밀번호 찾기 안내까지 포함하면 사용자 경험도 개선됩니다.

2. 기능 A (환영 메일) - 기능 C와 함께 구현 가능
   - 기능 C 작업 시 `mailer.ts` 공통 모듈을 만드는 과정에서 함께 구현하면 효율적입니다.
   - 단독으로는 비즈니스 가치가 크지 않지만, 서비스의 완성도를 높이는 역할을 합니다.

3. 기능 B (이메일 인증) - 나중으로 미루기 권장
   - 구현 범위가 가장 넓고 프론트엔드 UX 변경이 수반됩니다.
   - 현재 서비스 규모에서 스팸 가입이 실질적 문제가 되고 있지 않다면 당장은 불필요합니다.
   - 추후 스팸 계정이 증가하거나 이메일 기반 기능(알림, 뉴스레터 등)이 추가될 때 도입을 검토하는 것이 효율적입니다.

---

## 4. 공통 사전 작업: mailer 유틸리티 리팩터링

세 기능 모두 이메일 발송을 필요로 하므로, 어떤 기능을 구현하든 "공통 mailer 유틸리티 추출"을 가장 먼저 수행해야 합니다. 이 작업만 단독으로 진행하더라도 기존 코드의 중복을 제거하는 의미가 있습니다.

- 현재 중복: `resetPW/route.ts`와 `contact/route.ts`에 동일한 `nodemailer.createTransport()` 설정이 각각 존재합니다.
- 목표: `src/utils/mailer.ts`로 통합하여 하나의 transporter 인스턴스를 공유합니다.
- 소요: 약 30분
