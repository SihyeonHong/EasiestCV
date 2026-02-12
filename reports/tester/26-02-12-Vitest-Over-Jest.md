# Jest를 사용하지 않고 Vitest를 선택한 이유

## 1. 개요

EasiestCV 프로젝트에 테스트 인프라를 도입하면서, 테스트 러너로 Jest 대신 Vitest를 선택하였습니다. 두 도구는 기능적으로 거의 동일하지만, 이 프로젝트에서 Jest를 사용할 경우 발생하는 설정 복잡도와 유지보수 부담이 Vitest 대비 현저히 높습니다.

이 보고서는 해당 판단의 근거를 기술합니다.

---

## 2. 기술적 배경

Vitest를 선택하게 된 배경에는 이 프로젝트의 두 가지 기술적 조건이 있습니다:

- ESM (ECMAScript Modules) 프로젝트: 프로젝트의 모든 `.js` 파일이 CommonJS(`require`)가 아닌 ESM(`import/export`)으로 해석됩니다. Next.js 14 App Router를 사용하는 최신 프로젝트에서 표준적인 설정입니다.

- Path Alias: 프로젝트 전체에서 `import { something } from "@/utils/something"` 형태의 절대 경로 import를 사용합니다.

---

## 3. Jest를 선택할 경우 발생하는 문제들

### 3.1 핵심 문제: `transformIgnorePatterns`의 "지속적" 유지보수

Jest를 선택할 경우, 가장 큰 문제는 지속적으로 유지보수가 필요하다는 점입니다.

Jest는 기본적으로 `node_modules` 하위의 모든 파일을 변환(transpile)하지 않습니다. 그런데 최신 npm 패키지들은 ESM으로 배포되는 경우가 점점 늘어나고 있으며, Jest가 이 ESM 패키지를 만나면 다음 에러가 발생합니다:

```
SyntaxError: Cannot use import statement outside a module
```

이를 해결하려면, `transformIgnorePatterns`에 해당 패키지를 "하나씩" 예외로 등록해야 합니다:

```javascript
// jest.config.mjs
const customConfig = {
  transformIgnorePatterns: [
    "/node_modules/(?!(isomorphic-dompurify|next-intl|@tiptap|lucide-react)/)",
  ],
};
```

이 설정은 라이브러리 도입 초기에 한 번 설정하면 끝나는 구성이 아닙니다. "프로젝트의 수명 내내 반복되는 유지보수 작업"입니다:

1. "새로운 패키지를 설치할 때마다" 해당 패키지가 ESM으로 배포되었는지 확인하고, ESM이면 이 목록에 추가해야 합니다.
2. "기존 패키지를 업데이트할 때" 이전 버전에서는 CJS였지만 새 버전에서 ESM으로 전환된 경우, 갑자기 테스트가 깨집니다. 이때 에러 메시지만으로는 원인이 `transformIgnorePatterns` 누락인지 즉시 파악하기 어렵습니다.
3. "AI와 코딩할 때 특히 위험합니다." AI가 새 패키지를 추천하여 설치할 경우, 해당 패키지가 ESM인지 확인하고 Jest 설정을 동시에 갱신하는 것을 잊기 쉽습니다. 테스트는 정상적으로 통과하던 것이 어느 날 깨지게 되고, 원인을 추적하는 데 불필요한 시간을 소모합니다.

현재 이 프로젝트에서 Jest를 사용한다면 즉시 등록해야 하는 ESM 패키지 목록은 다음과 같습니다:

- `isomorphic-dompurify`
- `next-intl`
- `@tiptap/*` 계열 ("30개 이상")
- `lucide-react`
- `@radix-ui/*` 계열
- `sonner`

이 목록은 현재 시점의 스냅샷이며, 이후 패키지를 추가하거나 업데이트할 때마다 계속 늘어납니다.

반면, "Vitest에는 이 설정 자체가 존재하지 않습니다." Vitest는 esbuild를 사용하여 모든 모듈을 자동으로 변환하므로, 패키지를 몇 개를 설치하든, ESM이든 CJS이든, 추가 설정 없이 작동합니다. 패키지를 설치하고 테스트 코드만 작성하면 됩니다. "테스트와 무관한 설정 파일을 건드릴 일이 없습니다."

### 3.2 부수적 문제: ESM 호환성 초기 설정

초기 도입 시에 한 번 설정하면 끝나는 문제이기는 하지만, 이 부분 역시도 Vitest와 비교했을 때 번거로운 부분이 많습니다.

Jest는 내부적으로 CommonJS를 기반으로 설계되었습니다. ESM 지원은 `--experimental-vm-modules` 플래그를 통해 실험적으로 제공되고 있으나, 2026년 현재까지도 "Experimental" 상태입니다.

이 프로젝트의 `package.json`에 `"type": "module"`이 선언되어 있으므로, Jest를 사용하려면 다음 작업이 필요합니다:

1. `jest.config` 파일의 확장자를 `.mjs`로 변경하거나, `export default` 대신 `module.exports`를 사용하는 별도의 설정이 필요합니다.
2. `next/jest`가 제공하는 `createJestConfig`를 사용하여 Next.js 특화 변환을 적용해야 합니다.
3. 테스트 실행 시 Node.js에 `--experimental-vm-modules` 플래그를 전달해야 합니다.

이 작업들은 처음 한 번만 수행하면 되므로, 그 자체로는 Jest를 배제할 근거가 되지 않습니다.

### 3.3 부수적 문제: Path Alias 동기화

이 문제도 초기 설정에 해당하지만, 3.1의 유지보수 문제와 유사한 패턴이 존재합니다.

`tsconfig.json`에 이미 `@/*` 매핑이 정의되어 있음에도, Jest는 이를 읽지 않으므로 `moduleNameMapper`에 같은 정보를 "중복으로" 작성해야 합니다:

```javascript
// jest.config.mjs — tsconfig.json과 동일한 정보를 중복 기재
const customConfig = {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
```

만약 향후 path alias를 추가하거나 변경하면, `tsconfig.json`과 `jest.config` 양쪽을 동기화해야 합니다. 하나만 수정하고 다른 하나를 빠뜨리면 "빌드는 성공하지만 테스트만 실패"하는 혼란스러운 상황이 발생합니다.

Vitest도 `resolve.alias` 설정이 필요하므로 이 점에서는 큰 차이가 없습니다. 다만, 3.1의 `transformIgnorePatterns` 유지보수 부담과 합산하면, Jest 쪽에서 "테스트 코드가 아닌 설정 파일을 건드려야 하는 빈도"가 Vitest보다 훨씬 높습니다.

### 3.4 설정 파일 최종 비교

#### Jest: 예상 설정 파일

```javascript
// jest.config.mjs
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const customConfig = {
  testEnvironment: "jsdom",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // 이 목록은 ESM 패키지를 설치하거나 업데이트할 때마다 갱신해야 합니다
  transformIgnorePatterns: [
    "/node_modules/(?!(isomorphic-dompurify|next-intl|@tiptap|lucide-react|@radix-ui|sonner)/)",
  ],
};

export default createJestConfig(customConfig);
```

"이 설정 파일은 완성본이 아닙니다." 프로젝트에 새로운 ESM 패키지가 추가될 때마다 `transformIgnorePatterns`를 갱신해야 하며, 갱신을 잊으면 테스트가 깨집니다.

#### Vitest: 실제 설정 파일

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
  },
});
```

"이 설정 파일은 완성본입니다." 패키지를 추가하거나 업데이트해도 이 파일을 수정할 필요가 없습니다.

---

## 4. 학습 비용: Jest 경험자의 Vitest 전환

Jest와 Vitest의 테스트 코드 작성 방식은 거의 동일합니다. 두 도구 모두 `describe`, `it`(또는 `test`), `expect`를 사용하며, Matcher API(`toBe`, `toEqual`, `toHaveBeenCalledWith` 등)도 동일합니다.

유일한 차이는 "모킹 네임스페이스"입니다:

| 기능           | Jest                                   | Vitest                        |
| -------------- | -------------------------------------- | ----------------------------- |
| 모킹 함수 생성 | `jest.fn()`                            | `vi.fn()`                     |
| 모듈 모킹      | `jest.mock("module")`                  | `vi.mock("module")`           |
| 스파이         | `jest.spyOn(obj, "method")`            | `vi.spyOn(obj, "method")`     |
| 타이머 제어    | `jest.useFakeTimers()`                 | `vi.useFakeTimers()`          |
| import 방식    | `import { jest } from "@jest/globals"` | `import { vi } from "vitest"` |

`jest` → `vi`로 접두사만 변경하면 되므로, Jest 경험이 있다면 Vitest로의 전환에 추가 학습이 거의 필요하지 않습니다. 나머지 API (`describe`, `it`, `expect`, `beforeEach`, `afterEach` 등)는 완전히 동일합니다.

코드 예시:

```typescript
// Jest로 작성한 테스트
import { jest } from "@jest/globals";
import { validateUserId } from "@/utils/validateUserId";

describe("validateUserId", () => {
  it("유효한 userId에 대해 valid를 반환해야 한다", () => {
    expect(validateUserId("john")).toBe("valid");
  });
});
```

```typescript
// Vitest로 작성한 테스트 — describe/it/expect는 완전히 동일
import { describe, it, expect } from "vitest";
import { validateUserId } from "@/utils/validateUserId";

describe("validateUserId", () => {
  it("유효한 userId에 대해 valid를 반환해야 한다", () => {
    expect(validateUserId("john")).toBe("valid");
  });
});
```

위 두 코드에서 import문 한 줄을 제외하면 나머지는 문자 하나 차이 없이 동일합니다.

---

## 5. 결론

Jest는 10년 이상 검증된 도구이며 생태계 규모와 참고 자료 면에서 우위에 있습니다. 그러나 이 프로젝트의 기술적 조건(ESM + path alias + 다수의 ESM 의존성)에서는 Jest의 설정 복잡도가 높아지고, 새로운 의존성을 추가할 때마다 설정 파일을 유지보수해야 하는 부담이 발생합니다.

Vitest는 이러한 환경에서 설정 없이 즉시 작동하며, Jest와 거의 동일한 API를 제공하여 학습 비용이 최소화됩니다. 따라서 이 프로젝트의 테스트 러너로 Vitest를 채택합니다.
