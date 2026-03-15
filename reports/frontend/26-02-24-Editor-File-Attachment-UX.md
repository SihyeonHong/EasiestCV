# 에디터 파일 첨부 기능 UX 개선 보고서

## 1. 문제 분석

### 1.1. 현재 구조

에디터의 링크 기능과 파일 첨부 기능은 모두 Tiptap의 동일한 `link` mark를 사용합니다.

- `LinkPopover`: URL을 입력받아 `editor.chain().extendMarkRange("link").setLink({ href: url })` 호출
- `FileAttachButton`: PDF를 GCS에 업로드한 뒤 동일하게 `setLink({ href: pdfUrl })` 호출

### 1.2. 핵심 원인

툴바 버튼의 'active' 상태는 `use-link-popover.ts`의 `isLinkActive()` 함수에서 결정됩니다:

```typescript
export function isLinkActive(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false;
  return editor.isActive("link");
}
```

이 함수는 커서 위치에 `link` mark가 있으면 무조건 `true`를 반환합니다. 웹사이트 링크든 GCS 파일 링크든 구분하지 않으므로, 파일 첨부 버튼을 별도로 만들어도 두 버튼 모두 'active' 상태가 됩니다.

---

## 2. 해결 방안

### 방안 A: 파일 첨부를 별도 버튼 없이 LinkPopover 내부에 통합 (추천)

파일 첨부 버튼을 툴바에 별도로 두지 않고, 기존 `LinkPopover` 팝오버 내부에 파일 첨부 옵션을 추가합니다.

1. 기존 `LinkPopover`의 팝오버 내에 "파일 첨부" 버튼을 하나 추가
2. 해당 버튼 클릭 시 파일 선택 → GCS 업로드 → URL 자동 입력 → 링크 설정
3. 결과적으로 툴바에는 링크 버튼 하나만 존재

- 개발 난이도: 낮음 (기존 컴포넌트 수정만 필요)
- 장점: 버튼 active 상태 충돌 문제가 원천적으로 사라짐. UI가 깔끔함
- 단점: 파일 첨부 기능의 존재를 사용자가 인지하기 어려울 수 있음 (Discoverability 낮음)

구현 위치: `link-popover.tsx`의 `LinkMain` 컴포넌트 내부

```
┌──────────────────────────────────────────┐
│  🔗  [https://...            ] [↵] | [🗑] │
│                        [📎 파일 첨부]       │
└──────────────────────────────────────────┘
```

### 방안 B: Custom Attribute로 링크 타입 구분

`link` mark에 custom attribute를 추가하여 일반 링크와 파일 첨부 링크를 구분합니다.

1. `tiptap-extensions.ts`에서 `Link` extension을 `extend()`하여 `data-link-type` attribute 추가
2. 파일 첨부 시 `setLink({ href: pdfUrl, "data-link-type": "file" })` 형태로 저장
3. `FileAttachButton`의 active 상태를 `editor.isActive("link", { "data-link-type": "file" })`로 판별
4. `LinkPopover`의 active 상태를 `!editor.isActive("link", { "data-link-type": "file" }) && editor.isActive("link")`로 판별

- 개발 난이도: 중간 (Extension 커스텀 + 양쪽 active 로직 수정)
- 장점: 두 기능이 독립적인 버튼으로 존재하여 직관적
- 단점: 기존에 이미 저장된 링크 데이터에는 `data-link-type`이 없으므로, 기존 데이터와의 호환성 처리가 필요. HTML 저장 시 해당 attribute가 보존되는지 검증 필요

### 방안 C: 파일 버튼은 active 상태를 표시하지 않음

`FileAttachButton`에 active 상태를 아예 표시하지 않는 방식입니다. 파일 첨부는 "1회성 action 버튼"으로 간주합니다.

1. `FileAttachButton`을 이미지 버튼처럼 action-only 버튼으로 처리 (현재의 이미지 버튼과 동일한 패턴)
2. 파일 첨부 후에도 링크 아이콘만 active 상태가 되며, 파일 첨부 버튼은 항상 비활성 외관 유지
3. 파일 첨부로 생성된 링크를 편집하려면 링크 버튼을 통해 수정

- 개발 난이도: 낮음 (현재 `FileAttachButton`에서 이미 active 상태 표시가 없음)
- 장점: 이미지 삽입 버튼(`ImagePlusIcon`)과 패턴이 일치. 최소 변경으로 구현 가능
- 단점: "이 링크가 파일인지 웹사이트인지" 시각적으로 구분 불가

---

## 3. 추천

방안 A를 추천합니다. 이유는 다음과 같습니다:

1. 파일 첨부와 링크 삽입의 결과물이 동일한 `link` mark이므로, UI도 하나의 진입점으로 통합하는 것이 개념적으로 자연스럽습니다.
2. 파일 첨부 후 생성된 URL이 링크 입력란에 자동으로 채워지므로, 사용자가 결과를 확인하고 필요시 URL을 수정할 수도 있습니다.
3. active 상태 충돌 문제가 구조적으로 발생하지 않습니다.
4. 구현 복잡도가 가장 낮습니다.

---

## 4. 방안 A 구현 상세

### 4.1. 변경 대상 파일

- `src/app/components/tiptap/tiptap-ui/link-popover/link-popover.tsx`: `LinkMain` 컴포넌트에 파일 첨부 버튼 추가
- `src/app/components/admin/MainToolbarContent.tsx`: `userid` prop 전달 (GCS 업로드에 필요)
- `src/app/components/admin/TiptapToolbar.tsx`: `userid` prop 전달
- `src/app/components/admin/Editor.tsx`: `userid` prop 전달

### 4.2. 구현 흐름

1. `LinkMain`에 파일 첨부 버튼 추가
2. 버튼 클릭 → hidden `<input type="file">` 트리거
3. 파일 선택 → `useTabContents(userid).uploadPdfToGCS(formData)` 호출
4. 업로드 성공 → 반환된 URL을 `setUrl(pdfUrl)` 로 입력란에 자동 설정
5. 사용자가 확인 후 Enter 또는 적용 버튼 클릭 → 기존 `setLink()` 동작

### 4.3. 예상 작업 시간

약 2~3시간(테스트 포함)
