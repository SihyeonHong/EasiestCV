# API 명세서

## 기본 정보

- **Base URL**: `/api`
- **인증 방식**: JWT 쿠키 (httpOnly, secure, sameSite: strict)
- **Content-Type**:
  - JSON 요청: `application/json`
  - 파일 업로드: `multipart/form-data`
- **응답 형식**:
  - 성공: 데이터를 직접 반환 (래핑 없음)
  - 에러: `{ message: string, errorType: string }`

> **참고**: 응답 처리 가이드 및 구현 패턴은 [`api-response-guide.md`](./api-response-guide.md)를 참조하세요.

---

## 인증 및 사용자 관리

### POST /api/users/login

사용자 로그인

**요청 본문:**

```json
{
  "userid": "string",
  "password": "string"
}
```

**성공 응답 (201 Created):**

```json
{
  "userid": "string",
  "username": "string",
  "email": "string"
}
```

- JWT 토큰이 쿠키에 설정됨

**에러 응답:**

- `400`: 필수 필드 누락 (`userid`, `password`)
- `404`: 사용자 없음
- `401`: 비밀번호 불일치
- `500`: 서버 오류

---

### POST /api/users/signup

회원가입

**요청 본문:**

```json
{
  "userid": "string",
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**성공 응답 (204 No Content):**

- 본문 없음

**에러 응답:**

- `400`: 필수 필드 누락 (`userid`, `username`, `email`, `password`)
- `409`: 중복된 데이터 (userid 또는 email)
- `500`: 서버 오류

---

### GET /api/users/me

현재 로그인한 사용자 정보 조회

**인증**: JWT 쿠키 필요

**성공 응답 (200 OK):**

```json
{
  "userid": "string",
  "username": "string",
  "email": "string"
}
```

**에러 응답:**

- `401`: 인증 토큰 없음 또는 유효하지 않음
- `404`: 사용자 없음
- `500`: 서버 오류

---

### POST /api/users/logout

로그아웃

**인증**: JWT 쿠키 필요

**성공 응답 (204 No Content):**

- 본문 없음
- JWT 토큰 쿠키 삭제됨

**에러 응답:**

- `500`: 서버 오류

---

### PATCH /api/users/changePW

비밀번호 변경

**인증**: JWT 쿠키 필요

**요청 본문:**

```json
{
  "userid": "string",
  "currentPassword": "string",
  "newPassword": "string"
}
```

**성공 응답 (204 No Content):**

- 본문 없음

**에러 응답:**

- `400`: 필수 필드 누락 (`userid`, `currentPassword`, `newPassword`)
- `404`: 사용자 없음
- `401`: 현재 비밀번호 불일치
- `500`: 서버 오류

---

### PUT /api/users/resetPW

비밀번호 재설정 (임시 비밀번호 이메일 전송)

**요청 본문:**

```json
{
  "userid": "string",
  "email": "string",
  "locale": "en" | "ko"
}
```

**성공 응답 (204 No Content):**

- 본문 없음
- 임시 비밀번호가 이메일로 전송됨

**에러 응답:**

- `400`: 필수 필드 누락 (`userid`, `email`)
- `404`: 사용자 없음 또는 이메일 불일치
- `500`: 서버 오류 (이메일 전송 실패 포함)

---

### GET /api/users/user

사용자 정보 조회

**쿼리 파라미터:**

- `userid` (required): 사용자 ID

**성공 응답 (200 OK):**

```json
{
  "userid": "string",
  "username": "string",
  "email": "string",
  "password": "string" // 해시된 비밀번호
}
```

**에러 응답:**

- `400`: `userid` 파라미터 누락
- `404`: 사용자 없음
- `500`: 서버 오류

---

### PUT /api/users/user

사용자 정보 수정

**인증**: JWT 쿠키 필요

**요청 본문:**

```json
{
  "userid": "string",
  "username": "string",
  "email": "string"
}
```

**성공 응답 (204 No Content):**

- 본문 없음

**에러 응답:**

- `400`: 필수 필드 누락 또는 이메일 형식 오류
- `500`: 서버 오류

---

## 문서 관리

### GET /api/documents

문서 목록 조회 또는 다운로드

**쿼리 파라미터:**

- `userid` (required): 사용자 ID
- `download` (optional): `"true"`일 경우 파일 다운로드

**성공 응답 (200 OK):**

1. **기본 조회** (`download` 파라미터 없음):

```json
["url1", "url2", "url3"]
```

2. **다운로드** (`download=true`):

- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="..."`
- 응답 본문: PDF 파일 바이너리

**에러 응답:**

- `400`: `userid` 파라미터 누락 또는 파일명을 찾을 수 없음
- `404`: 문서가 존재하지 않음
- `500`: 서버 오류 (파일 다운로드 실패 포함)

---

### POST /api/documents

PDF 문서 업로드

**인증**: JWT 쿠키 필요

**요청 형식**: `multipart/form-data`

- `document` (File, required): PDF 파일
- `userid` (string, required): 사용자 ID

**성공 응답 (201 Created):**

```json
{
  "pdfUrl": "string"
}
```

**에러 응답:**

- `400`: 필수 필드 누락 또는 PDF가 아닌 파일 형식
- `500`: 서버 오류

---

### DELETE /api/documents

문서 삭제

**인증**: JWT 쿠키 필요

**쿼리 파라미터:**

- `userid` (required): 사용자 ID

**성공 응답 (204 No Content):**

- 본문 없음

**에러 응답:**

- `400`: `userid` 파라미터 누락
- `404`: 문서가 존재하지 않음
- `500`: 서버 오류

---

## 탭 관리

### GET /api/tabs

탭 목록 조회

**쿼리 파라미터:**

- `userid` (required): 사용자 ID

**성공 응답 (200 OK):**

```json
[
  {
    "tid": 1,
    "userid": "string",
    "tname": "string",
    "torder": 0,
    "slug": "string",
    "contents": "string"
  }
]
```

- `torder` 기준으로 정렬됨

**에러 응답:**

- `400`: `userid` 파라미터 누락
- `500`: 서버 오류

---

### PUT /api/tabs

탭 일괄 업데이트 (생성/수정/삭제)

**인증**: JWT 쿠키 필요

**요청 본문:**

```json
[
  {
    "tid": 1, // 기존 탭: 기존 tid, 새 탭: 임시 값 (무시됨)
    "userid": "string",
    "tname": "string",
    "torder": 0,
    "slug": "string"
  }
]
```

**성공 응답 (204 No Content):**

- 본문 없음
- 새로 추가된 탭은 자동으로 `tid`가 생성되고 `slug`가 업데이트됨
- 요청에 없는 기존 탭은 삭제됨

**에러 응답:**

- `400`: 요청 형식 오류
- `500`: 서버 오류

---

## 콘텐츠 관리

### GET /api/contents

탭 콘텐츠 조회

**쿼리 파라미터:**

- `userid` (required): 사용자 ID
- `tid` (required): 탭 ID

**성공 응답 (200 OK):**

```json
"string"

// HTML 콘텐츠
```

**에러 응답:**

- `400`: `userid` 또는 `tid` 파라미터 누락
- `500`: 서버 오류

---

### PUT /api/contents

탭 콘텐츠 업데이트

**인증**: JWT 쿠키 필요

**요청 본문:**

```json
{
  "userid": "string",
  "tid": 1,
  "contents": "string" // HTML 콘텐츠
}
```

**성공 응답 (204 No Content):**

- 본문 없음

**에러 응답:**

- `400`: 필수 필드 누락
- `500`: 서버 오류

---

## 홈 관리

### GET /api/home

홈 데이터 조회

**쿼리 파라미터:**

- `userid` (required): 사용자 ID

**성공 응답 (200 OK):**

```json
{
  "userid": "string",
  "intro_html": "string",
  "img_url": "string"
}
```

**에러 응답:**

- `400`: `userid` 파라미터 누락
- `500`: 서버 오류

---

### PATCH /api/home/intro

홈 소개글 업데이트

**인증**: JWT 쿠키 필요

**요청 본문:**

```json
{
  "userid": "string",
  "intro": "string" // HTML 콘텐츠
}
```

**성공 응답 (204 No Content):**

- 본문 없음

**에러 응답:**

- `400`: 필수 필드 누락
- `500`: 서버 오류

---

### POST /api/home/img

홈 이미지 업로드

**인증**: JWT 쿠키 필요

**요청 형식**: `multipart/form-data`

- `imgFile` (File, required): 이미지 파일
- `userid` (string, required): 사용자 ID

**성공 응답 (201 Created):**

```json
"string"

// 이미지 URL
```

**에러 응답:**

- `400`: 필수 필드 누락 또는 지원하지 않는 이미지 형식
- `500`: 서버 오류

---

### PUT /api/home/img

홈 이미지 URL 업데이트

**인증**: JWT 쿠키 필요

**요청 본문:**

```json
{
  "userid": "string",
  "imgUrl": "string",
  "oldFileName": "string" // 선택적, 기존 파일 삭제용
}
```

**성공 응답 (204 No Content):**

- 본문 없음

**에러 응답:**

- `400`: 필수 필드 누락
- `500`: 서버 오류

---

## 메타데이터 관리

### GET /api/meta

사이트 메타데이터 조회

**쿼리 파라미터:**

- `userid` (required): 사용자 ID

**성공 응답 (200 OK):**

```json
{
  "userid": "string",
  "title": "string",
  "description": "string"
}
```

또는 `null` (메타데이터가 없는 경우)

**에러 응답:**

- `400`: `userid` 파라미터 누락
- `500`: 서버 오류

---

### PUT /api/meta

사이트 메타데이터 저장/업데이트

**인증**: JWT 쿠키 필요

**요청 본문:**

```json
{
  "userid": "string",
  "title": "string",
  "description": "string"
}
```

**성공 응답 (204 No Content):**

- 본문 없음
- UPSERT 동작 (존재하면 업데이트, 없으면 생성)

**에러 응답:**

- `400`: 필수 필드 누락
- `500`: 서버 오류

---

## 파일 관리

### DELETE /api/files

탭 첨부 파일 삭제

**인증**: JWT 쿠키 필요

**요청 본문:**

```json
{
  "userid": "string",
  "tid": 1,
  "newList": ["file1.jpg", "file2.jpg"] // 삭제 후 남을 파일 목록
}
```

**성공 응답:**

1. **모든 파일 삭제 성공 (204 No Content):**

- 본문 없음

2. **부분 실패 (200 OK):**

```json
{
  "message": "Failed to delete N files.",
  "deletedCount": 3,
  "failedCount": 2,
  "failedFiles": ["file1.jpg", "file2.jpg"]
}
```

**에러 응답:**

- `400`: 필수 필드 누락
- `500`: 서버 오류

---

## 이미지 업로드

### POST /api/tabs/img

탭 콘텐츠용 이미지 업로드

**인증**: JWT 쿠키 필요

**요청 형식**: `multipart/form-data`

- `file` (File, required): 이미지 파일 (최대 20MB)
- `userid` (string, required): 사용자 ID

**성공 응답 (200 OK):**

```json
{
  "imageUrl": "string"
}
```

**에러 응답:**

- `400`: 필수 필드 누락, 파일 크기 초과 (20MB), 또는 지원하지 않는 이미지 형식
- `500`: 서버 오류

---

## 연락

### POST /api/contact

문의 메일 전송

**요청 본문:**

```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "content": "string"
}
```

**성공 응답 (204 No Content):**

- 본문 없음
- 관리자 이메일로 문의 메일 전송됨

**에러 응답:**

- `400`: 필수 필드 누락
- `500`: 서버 오류 (이메일 전송 실패 포함)

---

## 공통 에러 응답 형식

모든 에러 응답은 다음 형식을 따릅니다:

```json
{
  "message": "string",
  "errorType": "string"
}
```

### 에러 타입 목록

| errorType                   | HTTP 상태 코드 | 설명                       |
| --------------------------- | -------------- | -------------------------- |
| `VALIDATION_ERROR`          | 400            | 잘못된 요청 또는 검증 실패 |
| `MISSING_FIELDS`            | 400            | 필수 필드 누락             |
| `USER_NOT_FOUND`            | 404            | 사용자를 찾을 수 없음      |
| `WRONG_PASSWORD`            | 401            | 비밀번호 불일치            |
| `DUPLICATE_DATA`            | 409            | 중복된 데이터              |
| `FILE_SIZE_ERROR`           | 400            | 파일 크기 제한 초과        |
| `INVALID_IMAGE_TYPE`        | 400            | 지원하지 않는 이미지 형식  |
| `INVALID_JSON`              | 400            | 잘못된 JSON 형식           |
| `DATABASE_CONNECTION_ERROR` | 503            | 데이터베이스 연결 실패     |
| `SERVER_ERROR`              | 500            | 서버 내부 오류             |

### 에러 메시지

- 에러 메시지는 한글로 제공됩니다
- 클라이언트는 i18n을 사용하여 적절한 언어로 표시할 수 있습니다

---

## 참고 사항

1. **인증이 필요한 엔드포인트**: JWT 쿠키가 없으면 `401` 에러가 반환됩니다
2. **파일 업로드**: 이미지 파일은 최대 20MB, PDF 파일도 제한이 있을 수 있습니다
3. **이미지 형식**: 지원되는 형식은 프로젝트 설정에 따라 다를 수 있습니다 (일반적으로 jpg, png, gif, webp 등)
4. **응답 형식**: 성공 응답은 데이터를 직접 반환하며, `{ data: T }` 형식의 래핑을 사용하지 않습니다
5. **204 No Content**: 데이터가 없을 때는 본문 없이 상태 코드만 반환됩니다
