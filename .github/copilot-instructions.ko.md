# EasiestCV - AI 코딩 에이전트 가이드

## 프로젝트 개요

EasiestCV는 연구자와 교수를 대상으로 하는 Next.js 기반의 학술 포트폴리오 빌더입니다. 사용자가 간단한 인터페이스에 데이터를 입력하여 개인 CV 웹사이트를 만드는 콘텐츠 중심 도구입니다. 복잡한 웹 개발 기술이 필요하지 않습니다.

## 아키텍처

### 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **UI**: React 18, Radix UI, Tailwind CSS
- **상태 관리**: TanStack React Query, Redux Toolkit
- **리치 텍스트**: Tiptap 3 (마크다운과 유사한 완전한 에디터 + 커스텀 훅)
- **데이터베이스**: PostgreSQL (`pg` 패키지)
- **파일 저장소**: Google Cloud Storage (GCS)
- **다국어**: next-intl (EN/KO 로케일, 항상 URL에 포함)
- **인증**: JWT (쿠키), bcrypt 비밀번호 해싱
- **이메일**: Nodemailer (비밀번호 재설정, 알림)

### 라우팅 구조

```
/(locale)/
  ├── [userid]/                    # 공개 프로필 페이지
  │   ├── [slug]/                  # 동적 탭 콘텐츠
  │   └── admin/                   # 관리자 대시보드 (인증 필수)
  ├── support/                     # 지원 페이지 (info/, notice/)
  ├── tester/                      # 개발/데모 라우트
  └── api/
      ├── users/{login,signup,logout,me,changePW,resetPW}
      ├── tabs/                    # 콘텐츠 탭 CRUD
      ├── contents/                # 탭 콘텐츠 관리
      ├── home/                    # 프로필 소개 & 이미지
      ├── meta/                    # SEO 메타데이터
      ├── files/                   # 문서 파일 처리
      └── contact/                 # 연락 양식 제출
```

**미들웨어** (`src/middleware.ts`): 사용자 브라우저 언어를 자동 감지하여 적절한 로케일로 리디렉션한 후 next-intl 라우팅 적용

### 데이터 흐름 & 쿼리 패턴

**React Query 설정** (`src/provider/TanstackQueryProvider.tsx`, `src/utils/queryClient.ts`):

- 일관된 캐시/재시도 구성을 가진 중앙 집중식 쿼리 클라이언트
- `src/constants/queryKeys.ts`에 정의된 구조화된 네임스페이스 패턴의 쿼리 키:
  ```typescript
  queryKeys.tabs({ userid: "..." });
  queryKeys.auth();
  queryKeys.user({ userid: "..." });
  queryKeys.home({ userid: "..." });
  ```

**HTTP 클라이언트** (`src/utils/http.ts`):

- 자동 기본 URL (`/api`), 자격증명, 30초 타임아웃을 갖춘 Axios 래퍼
- 요청 인터셉터 사용 가능하지만 현재 미사용 (향후 인증 대비)
- 내보내기: `get<T>()`, `post<T>()`, `put<T>()`, `delete<T>()` 타입이 지정된 응답 포함

**API 패턴** (`src/app/api/[resource]/route.ts`):

- Next.js 라우트 핸들러, 프레임워크 래퍼 없음
- 표준 HTTP 메서드가 CRUD 작업에 매핑됨
- 에러 처리: `ApiErrorResponse` 반환 (`src/types/error.ts`)
- 인증: 쿠키에서 JWT 확인 (공유 미들웨어에서 미구현 - 라우트별로 검증)

### 데이터베이스 스키마

```
users → user_home (1:1), user_site_meta (1:1)
users → documents (1:M), tabs (1:M)
tabs → attachments (1:M 파일 배열 저장용)
```

- 모든 외래 키는 사용자 삭제 시 `DELETE CASCADE` 사용
- `src/utils/database.ts`: `query<T>(sql, params)`는 PostgreSQL에서 `T[]` 반환

### 인증 & 권한 부여

1. **로그인/가입**: POST `/api/users/login` 또는 `/api/users/signup` → JWT 쿠키 설정
2. **세션 확인**: `useAuth()` 훅이 `/api/users/me`를 쿼리하여 `{ userid: string }` 획득
3. **보호된 라우트**: `me` 쿼리 결과 확인, null이면 로그인으로 리디렉션
4. **관리자 라우트**: userid가 URL 매개변수 `[userid]`와 일치하는지 검증

## 주요 개발 패턴

### 훅 아키텍처

커스텀 훅이 모든 데이터 페칭과 복잡한 로직을 처리합니다:

- **인증 훅** (`useAuth`, `useLogin`, `useSignUp`, `useResetPW`): 사용자 세션 및 뮤테이션 관리
- **데이터 훅** (`useTabs`, `useDocuments`, `useHome`, `useMetadata`): 쿼리로 래핑된 CRUD 작업
- **Tiptap 훅** (`src/hooks/tiptap/`): 리치 텍스트 에디터 상태 관리용 10개 이상의 특화된 훅 (커서 표시, 요소 위치, 창 크기 변경 등)

**명명 규칙**: 설명적인 이름 사용, 접두사가 있는 유틸리티는 자체 모듈에 위치 (`use-*.ts` 훅용, `*.ts` 유틸리티용).

### 컴포넌트 구성

```
src/components/
  ├── common/          # 재사용 가능한 UI (헤더, 푸터, 모달 등)
  ├── public/          # 공개용 컴포넌트 (프로필 뷰)
  ├── admin/           # 관리자 대시보드 (에디터, 설정)
  ├── support/         # 지원 페이지
  ├── tiptap/          # 에디터 UI & 도구모음
  ├── InitPage, LoginCard, SignUpCard, 등  # 페이지 레벨 컴포넌트
```

**패턴**: 상호작용이 필요한 경우 Radix UI 원시 요소 사용, Tailwind로 레이아웃 스타일링 (예: `<Dialog>`, `<Dropdown>`, `<Tabs>`).

### Tiptap 에디터 통합

- **구성**: `src/utils/tiptap-editor-config.ts`의 `createEditorProps()`가 커스텀 `handleKeyDown` 주입
- **확장**: `src/utils/tiptap-extensions.ts`의 완전한 스위트 (굵게, 이탤릭, 리스트, 코드 블록, 이미지 등)
- **스타일링**: `src/styles/editor/` (tiptap-base.css, tiptap-nodes.css, tiptap-ui.css)
- **훅**: `use-tiptap-editor.ts`가 `useEditor()`를 관리 인스턴스로 래핑
- **유틸리티**: `src/utils/tiptap-utils.ts`로 에디터 특화 변환
- **도구팁**: `src/utils/quillTooltips.ts`의 커스텀 도구팁으로 메뉴 가이드

### 에러 처리 패턴

```typescript
// useAuth 및 유사한 훅에서:
catch (error: AxiosError<ApiErrorResponse>) {
  if (!error.response) {
    // 네트워크 에러
    alert(tError("networkError"));
  } else if (error.response.status === 500) {
    // 서버 에러
    alert(tError("networkError"));
  } else {
    // API에서 온 특정 에러 메시지
    alert(error.response.data.message || tError("unknownError"));
  }
}
```

`useTranslations("error")`를 사용하여 로컬라이즈된 에러 메시지 접근.

### i18n 패턴

- **로컬라이제이션 파일**: `src/i18n/locales/{en,ko}.json`
- **컴포넌트 내**: `const t = useTranslations("section")` 그 다음 `t("key")`
- **라우팅**: 모든 URL이 로케일 접두사 포함 (`/en/`, `/ko/`), 로케일 없이 라우트 생성 금지
- **미들웨어**: `Accept-Language` 헤더에서 자동 언어 감지

## 빌드 & 개발 명령어

```bash
npm run dev       # 개발 서버 시작 (http://localhost:3000)
npm run build     # Next.js 빌드
npm start         # 프로덕션 서버
npm run lint      # ESLint + Next.js 린터
```

**환경 설정**: `POSTGRES_*`, `NEXT_PUBLIC_API_URL`, Google Cloud Storage 자격증명, `JWT_SECRET`, Nodemailer 구성 필요.

## 코드 스타일 & 규칙

- **TypeScript**: 엄격한 모드 활성화, 경로 별칭 `@/*` for `src/*`
- **스타일링**: Tailwind 클래스만 사용 (인라인 CSS 없음), tailwindcss-animate로 전환
- **명명**: 함수/변수는 camelCase, 컴포넌트는 PascalCase
- **파일 구조**: 관련 파일 함께 배치 (예: 훅 + 타입을 같은 디렉토리에)
- **임포트**: 경로 별칭 (`@/`) 사용, 외부 → 내부 순으로 그룹화
- **ESLint 규칙**: 미사용 임포트 없음, tailwindcss 순서, prettier 포매팅

## 일반적인 작업

### 새 API 엔드포인트 추가

1. `src/app/api/[resource]/route.ts` 생성 (HTTP 핸들러)
2. 필요하면 JWT 검증, 성공 시 `{ message: string }` 또는 `{ data: T }` 반환
3. 에러 시 `{ message: string }` 반환 (상태 400/500)
4. `src/constants/queryKeys.ts`에 쿼리 키 추가
5. `src/hooks/use[Resource].ts`에 `useQuery`/`useMutation` 사용하는 훅 생성

### 탭 콘텐츠 저장소 수정

- 탭 콘텐츠는 `tabs.contents`에 텍스트로 저장 (Tiptap에서 온 HTML로 보임)
- 페칭 시: 저장소에서 역직렬화 → Tiptap JSON으로 파싱
- 저장 시: Tiptap JSON 직렬화 → HTML/JSON 문자열로 저장

### UI 컴포넌트 추가

- 상호작용이 필요하면 Radix UI 사용, 레이아웃은 Tailwind
- 적절한 `src/components/` 서브폴더에 배치
- 컴포넌트 파일에서 내보내고 임포트 시 경로 별칭 사용

### 로컬라이제이션

- `src/i18n/locales/en.json`과 `ko.json`에 키/값 추가
- `useTranslations()` 임포트, 올바른 섹션으로 호출: `const t = useTranslations("page")` 그 다음 `t("key")`
- **두 로케일 모두 테스트 필수** - 손상된 키는 키 이름으로 대체됨

## 중요 사항

- **사용자 ID는 대소문자 구분 없음** (비교 시 `toLowerCase()`로 정규화)
- **GCS 이미지 URL** `/api/home` 엔드포인트에서 반환, 이미지 로드 실패 시 CORS 헤더 검증
- **세션 관리**: JWT 토큰이 HTTP 전용 쿠키에 저장, `useAuth()` 쿼리가 마운트 시 자동 새로고침
- **데이터베이스 마이그레이션**: 명시적 마이그레이션 도구 없음, 스키마는 존재한다고 가정 (스키마 변경 시 DevOps에 문의)
- **테스트 환경**: 데모 계정 `tutorial` / `easiestcv` at https://easiest-cv.com/
