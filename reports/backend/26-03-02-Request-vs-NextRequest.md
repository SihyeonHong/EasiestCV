# Request vs NextRequest 비교

## 1. 개요

Next.js의 Route Handler에서 요청 객체의 타입으로 `Request`(Web 표준)와 `NextRequest`(Next.js 확장) 중 하나를 선택할 수 있습니다. 응답 객체도 마찬가지로 `Response`와 `NextResponse`가 존재합니다. 본 보고서는 각 타입의 차이점, 장단점, 적합한 사용 시점을 정리합니다.

참고로 Next.js에는 `NextApiRequest` / `NextApiResponse`라는 타입도 존재하는데, 이것은 "Pages Router"(`pages/api/`)에서 사용하는 타입입니다. App Router(`app/api/`)에서는 `NextRequest` / `NextResponse`를 사용합니다. 두 쌍은 완전히 별개의 API이므로 혼동하지 않아야 합니다.

## 2. Request vs NextRequest

### 2.1. Request (Web 표준)

Fetch API 스펙에 정의된 글로벌 인터페이스입니다. 브라우저, Node.js, Deno, Cloudflare Workers 등 어디서든 사용 가능합니다.

주요 기능:

- `request.url`: 요청 URL 문자열
- `request.method`: HTTP 메서드
- `request.headers`: Headers 객체
- `request.json()`, `request.text()`, `request.formData()`: Body 파싱

### 2.2. NextRequest (Next.js 확장)

`next/server`에서 제공하는 클래스로, `Request`를 상속(`extends`)합니다. `Request`의 모든 기능을 포함하면서 다음 편의 기능을 추가합니다:

- `request.nextUrl`: 이미 파싱된 URL 객체. `searchParams`에 바로 접근 가능하며, Next.js의 `basePath`와 `locale` 정보도 포함
- `request.cookies`: 구조화된 쿠키 접근 (`.get()`, `.set()`, `.delete()`, `.has()`)
- `request.ip`: 클라이언트 IP 주소 (배포 환경에서)
- `request.geo`: 지리적 위치 정보 (배포 환경에서)

### 2.3. 코드 비교

Query Parameter 접근:

```typescript
// Request: URL 객체를 직접 생성해야 함
const { searchParams } = new URL(request.url);
const email = searchParams.get("email");

// NextRequest: 이미 파싱되어 있음
const email = request.nextUrl.searchParams.get("email");
```

쿠키 접근:

```typescript
// Request: Cookie 헤더 문자열을 직접 파싱해야 함
const cookieHeader = request.headers.get("Cookie");
// "token=abc123; theme=dark" -> 직접 split 필요

// NextRequest: 구조화된 API 제공
const token = request.cookies.get("token")?.value;
```

### 2.4. 장단점

`Request`:

- 장점: import 불필요 (글로벌 타입)
- 장점: Web 표준이므로 Next.js 외 환경으로 이식 가능
- 단점: 쿠키 접근 시 직접 파싱 필요
- 단점: URL 파싱을 위해 `new URL()` 호출 필요

`NextRequest`:

- 장점: `cookies` API로 쿠키를 편리하게 접근
- 장점: `nextUrl`로 URL 파싱 없이 바로 Query Parameter 접근
- 장점: `ip`, `geo` 등 배포 환경 정보 제공
- 단점: `next/server`에서 import 필요
- 단점: Next.js 프레임워크에 종속

### 2.5. 언제 무엇을 쓸 것인가

- 쿠키 접근이 필요한 경우: `NextRequest` 사용이 사실상 필수. `Request`로도 가능하지만 직접 파싱하는 것은 비효율적
- Middleware: `NextRequest` 사용이 필수. Next.js가 Middleware 함수의 인자로 `NextRequest`를 전달하도록 설계됨
- Body만 사용하는 POST/PUT/PATCH: `Request`로 충분. `request.json()`은 Web 표준 기능
- Query Parameter만 사용하는 GET: 둘 다 가능. `NextRequest`가 한 줄 짧지만 기능 차이는 없음
- 이식성이 중요한 경우: `Request` 사용. 단, Next.js 프로젝트에서 이 경우는 거의 없음

## 3. Response vs NextResponse

### 3.1. Response (Web 표준)

Fetch API 스펙에 정의된 글로벌 클래스입니다.

```typescript
// 기본 사용
return new Response(JSON.stringify(data), {
  status: 200,
  headers: { "Content-Type": "application/json" },
});

// Body 없는 응답
return new Response(null, { status: 204 });
```

### 3.2. NextResponse (Next.js 확장)

`next/server`에서 제공하는 클래스로, `Response`를 상속합니다. 다음 편의 기능을 추가합니다:

- `NextResponse.json()`: JSON 직렬화와 `Content-Type` 헤더를 자동 처리
- `NextResponse.redirect()`: 리디렉션 응답 생성
- `NextResponse.rewrite()`: URL 리라이트 (Middleware에서 주로 사용)
- `NextResponse.next()`: Middleware에서 요청을 다음 단계로 전달
- `response.cookies.set()` / `.delete()`: 응답에 쿠키 설정/삭제

### 3.3. 코드 비교

JSON 응답:

```typescript
// Response: 직접 직렬화하고 Content-Type 헤더를 명시해야 함
return new Response(JSON.stringify({ exists: true }), {
  status: 200,
  headers: { "Content-Type": "application/json" },
});

// NextResponse: json()이 직렬화와 헤더를 자동 처리
return NextResponse.json({ exists: true }, { status: 200 });
```

쿠키 설정 (로그인 응답 등):

```typescript
// Response: Set-Cookie 헤더를 직접 작성해야 함
return new Response(null, {
  headers: {
    "Set-Cookie": "token=abc123; Path=/; HttpOnly; Secure; SameSite=Strict",
  },
});

// NextResponse: 구조화된 API 제공
const response = NextResponse.json({ success: true });
response.cookies.set("token", "abc123", {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/",
});
return response;
```

### 3.4. 장단점

`Response`:

- 장점: import 불필요
- 장점: Web 표준, 이식 가능
- 단점: JSON 응답 시 `JSON.stringify()` + `Content-Type` 헤더를 매번 수동 설정
- 단점: 쿠키 설정 시 `Set-Cookie` 문자열을 직접 조합해야 함

`NextResponse`:

- 장점: `json()` 정적 메서드로 JSON 응답을 간결하게 생성
- 장점: `cookies.set()`으로 쿠키를 안전하게 설정
- 장점: `redirect()`, `rewrite()`, `next()` 등 라우팅 제어 기능
- 단점: `next/server`에서 import 필요
- 단점: Next.js 프레임워크에 종속

### 3.5. 언제 무엇을 쓸 것인가

- JSON 응답을 반환하는 경우: `NextResponse.json()`이 편리. `Response`로도 가능하지만 보일러플레이트가 많아짐
- 응답에 쿠키를 설정해야 하는 경우: `NextResponse` 사용 권장. `Set-Cookie` 문자열을 직접 조합하면 옵션 누락 등 실수 가능성이 높아짐
- Middleware: `NextResponse` 필수. `redirect()`, `rewrite()`, `next()` 메서드는 Next.js가 Middleware 응답을 해석하는 데 필요
- Body 없는 단순 응답 (204 등): `new Response(null, { status: 204 })`로 충분. `NextResponse`를 쓸 이유가 없음

## 4. 요약

- `NextRequest`와 `NextResponse`는 각각 Web 표준 `Request`와 `Response`를 상속한 Next.js 전용 확장입니다.
- 쿠키 처리, JSON 응답 생성, Middleware 등 Next.js 고유 기능이 필요한 경우 Next.js 확장 타입이 편리합니다.
- Body 파싱이나 단순 응답 등 Web 표준만으로 충분한 경우에는 표준 타입을 사용해도 무방합니다.
- Pages Router의 `NextApiRequest` / `NextApiResponse`와는 완전히 별개의 API이므로 혼동하지 않아야 합니다.
