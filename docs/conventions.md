# 컨벤션

## 코드 컨벤션

### 코드 스타일

- `ESLint` 및 `Prettier` 사용하여 코드 스타일 통일

#### 네이밍 규칙

- 타입명, 컴포넌트명: `PascalCase`
- 변수명, 함수명, 객체 속성명: `camelCase` (DB 컬럼명은 `snake_case`이니 변환 주의)

##### 폴더 및 파일 네이밍

> Next.js의 컨벤션을 우선으로 함

###### `kebab-case`

- 폴더
- 라우팅, 페이지 관련 파일
- 컴포넌트 파일
- 유틸 파일
- 기타 파일

###### `camelCase`

- hook 파일

##### Boolean 변수 네이밍

- 맞다/아니다 → `is + 상태/조건` (예: `isDarkMode`)
- 있다/없다 → `has + 속성/요소` (예: `hasActivePlayer`)

##### 함수 네이밍

- 컴포넌트 내부 함수: `handle + 동사 + 명사`  
  (예: `handleChangeDateFilter`, `handleOpenDialog`)
- props로 넘기는 함수: `on + 동사 + 명사`  
  (예: `onChangeDateFilter`, `onOpenDialog`)

#### 타입 선언

- 객체 타입: `interface`. extends 가능하면 하고.
- 그 외의 타입 (예: 유니언 타입 등): `type`
- 옵셔널 지양, 필수 필드이되 nullable하게 정의하기. undefined보다 null 지향.

#### 컴포넌트 작성 형식

- `export default function ComponentName() {}`

### 파일 구조

- 한 파일에 한 컴포넌트.
- 한 컴포넌트에 되도록 하나의 역할.

## 커밋 컨벤션

- 작은 커밋 지향: '기능 하나' 또는 '의미 있는 코드 변경 하나' 단위.

### 타입

- `feat`: 기능 추가
- `fix`: 버그 수정
- `refactor`: 리팩토링 (기능 변경 없음)
- `docs`: 문서 변경
- `chore`: 빌드, 패키지 업데이트 등 설정 관련 작업

### 예시

```
feat: 취소 버튼 추가
refactor: primary 버튼 색상 변경. 크기 변경.
```

## 브랜치 컨벤션

- `main`: 배포 기본 브랜치
- `dev`: 기능 개발 브랜치. `main` 브랜치로부터 분기. `dev`에서 개발하고 `main`으로 병합. 병합 후에도 삭제X.
  - `test`: 테스트 코드 작성. `dev`의 하위 브랜치. 병합 후에도 삭제X.
  - 기타 필요할 경우 `dev`에서 일회용 하위 브랜치 생성 가능.
- `hotfix`: 배포 버전의 긴급 수정 시 `main`의 하위 브랜치로 생성. 병합 후 삭제.

### PR 컨벤션

- 커밋 여러 개가 모여서 하나의 기능, 또는 문서화 측면에서 의미 있는 단위가 되었다고 판단될 때 PR 작성.
- GitHub Issue 연관 시 `resolves #번호` 기재해 자동 close.
- 리뷰 없이 바로 병합.
- PR 제목은 문서 내용 포괄하거나 핵심 주제에 대해서. 타입 작성 필요 없음. 나중에 무슨 PR인지만 잘 찾을 수 있게.
- 내용에 변경사항 상세히 작성.

### 브랜치 동기화 정책

모든 브랜치 사이의 병합은 `merge`를 기본으로 한다.

브랜치를 여기서 분기하면 안 됐을 때 제한적으로 `rebase`를 허용한다.
e.g.

- `main`: A - B
- `dev`: A - B - C
- `newBranch`: (A - B) - D

`dev`에서 C 커밋 뒤에 새 브랜치를 만들었어야 했는데 실수로 `main`에서(B 커밋 뒤에서) 만들었다.

```
git fetch origin
git switch newBranch
git rebase origin/dev
```

`newBranch`의 모든 커밋을 `dev`의 최신 커밋 뒤로 옮긴다.

- `dev`: A - B - C
- `newBranch`: (A - B - C) - D

처음부터 `dev` 기반으로 작업한 것처럼 히스토리가 정리된다.
