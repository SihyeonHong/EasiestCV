# EasiestCV 테스트 인프라 도입 전략 보고서

## 1. 프로젝트 현황 분석

### 1.1 기술 스택

- Runtime: Next.js 14.2.20 (App Router) + React 18 + TypeScript
- 상태 관리: TanStack Query v5 + Redux Toolkit
- API: Next.js Route Handlers (8개 도메인, 총 16개 이상 엔드포인트)
- 데이터베이스: Vercel Postgres (`pg`)
- 스토리지: Google Cloud Storage
- 인증: JWT (`jsonwebtoken`) + bcrypt
- 에디터: Tiptap v3 (97개 컴포넌트 파일)
- 국제화: next-intl (ko, en)
- 스타일링: TailwindCSS + Radix UI + lucide-react
- HTTP 클라이언트: Axios
- 보안: isomorphic-dompurify (HTML Sanitize)

### 1.2 코드베이스 규모

```
src/
├── app/
│   ├── [locale]/        # 페이지 라우트 (auth, policy, support, tester, [userid])
│   ├── api/             # API Route Handlers (8개 도메인)
│   │   ├── contact/     # 문의
│   │   ├── contents/    # 컨텐츠 CRUD
│   │   ├── documents/   # 문서 관리
│   │   ├── files/       # 파일 업로드
│   │   ├── home/        # 홈 설정
│   │   ├── meta/        # 메타데이터
│   │   ├── tabs/        # 탭 관리
│   │   └── users/       # 사용자 (login, signup, logout, me, changePW, resetPW, user)
│   └── components/      # 165개 이상 컴포넌트
│       ├── admin/       # 관리자 컴포넌트 (23개)
│       ├── common/      # 공통 컴포넌트 (22개)
│       ├── public/      # 퍼블릭 페이지 (4개)
│       ├── support/     # 지원 페이지 (8개)
│       └── tiptap/      # 에디터 컴포넌트 (97개)
├── hooks/               # 커스텀 훅 (13개 + tiptap 훅 10개)
├── utils/               # 유틸리티 함수 (23개 모듈)
├── types/               # 타입 정의 (6개)
├── constants/           # 상수 (2개)
├── i18n/                # 국제화 설정
├── provider/            # React Provider (TanStack Query, Theme)
└── middleware.ts        # i18n + 인증 미들웨어
```

### 1.3 현재 테스트 현황

- 테스트 프레임워크: "미설치"
- 테스트 코드: "0개"
- 테스트 관련 npm script: "없음"
- CI/CD 파이프라인: "없음" (`.github/workflows` 디렉토리 부재)

---

## 2. 테스트 도입 전략: 점진적 확장 (Phase 기반)

테스트를 한 번에 전부 작성하는 것은 비효율적입니다. "Test Pyramid" 전략에 따라, 실행 비용이 낮고 신뢰도가 높은 Unit Test를 기반으로 시작한 후 점진적으로 범위를 확장합니다.

```
        /  E2E  \          ← Phase 4 (향후)
       /----------\
      / Integration \      ← Phase 3
     /----------------\
    /   Unit Tests     \   ← Phase 1~2 (현재 단계)
   /--------------------\
```

### Phase 1: 기반 구축 + 순수 유틸리티 함수 테스트

"목표": 테스트 인프라를 설정하고, 외부 의존성이 없는 "순수 함수"부터 테스트를 작성합니다.

#### 1-1. 테스트 프레임워크 설치

- "Vitest"를 테스트 러너로 채택합니다.
  - 선정 사유: Vite 기반으로 속도가 빠르며, Next.js + TypeScript + ESM 환경과 호환성이 좋습니다. Jest와 API가 거의 동일하므로 학습 비용이 낮습니다.
  - `package.json`의 `overrides`에 이미 `jsdom: "24.1.0"`이 있으므로, DOM 테스트 환경도 활용 가능합니다.

#### 1-2. 테스트 대상 (순수 함수 - 외부 의존성 없음)

아래 모듈들은 DB, 네트워크, 파일시스템 등 외부 의존성이 전혀 없는 순수 함수로, 즉시 테스트 작성이 가능합니다:

| 모듈                      | 경로                                 | 테스트 난이도 | 우선순위 |
| ------------------------- | ------------------------------------ | :-----------: | :------: |
| `validateUserId`          | `src/utils/validateUserId.ts`        |     낮음      |    1     |
| `extractFileName`         | `src/utils/extractFileName.ts`       |     낮음      |    1     |
| `generateRandomPW`        | `src/utils/generateRandomPW.ts`      |     낮음      |    1     |
| `getMissingFields`        | `src/utils/validateMissingFields.ts` |     낮음      |    1     |
| `createErrorResponse`     | `src/utils/api-error.ts`             |     낮음      |    2     |
| `validateRequiredFields`  | `src/utils/api-error.ts`             |     낮음      |    2     |
| `normalizeHtmlWhitespace` | `src/utils/sanitize.ts`              |     중간      |    2     |
| `sanitizeHtml`            | `src/utils/sanitize.ts`              |     중간      |    2     |

예상 테스트 케이스 수: 약 "30~40개"

#### 1-3. 디렉토리 구조

테스트 파일은 소스 파일과 동일한 위치에 `.test.ts` 확장자로 배치합니다 ("Co-location" 패턴):

```
src/utils/
├── validateUserId.ts
├── validateUserId.test.ts    ← 같은 디렉토리에 배치
├── extractFileName.ts
├── extractFileName.test.ts
└── ...
```

이 패턴의 장점:

- 테스트할 파일을 찾아 이동할 필요 없이 바로 옆에 위치합니다.
- 파일 이름만 보고 어떤 모듈의 테스트인지 즉시 파악 가능합니다.
- 파일을 이동하거나 삭제할 때 테스트도 함께 관리됩니다.

### Phase 2: API Route Handler 유닛 테스트

"목표": API 라우트 핸들러의 비즈니스 로직을 테스트합니다. DB와 외부 서비스는 Mock 처리합니다.

- 대상: `src/app/api/` 하위 16개 이상의 엔드포인트
- Mock 대상: `database.ts`의 `query` 함수, `gcs.ts`의 GCS 클라이언트, `bcrypt`, `jsonwebtoken`
- 검증 항목: HTTP 상태 코드, 응답 본문 구조, 에러 핸들링 동작
- 예상 테스트 케이스 수: 약 "60~80개"

### Phase 3: 통합 테스트 (Integration Test)

"목표": 여러 레이어가 실제로 연동되어 올바르게 작동하는지 검증합니다.

- 대상: Custom Hooks (`useAuth`, `useLogin`, `useSignUp` 등)
- 도구: `@testing-library/react` + MSW (Mock Service Worker)
- 검증 항목: Hook 상태 전환, 에러 처리 흐름, 캐시 무효화

### Phase 4: E2E 테스트 (향후)

"목표": 실제 브라우저에서 사용자 시나리오를 시뮬레이션합니다.

- 도구: Playwright 또는 Cypress
- 대상: 로그인 → 에디터 사용 → Public 페이지 확인 등 핵심 사용자 흐름
- Phase 1~3의 테스트 커버리지가 충분히 확보된 이후 도입을 권장합니다.

---

## 3. Git 브랜치 전략 권고

### 권고안: "dev 브랜치에서 test 브랜치 분기"

```
main
 └── dev
      └── test/setup          ← Phase 1: 프레임워크 설치 + 첫 번째 테스트
      └── test/api-handlers   ← Phase 2: API 핸들러 테스트 (Phase 1 완료 후)
      └── test/integration    ← Phase 3: 통합 테스트 (Phase 2 완료 후)
```

#### 선정 사유

1. "dev 브랜치에서 분기"를 권고하는 이유:
   - 테스트 코드는 프로덕션 코드의 최신 상태를 기반으로 작성해야 합니다. `dev` 브랜치는 현재 개발 중인 최신 코드를 포함하고 있으므로, 테스트가 최신 코드와 동기화됩니다.
   - `main`에서 분기할 경우, `dev`에서 진행 중인 리팩토링이나 신규 기능과 테스트가 충돌할 위험이 있습니다.
   - 테스트 코드도 "기능 개발의 일부"이므로, `dev` 하위 브랜치에서 관리하는 것이 기존 워크플로우와 일관성을 유지합니다.

2. "main 브랜치에서 분기"를 권고하지 않는 이유:
   - 현재 `main`과 `dev`가 동일한 커밋(`f1d28ef`)에 있지만, 향후 `dev`가 앞서 나가면 `main` 기준의 테스트 코드는 `dev`에 병합될 때 대량의 충돌이 발생할 수 있습니다.
   - 테스트 도입은 프로덕션 배포가 아니라 "개발 프로세스 개선"이므로 `dev` 흐름에 속합니다.

3. Phase별 브랜치 분리:
   - 각 Phase가 완료되면 `dev`로 병합하고, 다음 Phase를 새 브랜치에서 시작합니다.
   - Phase 1이 `dev`에 병합된 후에는, 이후 일반 feature 브랜치에서도 해당 기능에 대한 테스트를 함께 작성하는 습관을 들이는 것이 이상적입니다.

---

## 4. Phase 1 세부 실행 계획

Phase 1의 구체적인 실행 단계를 아래에 정리합니다.

### Step 1: 테스트 프레임워크 설치

```bash
npm install -D vitest @vitest/coverage-v8
```

### Step 2: Vitest 설정 파일 생성

프로젝트 루트에 `vitest.config.ts`를 생성하여, TypeScript path alias(`@/`)를 해석하도록 설정합니다.

### Step 3: npm script 추가

`package.json`의 `scripts`에 다음을 추가합니다:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

- `npm test`: Watch 모드로 실행 (개발 중 사용)
- `npm run test:run`: 단일 실행 (CI 환경용)
- `npm run test:coverage`: 커버리지 리포트 생성

### Step 4: 첫 번째 테스트 파일 작성

`validateUserId.test.ts`를 작성하여 테스트 인프라가 정상 작동하는지 확인합니다. Given-When-Then 패턴으로 작성하며, 아래와 같은 시나리오를 커버합니다:

- 정상적인 userId 입력 시 "valid" 반환
- 3자 미만 또는 20자 초과 시 "lengthError" 반환
- 특수문자 포함 시 "invalidCharacters" 반환
- 예약어 입력 시 "reservedWords" 반환

### Step 5: 나머지 Phase 1 대상 테스트 작성

우선순위 1 그룹(`extractFileName`, `generateRandomPW`, `getMissingFields`)을 먼저 완료한 후, 우선순위 2 그룹(`createErrorResponse`, `sanitizeHtml` 등)으로 확장합니다.

---

## 5. 예상 일정

| Phase | 범위                                              | 예상 소요 |
| :---: | ------------------------------------------------- | :-------: |
|   1   | 프레임워크 설치 + 순수 함수 테스트 (30~40 케이스) |   1~2일   |
|   2   | API Route Handler 테스트 (60~80 케이스)           |   3~5일   |
|   3   | 통합 테스트 (Custom Hooks)                        |   3~5일   |
|   4   | E2E 테스트                                        | 별도 협의 |

---

## 6. 요약

1. "Vitest"를 테스트 프레임워크로 채택합니다.
2. 순수 함수부터 시작하여 "Test Pyramid" 전략에 따라 점진적으로 확장합니다.
3. 브랜치는 "dev에서 test/setup 분기"를 권고합니다.
4. Phase 1 완료 시 약 30~40개의 테스트 케이스가 생성되며, 핵심 유틸리티 함수의 안정성이 보장됩니다.
