# 2026-02-28 Daily Log

## 1. Mailer 리팩터링 테스트 코드 작성

### 1.1. 작업 배경

Backend Developer가 수행한 공통 mailer 유틸리티 추출 리팩터링(`src/utils/mailer.ts` 신규 생성, `resetPW/route.ts` 및 `contact/route.ts` 수정)에 대해 Regression Safety Net을 구축했습니다.

### 1.2. 작성된 테스트 파일

`src/utils/mailer.test.ts` 1개 파일에 모든 검증을 포함합니다.

- 환경변수 가드: 필수 환경변수 누락 시 에러 throw 검증
- transporter 설정: nodemailer를 mock하여 `createTransport`에 전달되는 SMTP 설정(host, port, secure, auth)이 두 라우트가 필요로 하는 값과 일치하는지 `toEqual`로 검증
- SENDER_EMAIL: resetPW의 `from` 필드, contact의 `to` 필드에 들어가는 값이 `email_user` 환경변수와 동일한지 검증

### 1.3. 테스트 전략

- nodemailer의 `createTransport`를 `vi.mock`으로 대체하여 실제 SMTP 연결 없이 설정값만 검증합니다.
- `vi.resetModules()`와 `vi.stubEnv()`를 사용하여 각 테스트 케이스를 격리합니다.
- 기존 `validateUserId.test.ts`의 Given-When-Then 패턴을 따릅니다.

---

## 2. 수동 테스트 체크리스트

API 테스트 인프라가 마련되기 전, 리팩터링이 운영 환경에서 정상 동작하는지 수동으로 확인하기 위한 체크리스트입니다.

### 2.1. 사전 준비

- [x] `npm run dev`로 개발 서버가 정상 기동되는지 확인
- [x] 콘솔에 "Email Environment Variables not set" 에러가 출력되지 않는지 확인

### 2.2. 임시 비밀번호 발급 메일 (resetPW)

- [x] 로그인 페이지에서 "비밀번호 찾기" 기능 진입
- [x] 존재하는 계정의 userid와 email을 입력하고 요청
- [x] 이메일이 정상적으로 수신되는지 확인
- [x] 이메일의 발신자(from)가 기존과 동일한지 확인
- [x] 이메일 본문에 임시 비밀번호가 포함되어 있는지 확인
- [x] 수신한 임시 비밀번호로 로그인이 가능한지 확인

### 2.3. 문의 메일 발송 (contact)

- [x] Contact 페이지에서 이름, 이메일, 제목, 내용을 입력하고 발송
- [x] 관리자 메일함에 문의 메일이 정상적으로 도착하는지 확인
- [x] 수신된 메일의 수신자(to)가 기존 ADMIN_EMAIL과 동일한지 확인
- [x] 수신된 메일의 발신자(from)가 "user@easiest-cv.com"인지 확인
- [x] 수신된 메일의 reply-to가 사용자가 입력한 이메일인지 확인

### 2.4. 에러 케이스 (선택)

- [x] 환경변수 중 하나를 일시적으로 제거한 후 서버 기동 시 에러 메시지가 출력되는지 확인
