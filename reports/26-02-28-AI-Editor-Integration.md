# 에디터 AI 기능 통합 검토 보고서

작성일: 2026-02-28
작성자: Frontend Developer, Backend Developer (공동)

---

## 1. 요구사항 정리

에디터(Tiptap)에서 텍스트를 선택한 후, "버블 메뉴" 또는 "우클릭 컨텍스트 메뉴"를 통해 AI 기반 텍스트 처리 기능을 제공하고자 합니다.

- 대상 사용자 동작: 텍스트 블록 선택 → 버블 메뉴에서 AI 메뉴 선택, 또는 우클릭 → 컨텍스트 메뉴에서 AI 메뉴 선택
- 프리셋 기능: 문장 다듬기(교정/윤문), 번역(한↔영) 등 자주 쓰는 명령을 버튼으로 제공
- 자유 프롬프트 기능: 사용자가 직접 프롬프트를 입력하여 세밀한 요구를 전달할 수 있도록 함 (예: "이 문장을 좀 더 학술적인 용어로 바꿔 줘", "지금보다 좀 더 격식체로 다듬어줘" 등)
- 안전장치: 웹 검색 등 텍스트 편집 범위를 벗어나는 요청은 사전 검증 단계에서 차단
- 모델 요구 수준: 고성능 모델이 필요하지 않으므로, 비용 효율적인 경량 모델 사용 가능

---

## 2. 현재 프로젝트 인프라 분석

### 2.1. 프론트엔드 현황

- 에디터: Tiptap v3 기반 (`@tiptap/react@^3.6.3`)
- BubbleMenu: 이미 구현이 완료되어 `Editor.tsx`에 주석 처리되어 있습니다.
- Tiptap UI 컴포넌트 체계: `src/app/components/tiptap/tiptap-ui/` 및 `tiptap-ui-primitive/` 디렉토리에 버튼, 팝오버, 드롭다운 등의 재사용 가능한 UI 컴포넌트가 이미 구축되어 있습니다.
- 상태 관리: TanStack Query를 사용하고 있으므로, AI API 호출도 mutation으로 관리할 수 있습니다.
- 다국어: `next-intl`을 사용 중이므로, UI 텍스트의 다국어 처리가 용이합니다.

### 2.2. 백엔드 현황

- 프레임워크: Next.js 14 App Router (Route Handlers)
- 기존 API: `src/app/api/` 하위에 `contact`, `contents`, `documents`, `files`, `home`, `meta`, `tabs`, `users` 등 Route Handler가 존재합니다.
- 환경변수: `.env.local`에 SMTP 관련 변수가 설정되어 있습니다. AI API 키도 같은 방식으로 관리할 수 있습니다.
- 외부 API 호출: `axios@^1.4.0`이 설치되어 있어 외부 AI API 호출에 사용 가능합니다.

### 2.3. 현재 없는 것 (신규 구축 필요)

- AI/LLM API 연동 설정 (API 키, 클라이언트 라이브러리)
- AI 요청을 중계하는 백엔드 API 엔드포인트
- 에디터 내 AI 기능 트리거 UI (버블 메뉴 AI 버튼, 컨텍스트 메뉴)
- AI 응답 미리보기 및 적용/취소 UI

---

## 3. 기술 스택 선정

### 3.1. AI 모델/서비스 선택지

고성능 모델이 필요하지 않다는 전제하에, 아래 옵션들을 비교합니다.

| 서비스            | 모델 예시          | 장점                                                                               | 단점                                  | 월 예상 비용 (소규모) |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------- | ------------------------------------- | --------------------- |
| OpenAI API        | `gpt-4o-mini`      | 안정적, 한국어 품질 우수, 문서 풍부                                                | API 키 관리 필요, 종량제              | $5~15                 |
| Google Gemini API | `gemini-2.0-flash` | 무료 티어(15 RPM) 제공, 한국어 지원 양호, Google Cloud 연동 용이(기존 GCS 사용 중) | 무료 티어 제한 초과 시 과금           | 무료~$10              |
| Anthropic API     | `claude-3.5-haiku` | 텍스트 품질 우수                                                                   | 한국어 특화도는 OpenAI 대비 약간 낮음 | $5~15                 |
| 로컬/셀프호스팅   | Ollama + 경량 모델 | 비용 없음, 데이터 외부 유출 없음                                                   | 서버 인프라 필요, 배포 복잡           | 서버 비용만           |

#### 권장: Google Gemini API 또는 OpenAI API

- 현재 프로젝트가 이미 Google Cloud Storage를 사용하고 있으므로(`@google-cloud/storage@^7.10.2`), Google Cloud 생태계 내에서 Gemini API를 연동하면 인프라 일관성이 유지됩니다.
- 다만, OpenAI의 `gpt-4o-mini`가 한국어 교정/윤문 품질에서 현재 가장 검증된 선택이기도 합니다.
- 두 서비스 모두 공식 Node.js SDK를 제공하므로 통합 난이도에 큰 차이가 없습니다.
- 최종 선택은 사용자의 판단에 따르되, 본 보고서에서는 구현 예시를 "어느 서비스든 교체 가능한 구조"로 설계합니다.

### 3.2. 필요 라이브러리

선택한 AI 서비스에 따라 아래 중 하나를 설치합니다.

```bash
# OpenAI 선택 시
npm install openai

# Google Gemini 선택 시
npm install @google/generative-ai
```

추가 라이브러리 설치는 불필요합니다. 스트리밍 응답은 Web Streams API(브라우저 내장)를 사용하므로 별도 패키지가 필요하지 않습니다.

---

## 4. 구현 설계

### 4.1. 전체 아키텍처

```
[사용자: 텍스트 선택]
        |
        v
[프론트엔드: 버블 메뉴 / 컨텍스트 메뉴]
        |
        | 선택된 텍스트 + 명령(프리셋 또는 자유 프롬프트)
        v
[Next.js API Route: /api/ai/text]  ← API 키는 서버에서만 관리
        |
        |--- [프리셋 명령] → 프롬프트 구성 → AI API 호출 (1회)
        |
        |--- [자유 프롬프트] → Step 1: 가드 호출 (적절성 검증)
        |                         |
        |                    적절함 → Step 2: 본 명령 실행
        |                    부적절 → 거부 응답 반환
        v
[AI 서비스 (OpenAI / Gemini)]
        |
        | 응답 (스트리밍 or 일반)
        v
[프론트엔드: 미리보기 → 적용/취소]
```

핵심 설계 원칙:

- AI API 키를 클라이언트에 노출하지 않기 위해, 반드시 백엔드(Next.js Route Handler)를 경유하여 AI API를 호출합니다.
- 자유 프롬프트의 경우, "가드 호출"과 "본 명령 실행"의 2단계로 나누어 부적절한 요청을 사전 차단합니다.

### 4.2. 백엔드 구현

#### 4.2.1. AI API 엔드포인트

`src/app/api/ai/text/route.ts`를 신규 생성합니다.

```typescript
// src/app/api/ai/text/route.ts (신규)

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { text, command, targetLang, customPrompt } = await request.json();

  // 1. 입력 검증
  if (!text || !command) {
    return NextResponse.json(
      { message: "텍스트와 명령이 필요합니다." },
      { status: 400 },
    );
  }

  // 2-A. 자유 프롬프트인 경우: 가드 호출 → 본 명령 실행 (2단계)
  if (command === "custom") {
    const guardResult = await callAI(buildGuardPrompt(customPrompt));
    if (guardResult !== "ALLOWED") {
      return NextResponse.json(
        { message: "텍스트 편집 범위를 벗어나는 요청입니다.", rejected: true },
        { status: 422 },
      );
    }
    const result = await callAI(buildCustomPrompt(customPrompt, text));
    return NextResponse.json({ result });
  }

  // 2-B. 프리셋 명령인 경우: 즉시 실행 (1단계)
  const prompt = buildPrompt(command, text, targetLang);
  const result = await callAI(prompt);

  return NextResponse.json({ result });
}
```

#### 4.2.2. 프롬프트 설계

`src/utils/ai-prompts.ts`를 신규 생성하여 프롬프트 템플릿을 관리합니다. 프리셋 명령용 프롬프트, 자유 프롬프트용 가드 프롬프트, 자유 프롬프트 본 명령 프롬프트의 세 종류로 구성됩니다.

```typescript
// src/utils/ai-prompts.ts (신규)

type AICommand = "polish" | "translate" | "custom";

// --- 1. 프리셋 명령 프롬프트 ---
export function buildPrompt(
  command: AICommand,
  text: string,
  targetLang?: string,
): string {
  switch (command) {
    case "polish":
      return [
        "다음 텍스트를 자연스럽고 매끄럽게 다듬어 주세요.",
        "원래 의미를 유지하면서 문법, 어휘, 문체를 교정해 주세요.",
        "결과 텍스트만 출력하고 부가 설명은 하지 마세요.",
        "",
        `원문: ${text}`,
      ].join("\n");

    case "translate":
      return [
        `다음 텍스트를 ${targetLang === "en" ? "영어" : "한국어"}로 번역해 주세요.`,
        "자연스럽고 매끄러운 번역을 해주세요.",
        "결과 텍스트만 출력하고 부가 설명은 하지 마세요.",
        "",
        `원문: ${text}`,
      ].join("\n");

    default:
      return text;
  }
}

// --- 2. 자유 프롬프트 가드 ---
// 사용자가 입력한 프롬프트가 "텍스트 편집" 범위 내의 요청인지 판별합니다.
// 이 호출은 경량 모델로도 충분하며, 출력 토큰이 매우 짧으므로 비용이 적습니다.
export function buildGuardPrompt(userPrompt: string): string {
  return [
    "당신은 사용자 요청의 적절성을 판별하는 분류기입니다.",
    "아래 '사용자 요청'이 텍스트 편집(교정, 윤문, 번역, 문체 변환, 요약, 확장 등)에 해당하면 'ALLOWED'를,",
    "텍스트 편집과 무관한 요청(웹 검색, 코드 실행, 외부 정보 조회, 이미지 생성 등)이면 'DENIED'를 출력하세요.",
    "반드시 'ALLOWED' 또는 'DENIED' 중 하나만 출력하세요.",
    "",
    `사용자 요청: ${userPrompt}`,
  ].join("\n");
}

// --- 3. 자유 프롬프트 본 명령 ---
// 가드를 통과한 후 실제로 사용자의 요청을 실행합니다.
export function buildCustomPrompt(userPrompt: string, text: string): string {
  return [
    "아래 '사용자 요청'에 따라 '원문'을 수정해 주세요.",
    "결과 텍스트만 출력하고 부가 설명은 하지 마세요.",
    "",
    `사용자 요청: ${userPrompt}`,
    "",
    `원문: ${text}`,
  ].join("\n");
}
```

가드 프롬프트의 설계 의도:

- 출력이 'ALLOWED' 또는 'DENIED' 한 단어뿐이므로 응답 토큰이 1~2개에 불과합니다. 따라서 2회 호출이더라도 추가 비용은 미미합니다.
- 경량 모델(`gpt-4o-mini`, `gemini-2.0-flash` 등)의 분류 정확도는 이 수준의 이진 판별에 충분합니다.
- 허용 범위(교정, 윤문, 번역, 문체 변환, 요약, 확장)와 차단 범위(웹 검색, 코드 실행, 외부 정보 조회)를 프롬프트에 명시하여 판별 기준을 명확히 합니다.
- 향후 허용/차단 범위를 조정할 때 이 프롬프트만 수정하면 됩니다.

#### 4.2.3. AI 서비스 클라이언트

`src/utils/ai-client.ts`를 신규 생성하여 AI 서비스 호출 로직을 캡슐화합니다. 이렇게 하면 향후 AI 서비스 교체 시 이 파일만 수정하면 됩니다.

```typescript
// src/utils/ai-client.ts (신규) - OpenAI 예시

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function callAI(prompt: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3, // 교정/번역은 창의성보다 정확성이 중요
    max_tokens: 2000,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}
```

#### 4.2.4. 환경변수

`.env.local`에 아래 변수를 추가해야 합니다.

```
# OpenAI 선택 시
OPENAI_API_KEY=sk-...

# Google Gemini 선택 시
GEMINI_API_KEY=...
```

#### 4.2.5. 인증 및 보안

현재 프로젝트의 API 인증 패턴을 확인하여, AI 엔드포인트에도 동일한 인증을 적용해야 합니다. 최소한 로그인된 사용자(admin)만 AI 기능을 사용할 수 있도록 제한해야 합니다.

- AI API 요청에 rate limiting을 적용하여 과도한 사용을 방지합니다 (예: 사용자당 분당 10회).
- 입력 텍스트의 최대 길이를 제한합니다 (예: 5,000자).

### 4.3. 프론트엔드 구현

#### 4.3.1. 접근 방식 A: 버블 메뉴 확장

`Editor.tsx`에 이미 주석 처리된 `BubbleMenu`가 존재합니다. 이 BubbleMenu를 활성화하고 AI 버튼을 추가합니다.

```typescript
// Editor.tsx 내 BubbleMenu 활성화 + AI 버튼 추가 예시

<BubbleMenu
  editor={editor}
  options={{ placement: "bottom" }}
>
  <div className="bg-background-secondary z-20 flex items-center gap-1 rounded-lg border p-1 shadow-lg">
    {/* 기존 버튼들 */}
    <LinkPopover editor={editor} />
    <FileAttachButton editor={editor} userid={userid} />

    {/* AI 기능 버튼 (신규) */}
    <Separator />
    <AIMenuDropdown editor={editor} />
  </div>
</BubbleMenu>
```

#### 4.3.2. 접근 방식 B: 우클릭 컨텍스트 메뉴

Tiptap에서는 에디터 영역의 `contextmenu` 이벤트를 가로채서 커스텀 컨텍스트 메뉴를 표시할 수 있습니다.

```typescript
// src/app/components/tiptap/tiptap-ui/ai-context-menu/ai-context-menu.tsx (신규)

// 에디터의 onContextMenu 이벤트 핸들러에서:
// 1. event.preventDefault()로 브라우저 기본 컨텍스트 메뉴 차단
// 2. 마우스 좌표에 커스텀 메뉴 팝업 표시
// 3. 메뉴 항목: "다듬기", "한→영 번역", "영→한 번역"
```

이 접근 방식의 구현은 `@floating-ui/react@^0.27.16`(이미 설치됨)을 사용하여 컨텍스트 메뉴 위치를 계산할 수 있습니다.

#### 4.3.3. AI 결과 미리보기 UI

AI 결과를 바로 적용하지 않고, "미리보기 → 적용/취소" 단계를 거치도록 합니다.

구현 방식:

1. AI 요청 중: 버블 메뉴 또는 에디터 하단에 로딩 인디케이터를 표시합니다.
2. AI 응답 수신 후: 원문과 결과를 비교 표시하는 팝오버(또는 인라인 패널)를 보여줍니다.
3. 사용자가 "적용"을 클릭하면 선택 영역의 텍스트를 AI 결과로 교체합니다.
4. "취소"를 클릭하면 원래 텍스트를 유지합니다.

```typescript
// Tiptap에서 선택 영역 텍스트 교체 방법

// 선택된 텍스트 가져오기
const { from, to } = editor.state.selection;
const selectedText = editor.state.doc.textBetween(from, to);

// AI 결과로 교체
editor
  .chain()
  .focus()
  .deleteRange({ from, to })
  .insertContentAt(from, aiResult)
  .run();
```

#### 4.3.4. AI 요청 커스텀 훅

`src/hooks/useAIText.ts`를 신규 생성하여 AI 관련 mutation을 관리합니다.

```typescript
// src/hooks/useAIText.ts (신규)

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface AITextRequest {
  text: string;
  command: "polish" | "translate" | "custom";
  targetLang?: "ko" | "en";
  customPrompt?: string; // 자유 프롬프트 입력 시 사용
}

interface AITextResponse {
  result: string;
  rejected?: boolean; // 자유 프롬프트가 가드에 의해 거부된 경우
}

export function useAIText() {
  return useMutation({
    mutationFn: async (data: AITextRequest): Promise<AITextResponse> => {
      const response = await axios.post("/api/ai/text", data);
      return response.data;
    },
  });
}
```

#### 4.3.5. AI 메뉴 드롭다운 컴포넌트

`src/app/components/tiptap/tiptap-ui/ai-menu/` 디렉토리를 신규 생성하여, 기존 Tiptap UI 체계와 동일한 패턴으로 AI 드롭다운 컴포넌트를 구현합니다.

메뉴 항목:

- "다듬기" (프리셋) - 선택한 텍스트를 교정/윤문합니다.
- "한→영 번역" (프리셋) - 선택한 텍스트를 영어로 번역합니다.
- "영→한 번역" (프리셋) - 선택한 텍스트를 한국어로 번역합니다.
- "직접 입력..." (자유 프롬프트) - 텍스트 입력란이 나타나며, 사용자가 원하는 지시를 직접 기술합니다.

자유 프롬프트 UI 고려사항:

- 드롭다운 메뉴 하단에 텍스트 입력란(input 또는 textarea)과 "실행" 버튼을 배치합니다.
- 가드에 의해 요청이 거부된 경우, "텍스트 편집과 관련 없는 요청입니다"와 같은 안내를 표시합니다.
- 입력란에 placeholder로 예시를 보여주면 사용자 이해에 도움이 됩니다 (예: "좀 더 격식체로 바꿔 줘").

---

## 5. 수정 대상 파일 종합

### 5.1. 백엔드 영역

| 파일                           | 작업 내용                                                 |
| ------------------------------ | --------------------------------------------------------- |
| `src/app/api/ai/text/route.ts` | [신규] AI 텍스트 처리 API (프리셋 + 자유 프롬프트 + 가드) |
| `src/utils/ai-client.ts`       | [신규] AI 서비스 클라이언트 (교체 가능 구조)              |
| `src/utils/ai-prompts.ts`      | [신규] 프롬프트 템플릿 관리 (프리셋/가드/자유 프롬프트)   |
| `.env.local`                   | [수정] AI API 키 환경변수 추가                            |

### 5.2. 프론트엔드 영역

| 파일                                                                 | 작업 내용                                                  |
| -------------------------------------------------------------------- | ---------------------------------------------------------- |
| `src/app/components/admin/Editor.tsx`                                | [수정] BubbleMenu에 AI 메뉴 추가                           |
| `src/app/components/tiptap/tiptap-ui/ai-menu/ai-menu-dropdown.tsx`   | [신규] AI 기능 드롭다운 (프리셋 버튼 + 자유 프롬프트 입력) |
| `src/app/components/tiptap/tiptap-ui/ai-menu/ai-preview-popover.tsx` | [신규] AI 결과 미리보기 및 적용/취소 UI                    |
| `src/hooks/useAIText.ts`                                             | [신규] AI 텍스트 처리 TanStack Query mutation 훅           |

### 5.3. 공통 영역

| 파일                                   | 작업 내용                        |
| -------------------------------------- | -------------------------------- |
| i18n 메시지 파일 (ko.json, en.json 등) | [수정] AI 메뉴 관련 번역 키 추가 |

---

## 6. 난이도 및 소요 기간

| 영역                              | 난이도 | 예상 소요 |
| --------------------------------- | ------ | --------- |
| 백엔드 API + AI 클라이언트        | 낮음   | 2~3시간   |
| 프리셋 프롬프트 설계              | 낮음   | 1시간     |
| 자유 프롬프트 + 가드 설계/튜닝    | 중간   | 2~3시간   |
| 버블 메뉴 AI 버튼 + 프롬프트 입력 | 중간   | 2~3시간   |
| 컨텍스트 메뉴 구현                | 중간   | 3~4시간   |
| AI 결과 미리보기 UI               | 중간   | 3~4시간   |
| i18n, 에러 처리, 테스트           | 낮음   | 2~3시간   |
| 합계                              |        | 15~21시간 |

### 6.1. 단계별 구현 권장 순서

1단계 (MVP, 약 7시간): 백엔드 AI API + 버블 메뉴에 "다듬기" 프리셋 버튼 1개 추가 + 결과 즉시 교체(미리보기 없이)
2단계 (약 5시간): 번역 프리셋 추가 + 자유 프롬프트 입력 + 가드 구현
3단계 (약 5시간): 미리보기 UI + 우클릭 컨텍스트 메뉴 + rate limiting + 에러 처리 개선

---

## 7. 리스크 및 고려사항

### 7.1. 비용

- AI API는 종량 과금입니다. `gpt-4o-mini` 기준 입력 1K 토큰당 약 $0.00015, 출력 1K 토큰당 약 $0.0006으로, 프리셋 명령(교정/번역) 1건당 약 $0.001 수준입니다.
- 자유 프롬프트의 경우 가드 호출이 추가되지만, 가드의 출력 토큰이 1~2개('ALLOWED' 또는 'DENIED')뿐이므로 추가 비용은 $0.0002 이하로 미미합니다. 즉, 자유 프롬프트 1건당 총 비용은 약 $0.0012 수준입니다.
- 월 1,000건 사용 기준 약 $1~1.2 수준이므로 큰 부담은 아닙니다.
- Gemini API의 경우 무료 티어(분당 15요청, 일 1,500요청)가 있으므로 초기에는 비용 없이 운영할 수 있습니다. 다만 자유 프롬프트는 2회 호출이므로 무료 티어 한도 소진이 약간 빨라질 수 있습니다.

### 7.2. 보안

- AI API 키는 반드시 서버 측에서만 관리해야 합니다. 클라이언트 측 코드에 키를 노출해서는 안 됩니다.
- 사용자 인증을 통과한 요청만 AI API에 접근할 수 있도록 해야 합니다.
- 사용자 입력 텍스트가 외부 AI 서비스로 전송된다는 점을 인지해야 합니다. 민감한 개인정보가 포함될 수 있는 경우 이에 대한 고지가 필요할 수 있습니다.
- 자유 프롬프트 기능은 가드가 있더라도 프롬프트 인젝션 시도에 대비해야 합니다. 가드 프롬프트의 시스템 역할을 명확히 하고, 사용자 입력을 구분된 영역에 배치하는 것이 중요합니다.

### 7.3. 응답 지연

- 프리셋 명령: AI API 호출 1회, 일반적으로 500ms~3초 정도입니다.
- 자유 프롬프트: AI API 호출 2회(가드 + 본 명령)이므로 총 1~5초 정도 소요될 수 있습니다. 다만 가드 호출은 출력이 매우 짧으므로 대부분 500ms 이내에 완료됩니다.
- 사용자 경험을 위해 로딩 상태를 명확히 표시해야 합니다.
- 향후 스트리밍 응답을 도입하면 체감 대기 시간을 줄일 수 있습니다(3단계 이후 고려).

---

## 8. 사전 작업 요약

구현을 시작하기 전 결정 및 준비가 필요한 사항입니다.

1. AI 서비스 선택: OpenAI(`gpt-4o-mini`) vs Google Gemini(`gemini-2.0-flash`) 중 하나를 결정해야 합니다.
2. API 키 발급: 선택한 서비스에서 API 키를 발급받아 `.env.local`에 추가해야 합니다.
3. 라이브러리 설치: 선택한 서비스의 Node.js SDK를 설치해야 합니다.
4. 기존 인증 패턴 확인: AI API에 적용할 인증/인가 미들웨어를 기존 패턴에서 결정해야 합니다.
5. 가드 프롬프트 허용/차단 범위 확정: 자유 프롬프트에서 허용할 작업 유형(교정, 번역, 문체 변환, 요약, 확장 등)과 차단할 작업 유형(웹 검색, 코드 실행, 외부 정보 조회 등)의 경계를 확정해야 합니다.
