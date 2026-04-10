# DESIGN.md — Easiest CV Design System

AI 에이전트가 일관된 UI를 생성하기 위한 상세 디자인 시스템 문서입니다.
사람이 읽는 요약 버전은 `docs/design-guide.md`를 참조하세요.

---

## 1. Visual Theme & Atmosphere

### 디자인 철학

"Easiest CV"는 학술 프로필(Academic CV)을 가장 쉽게 운영할 수 있는 도구입니다. 디자인은 "미니멀 징크(Minimal Zinc)" 톤으로, 깔끔하고 중립적이며 콘텐츠 중심의 전문적인 인상을 추구합니다. 학술 문서의 격식과 웹 도구의 실용성을 동시에 충족하는 것이 핵심입니다.

### 키워드

- 중립성 (Neutral): Zinc 계열로 통일된 무채색 기반, 어떤 학술 분야에도 어울리는 범용적 톤
- 가독성 (Readable): 콘텐츠가 주인공. 충분한 대비와 여백으로 텍스트 중심 경험 제공
- 깔끔함 (Clean): 최소한의 장식, 명확한 계층 구조, 불필요한 시각 요소 배제
- 전문성 (Professional): 학술 프로필 도구로서의 신뢰감, 일관된 패턴

### 무드

- 배경은 라이트 모드에서 따뜻한 오프화이트(`#f8f8f6`), 다크 모드에서 깊은 징크 블랙(`#09090b`)
- 카드와 에디터는 순백 배경(`#ffffff`)으로 배경과 미세한 대비를 형성
- 장식적 요소는 최소화하고, 콘텐츠 자체의 타이포그래피와 구조로 시각적 위계를 표현
- 색상 포인트는 링크(`blue-600`/`blue-400`)와 상태 표시에 한정하여 사용

---

## 2. Color Palette & Roles

CSS 변수 체계를 기반으로 합니다. 전역 토큰은 `src/app/globals.css`의 `:root`에서, Tiptap 에디터 및 유틸리티 토큰은 `src/styles/base/variables.css`에서 정의됩니다.

### Core Palette (Light Mode)

| Token                    | Value                  | Source   | Role                                                              |
| ------------------------ | ---------------------- | -------- | ----------------------------------------------------------------- |
| `--background`           | `#f8f8f6`              | custom   | 앱 전체 배경. 순백이 아닌 따뜻한 오프화이트.                      |
| `--background-secondary` | `#ffffff`              | custom   | 카드, 모달 등 강조가 필요한 보조 배경. 배경과 미세한 대비를 제공. |
| `--foreground`           | `#0b0908`              | custom   | 기본 텍스트. 순수 검정에 가까운 매우 어두운 톤.                   |
| `--muted`                | `var(--tt-text-muted)` | zinc-500 | 보조 텍스트. 힌트, placeholder, 비활성 라벨.                      |
| `--bg-code`              | `#fafafb`              | custom   | 코드 블록 및 인라인 코드 배경.                                    |
| `--link`                 | `#2563eb`              | blue-600 | 하이퍼링크 및 클릭 가능한 텍스트.                                 |
| `--radius`               | `0.5rem`               | shadcn   | 전역 기본 border-radius. Tailwind에 연동.                         |

### Alpha Variables (투명도 기반 유틸리티)

| Token                      | Value                       | Role                               |
| -------------------------- | --------------------------- | ---------------------------------- |
| `--tt-alpha-border-subtle` | `rgba(161, 161, 170, 0.06)` | 미세한 테두리. 카드 border 등.     |
| `--tt-alpha-border`        | `rgba(161, 161, 170, 0.12)` | 기본 테두리. 입력 필드, 구분선 등. |
| `--tt-alpha-muted`         | `rgba(113, 113, 122, 0.4)`  | placeholder, 비활성 상태 텍스트.   |

### Editor-Specific Colors

| Token                   | Value                   | Role                                  |
| ----------------------- | ----------------------- | ------------------------------------- |
| `--tt-bg-color`         | `#ffffff`               | Tiptap 에디터 전체 배경.              |
| `--tt-editor-bg-color`  | `#ffffff`               | 에디터 전용 배경. Card 내부에서 사용. |
| `--tt-text-muted`       | `#71717a`               | 보조 텍스트. zinc-500.                |
| `--tt-sidebar-bg-color` | `#f4f4f5`               | 사이드바 배경. zinc-100.              |
| `--tt-cursor-color`     | `#3f3f46`               | 에디터 커서 색상. zinc-700.           |
| `--tt-selection-color`  | `rgba(82, 82, 91, 0.2)` | 텍스트 선택 영역. zinc-600/20%.       |

### Highlight Colors (에디터 내 텍스트 하이라이트)

에디터에서 텍스트 하이라이트에 사용되는 9가지 색상입니다. 각 색상은 기본 버전과 contrast(강조) 버전 두 가지로 제공됩니다.

| Color  | Light (기본)       | Light (contrast)         |
| ------ | ------------------ | ------------------------ |
| yellow | `#fef9c3`          | `#fbe604`                |
| green  | `#dcfce7`          | `#c7fad8`                |
| blue   | `#e0f2fe`          | `#ceeafd`                |
| purple | `#f3e8ff`          | `#e4ccff`                |
| red    | `#ffe4e6`          | `#ffccd0`                |
| gray   | `rgb(248,248,247)` | `rgba(84,72,49,0.15)`    |
| brown  | `rgb(244,238,238)` | `rgba(210,162,141,0.35)` |
| orange | `rgb(251,236,221)` | `rgba(224,124,57,0.27)`  |
| pink   | `rgb(252,241,246)` | `rgba(225,136,179,0.27)` |

### Dark Mode Palette

다크 모드에서는 Zinc 계열의 어두운 톤을 사용합니다. `globals.css`의 `.dark` 선택자와 `variables.css`의 `.dark` 선택자에서 정의합니다.

| Token                      | Dark Value                  | Notes                                   |
| -------------------------- | --------------------------- | --------------------------------------- |
| `--background`             | `#09090b`                   | zinc-950. 깊은 어둠.                    |
| `--background-secondary`   | `#09090b`                   | 배경과 동일. 다크 모드에서는 구분 없음. |
| `--foreground`             | `#f0eee9`                   | 따뜻한 라이트 톤 텍스트.                |
| `--bg-code`                | `#27272a`                   | zinc-800.                               |
| `--link`                   | `#60a5fa`                   | blue-400.                               |
| `--tt-text-muted`          | `#a1a1aa`                   | zinc-400.                               |
| `--tt-bg-color`            | `rgba(14, 14, 17, 1)`       | 에디터 배경.                            |
| `--tt-editor-bg-color`     | `#0f0f11`                   | zinc-900과 950 사이.                    |
| `--tt-sidebar-bg-color`    | `#27272a`                   | zinc-800.                               |
| `--tt-cursor-color`        | `#a1a1aa`                   | zinc-400.                               |
| `--tt-alpha-border`        | `rgba(113, 113, 122, 0.15)` | 다크 모드 기본 테두리.                  |
| `--tt-alpha-border-subtle` | `rgba(113, 113, 122, 0.08)` | 다크 모드 미세한 테두리.                |

### 색상 사용 원칙

- HEX/RGB 코드를 CSS에 직접 하드코딩하지 않습니다. 반드시 CSS 변수 또는 Tailwind 유틸리티 클래스로 참조합니다.
- 새로운 색상이 필요할 때는 Tailwind CSS 팔레트에서 먼저 탐색합니다. 커스텀 값은 Tailwind에 적절한 값이 없을 때에만 등록합니다.
- Tailwind 팔레트에서 가져온 값은 HEX 코드 옆에 주석으로 Tailwind 색상명을 명시합니다. (예: `--link: #2563eb; /* blue-600 */`)
- 컴포넌트 내에서 색상을 지정할 때는 Tailwind 유틸리티 클래스를 기본으로 사용합니다. (예: `text-zinc-500`, `bg-zinc-100`, `border-zinc-200`)
- Zinc 계열을 주 팔레트로 사용합니다. 순수 gray 대신 zinc(`zinc-*`)를 사용합니다.
- 강조 색상은 링크(`--link`)와 상태 표시(destructive red 등)에 한정합니다.

---

## 3. Typography Rules

### 폰트 패밀리

- Primary: `'Pretendard', sans-serif`
  - CDN 로드: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css`
  - `globals.css`에서 `*` 선택자로 전역 적용
- Fallback (layout.tsx): `Inter` (Google Fonts, `next/font/google`를 통해 `body`에 className으로 적용)

### 타이포그래피 계층 (Tiptap 에디터 기준)

에디터 내부에서 사용되는 제목 체계입니다. `src/styles/editor/tiptap-base.css`에서 정의합니다.

| Element | Size            | Weight   | Tailwind Class            | 용도               |
| ------- | --------------- | -------- | ------------------------- | ------------------ |
| h1      | 1.5rem (24px)   | bold     | `text-2xl font-bold`      | 페이지/섹션 대제목 |
| h2      | 1.25rem (20px)  | semibold | `text-xl font-semibold`   | 하위 섹션 제목     |
| h3      | 1.125rem (18px) | semibold | `text-lg font-semibold`   | 소제목             |
| h4      | 1rem (16px)     | semibold | `text-base font-semibold` | 카드 내부 제목     |

### UI 타이포그래피

| Role           | Size                   | Weight | 용도                          |
| -------------- | ---------------------- | ------ | ----------------------------- |
| Page Title     | text-2xl               | bold   | CardTitle 등 페이지 레벨 제목 |
| Body           | text-base(md: text-sm) | normal | 일반 본문 텍스트              |
| Small / Meta   | text-xs                | normal | 푸터, 메타데이터, 보조 설명   |
| Button Default | text-sm                | medium | 버튼 내부 텍스트              |
| Button SM      | text-xs                | medium | 작은 버튼                     |
| Button LG      | text-lg                | medium | 큰 버튼 (CTA 등)              |

### 타이포그래피 원칙

- `word-wrap: break-word`가 전역(`*` 선택자)으로 적용됩니다.
- `text-rendering: optimizeLegibility`와 font smoothing(`-webkit-font-smoothing: antialiased`)이 `:root`에 적용됩니다.
- Tailwind Typography 플러그인(`@tailwindcss/typography`)이 활성화되어 있어, `prose` 클래스로 에디터 본문의 기본 스타일링을 처리합니다.
- `text-size-adjust: none`이 `:root`에 적용되어 모바일에서 자동 텍스트 크기 조정을 방지합니다.

---

## 4. Component Conventions

### 공용 컴포넌트

shadcn/ui (new-york 스타일, zinc 베이스) 기반 공용 컴포넌트를 사용합니다. 컴포넌트 소스는 `src/app/components/common/`에 위치하며, `class-variance-authority`(CVA)를 사용한 variant 시스템을 따릅니다. 구체적인 스타일은 각 컴포넌트 소스 파일을 직접 참조하세요.

### 원칙

- 새 UI를 만들 때 공용 컴포넌트(`Button`, `Card`, `Input` 등)가 이미 있는지 먼저 확인합니다.
- 같은 역할의 커스텀 컴포넌트를 새로 만들지 않습니다.
- variant 추가가 필요하면 기존 CVA 정의를 확장합니다.
- shadcn/ui 설정은 `components.json`을 참조하세요.

### 에디터 컴포넌트

에디터(Tiptap) 관련 스타일은 `src/styles/editor/` 디렉토리의 CSS 파일에서 관리합니다. 에디터 전용 CSS 변수는 `--tt-` 접두사를 사용합니다. 에디터 내부의 스타일을 수정할 때는 해당 CSS 파일을 직접 참조하세요.

---

## 5. Layout & Responsive

### 간격(Spacing) 사용 가이드

컴포넌트에서는 Tailwind CSS의 spacing 유틸리티를 직접 사용합니다. 아래는 프로젝트에서 간격을 적용하는 일반적인 패턴입니다.

| 용도                   | Tailwind 패턴               | 예시                            |
| ---------------------- | --------------------------- | ------------------------------- |
| 아이콘-텍스트 미세 간격 | `gap-1`, `gap-2`            | 버튼 내 아이콘 + 라벨           |
| 폼 필드 간 간격        | `gap-2`, `gap-6`            | 로그인 폼 필드 사이             |
| 카드 내부 padding      | `p-6`                       | CardHeader, CardContent 등      |
| 컴포넌트 간 간격       | `gap-6`, `gap-8`            | 카드 그리드, 섹션 내부 요소     |
| 섹션 상하 padding      | `py-12`                     | 메인 섹션 상하 여백             |
| 페이지 좌우 padding    | `px-4` / `md:px-8`          | 모바일 → 데스크탑 반응형 여백   |
| 페이지 레벨 margin     | `my-7`                      | Footer 상하 여백                |

에디터 스타일 등 CSS 파일에서는 `--spacing-*` CSS 변수(`variables.css`에 정의)를 사용합니다.

### 페이지 레이아웃

- `max-w-body`: `960px` (`tailwind.config.js`에서 커스텀 정의)
- 사용 패턴: `lg:max-w-body lg:mx-auto` (대형 화면에서 중앙 정렬)

프로젝트의 일반적인 페이지 구조는 다음과 같습니다:

```tsx
<div className="flex flex-col items-center">
  <Header />
  <Title />
  <main className="flex w-full flex-col">
    <section className="...px-4 py-12 md:px-8">{/* content */}</section>
  </main>
  <Footer />
</div>
```

### 최소 지원 너비

- `320px`을 최소 지원 너비로 설정합니다. 모든 루트/래퍼 요소는 `min-width: 320px`을 보장해야 합니다.
- 320px 미만에서는 레이아웃을 유지하면서 좌우 스크롤이 발생하도록 처리합니다. 억지로 UI를 구겨 넣지 않습니다.

### 반응형 브레이크포인트

Tailwind CSS의 표준 브레이크포인트를 사용합니다.

| Name          | Tailwind Prefix | Width Range    | 설계 의도                                    |
| ------------- | --------------- | -------------- | -------------------------------------------- |
| Mobile        | (기본)          | < 640px        | 1단 세로형 기본값. 좌우 여백 최소화.         |
| Tablet        | `sm:`           | 640px ~ 767px  | 여유 있는 배치 시작.                         |
| Small Desktop | `md:`           | 768px ~ 1023px | 가로 방향 배치 적용 시작 (`md:flex-row` 등). |
| Large Desktop | `lg:`           | 1024px ~       | `max-w-body` 제한, 중앙 정렬.                |

### 반응형 패턴 사례

| 패턴                | Mobile        | Desktop              |
| ------------------- | ------------- | -------------------- |
| 콘텐츠 좌우 여백    | `px-4`        | `md:px-8`            |
| Tabs 좌우 margin    | `mx-2`        | `md:mx-8 lg:mx-auto` |
| Feature 카드 그리드 | `grid-cols-1` | `md:grid-cols-3`     |
| 카드 간 간격        | `gap-6`       | `md:gap-8`           |
| Header flex         | `flex-col`    | `sm:flex-row`        |

---

## 6. Depth & Elevation

그림자와 border-radius는 기본적으로 shadcn/ui가 제공하는 기본값을 따릅니다. 에디터 영역은 Tiptap의 스타일을 따릅니다. 임의로 커스터마이징하지 않습니다.

### Border Radius

- 전역 기본값 `--radius`는 `globals.css`에서 정의하며, Tailwind의 `rounded-lg`, `rounded-md`, `rounded-sm`에 연동됩니다.

| Tailwind Class | 계산값                       | 일반적 용도                        |
| -------------- | ---------------------------- | ---------------------------------- |
| `rounded-lg`   | `var(--radius)` (0.5rem)     | 카드, 큰 컨테이너                  |
| `rounded-md`   | `calc(var(--radius) - 2px)`  | 버튼, 입력 필드, TabsList          |
| `rounded-sm`   | `calc(var(--radius) - 4px)`  | 인라인 코드, 작은 UI 요소         |
| `rounded-xl`   | Tailwind 기본값              | Card 컴포넌트 (shadcn 기본)       |

- 에디터 전용 radius 스케일(`--tt-radius-*`)은 `variables.css`에 별도 정의되어 있습니다. 에디터 내부 요소에서만 사용합니다.

---

## 7. Dark Mode

### 전환 메커니즘

- Tailwind CSS의 `class` 전략을 사용합니다 (`darkMode: ['class']`).
- `next-themes` 패키지의 `ThemeProvider`를 통해 `<html>` 태그에 `class="dark"`를 토글합니다.
- 기본 테마: `system` (OS 설정 따름), `enableSystem` 활성화.

### 다크 모드 구현 원칙

다크 모드 색상은 CSS 변수를 통해 처리하는 것을 원칙으로 합니다. 컴포넌트에서 Tailwind `dark:` 접두사를 직접 사용하는 것은 지양합니다.

1. `src/app/globals.css` → `.dark` 선택자: 핵심 색상 변수 (background, foreground, link 등)
2. `src/styles/base/variables.css` → `.dark` 선택자: alpha, 에디터, 하이라이트 색상

새로운 CSS 변수를 추가할 때는 반드시 `.dark` 선택자에도 대응 값을 정의해야 합니다.

### 비-색상 요소의 다크 모드 처리

- 그림자: `--tt-shadow-elevated-md`가 `.dark`에서 더 높은 opacity로 재정의
- 테두리: alpha 변수(`--tt-alpha-border`, `--tt-alpha-border-subtle`)가 `.dark`에서 재정의. 컴포넌트에서는 `border-zinc-200 dark:border-zinc-800` 대신 시맨틱 변수(예: `var(--tt-alpha-border)`)를 사용하는 방향으로 전환 필요
- 하이라이트 색상: 9가지 하이라이트 색상 모두 다크 버전 제공

---

## 8. Do's and Don'ts

### Do

- `src/app/components/common/`에 정의된 shadcn/ui 기반 공용 컴포넌트를 우선 사용
- 색상은 Tailwind 유틸리티 클래스(e.g., `text-zinc-500`, `bg-zinc-100` 등) 또는 CSS 변수(e.g., `var(--background)`)로 지정
- 새 색상 추가 시 Tailwind 팔레트에서 먼저 탐색하고, HEX 옆에 Tailwind 색상명 주석
- gray 대신 zinc 계열을 주 팔레트로 사용
- `lucide-react`에서 제공하는 아이콘을 우선 탐색
- 모든 인터랙티브 요소에 `focus-visible` 상태 유지 (접근성)
- `next-intl`을 통한 국제화 대응 (하드코딩된 문자열 금지)
- CVA(`class-variance-authority`)를 사용한 variant 패턴 유지
- 에디터 관련 스타일은 `src/styles/editor/` 디렉토리의 CSS 파일에서 관리
- 다크 모드 색상 처리는 CSS 변수(`.dark` 선택자)로 관리하고, 컴포넌트에서 `dark:` 접두사 직접 사용은 지양

### Don't

- CSS에 HEX/RGB 색상 코드를 직접 하드코딩하지 말 것 (CSS 변수 또는 Tailwind 유틸리티 사용)
- 순수 gray 계열(`gray-*`)을 사용하지 말 것 (`zinc-*` 사용). 이미 사용 중인 컴포넌트는 리팩터링 대상
- shadcn/ui 기반 공용 컴포넌트(`Button`, `Card`, `Input` 등)가 있는데 같은 역할의 커스텀 컴포넌트를 새로 만들지 말 것
- `lucide-react` 외의 아이콘 라이브러리를 새로 도입하지 말 것. `react-icons`는 기존 사용분이 있으나 신규 사용은 권장하지 않음
- Tailwind에 정의된 spacing/color 유틸리티가 있는데 임의의 매직 넘버를 사용하지 말 것
- `text-size-adjust`를 개별 컴포넌트에서 재정의하지 말 것 (전역 설정 유지)
- shadcn/ui, Tiptap의 그림자/radius 기본값을 임의로 커스터마이징하지 말 것

---

## 9. Technology Stack Reference

### 핵심 기술

| Category   | Technology              | Version  | 비고                      |
| ---------- | ----------------------- | -------- | ------------------------- |
| Framework  | Next.js                 | 14.2.x   | App Router, RSC           |
| Styling    | Tailwind CSS            | 3.4.x    | JIT, class 기반 dark mode |
| UI Library | shadcn/ui               | new-york | zinc base, CVA, Radix UI  |
| Typography | @tailwindcss/typography | 0.5.x    | prose 클래스              |
| Animation  | tailwindcss-animate     | 1.0.x    | Radix 애니메이션 지원     |
| Icons      | lucide-react            | 0.475.x  | 주 아이콘 라이브러리      |
| Theme      | next-themes             | 0.4.x    | 다크 모드 전환            |
| i18n       | next-intl               | 3.26.x   | 국제화                    |
| Editor     | Tiptap                  | 3.6.x    | 리치 텍스트 에디터        |
| Toast      | sonner                  | 2.0.x    | 토스트 알림               |

### 파일 구조 (스타일 관련)

```
(root)
├── tailwind.config.js           # Tailwind 확장 설정 (colors, maxWidth, borderRadius)
├── components.json              # shadcn/ui 설정 (style, aliases, baseColor)
└── src/
    ├── app/
    │   ├── globals.css           # Tailwind 디렉티브 + 핵심 CSS 변수
    │   ├── layout.tsx            # RootLayout (ThemeProvider, Font)
    │   └── components/
    │       └── common/           # shadcn/ui 기반 공용 컴포넌트
    │           ├── Button.tsx
    │           ├── Card.tsx
    │           ├── Input.tsx
    │           ├── Textarea.tsx
    │           ├── Tabs.tsx
    │           ├── Dialog.tsx
    │           ├── AlertDialog.tsx
    │           ├── DropdownMenu.tsx
    │           └── ...
    └── styles/
        ├── base/
        │   ├── variables.css     # 전역 CSS 변수 (spacing, color, radius, transition)
        │   └── animations.css    # Keyframe 애니메이션
        ├── editor/
        │   ├── tiptap-base.css   # Tiptap 에디터 기본 스타일
        │   ├── tiptap-nodes.css  # Tiptap 노드별 스타일
        │   └── tiptap-ui.css     # Tiptap UI 컴포넌트 스타일
        └── theme.ts              # 레거시 테마 객체 (리팩터링 대상)
```

### 알려진 리팩터링 대상

다음 항목은 디자인 시스템과 일치하지 않는 레거시 코드로, 수정이 필요합니다:

- `Footer.tsx`: `text-gray-600`, `border-gray-600` 사용 → zinc 계열 또는 시맨틱 변수로 변경 필요
- `DisplayMode.tsx`: `react-icons/lu`, `react-icons/md` 사용 → `lucide-react`로 통일 필요
- `src/styles/theme.ts`: 레거시 테마 객체. CSS 변수 체계로 완전 대체 필요
- 각종 컴포넌트의 `border-zinc-200 dark:border-zinc-800` 패턴 → 시맨틱 border 변수로 전환 필요
