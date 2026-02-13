# 보안 취약점 2차 분석 및 조치 계획 (2026-02-13)

## 1. Next.js 업데이트 결과 (14.2.35)

- **성공**: 가장 치명적이었던 **'Critical' 등급의 인증 우회 취약점(CVE-2025-29927)이 완전히 제거**되었습니다.
- **잔존**: DoS(서비스 거부) 관련 취약점(High 1, Moderate 1)이 남아있으나, 이는 Next.js 15 이상에서 해결되거나 현재 14.x 대역의 최선 버전이므로 `Accepted Risk`로 관리하거나 추후 패치를 기다려야 합니다.

## 2. 잔존 취약점 식별 및 분석

`npm audit` 결과, 해결해야 할 주요 "간접 의존성(Transitive Dependency)" 취약점 3건이 식별되었습니다.

### 2.1. `ws` (WebSocket) - High Severity

- **경로**: `@vercel/postgres` -> `ws`
- **문제**: DoS 취약점 노출.
- **해결책**: `@vercel/postgres`를 **`0.10.0`**으로 업데이트 (현재 `0.5.1`).
- **주의**: Major 버전 업데이트이므로 호환성 테스트가 필수적입니다.

### 2.2. `tar` - High Severity

- **경로**: `bcrypt` -> `@mapbox/node-pre-gyp` -> `tar`
- **문제**: 임의 파일 덮어쓰기 취약점.
- **해결책**:
  1. `bcrypt` 최신 버전 확인 및 업데이트.
  2. 해결되지 않을 경우 `package.json`의 `overrides`를 사용하여 `tar` 버전을 강제 지정.

### 2.3. `glob` - High Severity

- **경로**: `eslint-config-next` -> `glob`
- **문제**: 커맨드 인젝션 취약점.
- **해결책**: `eslint-config-next` 업데이트. 단, Next.js 버전(`14.2.35`)과의 호환성을 고려해야 합니다.

## 3. 조치 제안 (Remediation Plan)

### Step 1: `@vercel/postgres` 업데이트

- 데이터베이스 연결과 관련된 중요 패키지입니다.
- 명령어: `npm install @vercel/postgres@latest`

### Step 2: `bcrypt` 업데이트 및 확인

- 사용자 인증과 관련된 패키지입니다.
- 명령어: `npm install bcrypt@latest`
- 이후에도 `tar` 문제가 남을 경우 `overrides` 적용 고려.

### Step 3: `devDependencies` 일괄 업데이트

- `eslint` 관련 패키지는 개발 의존성이므로 상대적으로 리스크가 적습니다.
- 명령어: `npm update eslint-config-next`

## 4. 승인 요청

위 3가지 단계의 업데이트를 순차적으로 진행하며, 각 단계마다 `npm audit`으로 취약점 제거 여부를 확인하고자 합니다. 진행을 승인해 주시겠습니까?
