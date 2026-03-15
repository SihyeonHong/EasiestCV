# 26-03-15 Daily Log

## 오늘의 할 일

- [x] 회원가입 시 환영 이메일 보내기 (API 개발 및 연동 준비)

## 작업 내역

### 회원가입 환영 이메일 발송 기능 구현

`src/app/api/users/signup/route.ts`를 수정하여, 회원가입 완료 시 사용자에게 환영 이메일을 발송하도록 기능을 추가하였습니다.

1. 프론트엔드에서 `SignupRequest`에 추가된 `locale` 필드를 서버에서 추출하도록 구조분해 수정
2. `resetPW/route.ts`의 이메일 발송 패턴(`transporter`, `SENDER_EMAIL`)을 참고하여 동일한 방식으로 구현
3. `src/utils/welcomeTemplate.ts`를 활용하여 locale 기반(ko/en) 환영 이메일 HTML 생성
4. 기존 회원가입 로직(DB INSERT, 기본 정보 생성, 탭 생성) 완료 후 마지막 단계에 이메일 발송 로직 배치
