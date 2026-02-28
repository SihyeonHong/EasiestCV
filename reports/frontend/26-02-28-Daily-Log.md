# 2026-02-28 Daily Log

## 1. Contact 에러 메시지 번역 키 변경

- 작업 내용: 문의 메일 발송 실패 시 노출되는 에러 메시지 번역 키를 `sendFail`에서 `serverError`로 변경
- 작업 목적: 단순 재시도를 유도하는 기존 메시지 대신, 서버 측 에러임을 사용자에게 명확히 안내하기 위함
- 수정 파일: `src/hooks/useContact.ts` (`tError("sendFail")` -> `tError("serverError")`)
