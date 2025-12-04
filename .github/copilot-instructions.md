# EasiestCV - AI Coding Agent Instructions

## Project Overview
EasiestCV is a Next.js-based academic portfolio builder targeting researchers and professors. It's a content-focused tool where users create personal CV websites by entering data into a simple interface. No complex web development skills required.

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React 18, Radix UI, Tailwind CSS
- **State**: TanStack React Query, Redux Toolkit
- **Rich Text**: Tiptap 3 (full markdown-like editor with custom hooks)
- **Database**: PostgreSQL (via `pg` package)
- **File Storage**: Google Cloud Storage (GCS)
- **i18n**: next-intl (EN/KO locales, always present in URL)
- **Auth**: JWT (cookies), bcrypt password hashing
- **Email**: Nodemailer (password resets, notifications)

### Routing Architecture
```
/(locale)/
  ├── [userid]/                    # Public profile pages
  │   ├── [slug]/                  # Dynamic tab content
  │   └── admin/                   # Admin dashboard (auth required)
  ├── support/                     # Support pages (info/, notice/)
  ├── tester/                      # Development/demo routes
  └── api/
      ├── users/{login,signup,logout,me,changePW,resetPW}
      ├── tabs/                    # CRUD for content tabs
      ├── contents/                # Tab content management
      ├── home/                    # Profile intro & image
      ├── meta/                    # SEO metadata
      ├── files/                   # Document file handling
      └── contact/                 # Contact form submissions
```

**Middleware** (`src/middleware.ts`): Auto-detects user browser language and redirects to appropriate locale, then applies next-intl routing.

### Data Flow & Query Patterns

**React Query Setup** (`src/provider/TanstackQueryProvider.tsx`, `src/utils/queryClient.ts`):
- Centralized query client with consistent cache/retry configuration
- Query keys defined in `src/constants/queryKeys.ts` using structured namespace pattern:
  ```typescript
  queryKeys.tabs({ userid: "..." })
  queryKeys.auth()
  queryKeys.user({ userid: "..." })
  queryKeys.home({ userid: "..." })
  ```

**HTTP Client** (`src/utils/http.ts`):
- Axios wrapper with automatic base URL (`/api`), credentials, 30s timeout
- Request interceptors available but currently unused (hook for future auth)
- Exported: `get<T>()`, `post<T>()`, `put<T>()`, `delete<T>()` with typed responses

**API Pattern** (`src/app/api/[resource]/route.ts`):
- Next.js route handlers, no framework wrapper
- Standard HTTP methods map to CRUD operations
- Error handling: Return `ApiErrorResponse` (`src/types/error.ts`)
- Auth: Check JWT from cookies (not implemented in shared middleware - validate per route)

### Database Schema
```
users → user_home (1:1), user_site_meta (1:1)
users → documents (1:M), tabs (1:M)
tabs → attachments (1:M for files array storage)
```
- All foreign keys use `DELETE CASCADE` on user deletion
- `src/utils/database.ts`: `query<T>(sql, params)` returns `T[]` from PostgreSQL

### Authentication & Authorization
1. **Login/Signup**: POST `/api/users/login` or `/api/users/signup` → JWT cookie set
2. **Session Check**: `useAuth()` hook queries `/api/users/me` to get `{ userid: string }`
3. **Protected Routes**: Check `me` query result; redirect to login if null
4. **Admin Routes**: Validate userid matches URL param `[userid]`

## Key Development Patterns

### Hooks Architecture
Custom hooks handle all data fetching and complex logic:
- **Auth hooks** (`useAuth`, `useLogin`, `useSignUp`, `useResetPW`): Manage user session and mutations
- **Data hooks** (`useTabs`, `useDocuments`, `useHome`, `useMetadata`): Query-wrapped CRUD operations
- **Tiptap hooks** (`src/hooks/tiptap/`): 10+ specialized hooks managing rich text editor state (cursor visibility, element positioning, window resize, etc.)

**Naming**: Use descriptive names; prefixed utils live in their own modules (`use-*.ts` for hooks, `*.ts` for utilities).

### Component Organization
```
src/components/
  ├── common/          # Reusable UI (likely headers, footers, modals)
  ├── public/          # Public-facing components (profile views)
  ├── admin/           # Admin dashboard (editor, settings)
  ├── support/         # Support pages
  ├── tiptap/          # Editor UI & toolbars
  ├── InitPage, LoginCard, SignUpCard, etc.  # Page-level components
```

**Pattern**: Use Radix UI primitives for accessibility + Tailwind for styling (e.g., `<Dialog>`, `<Dropdown>`, `<Tabs>`).

### Tiptap Editor Integration
- **Config**: `createEditorProps()` in `src/utils/tiptap-editor-config.ts` injects custom `handleKeyDown`
- **Extensions**: Full suite in `src/utils/tiptap-extensions.ts` (bold, italic, lists, code blocks, images, etc.)
- **Styling**: `src/styles/editor/` (tiptap-base.css, tiptap-nodes.css, tiptap-ui.css)
- **Hook**: `use-tiptap-editor.ts` wraps `useEditor()` with managed instance
- **Utilities**: `src/utils/tiptap-utils.ts` for editor-specific transformations
- **Tooltips**: Custom tooltips in `src/utils/quillTooltips.ts` for menu guidance

### Error Handling Pattern
```typescript
// From useAuth and similar hooks:
catch (error: AxiosError<ApiErrorResponse>) {
  if (!error.response) {
    // Network error
    alert(tError("networkError"));
  } else if (error.response.status === 500) {
    // Server error
    alert(tError("networkError"));
  } else {
    // Specific error message from API
    alert(error.response.data.message || tError("unknownError"));
  }
}
```
Use `useTranslations("error")` to access localized error messages.

### i18n Pattern
- **Localization files**: `src/i18n/locales/{en,ko}.json`
- **In components**: `const t = useTranslations("section")` then `t("key")`
- **Routing**: All URLs include locale prefix (`/en/`, `/ko/`), never create routes without it
- **Middleware**: Auto-detects language from `Accept-Language` header

## Build & Development Commands
```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Next.js build
npm start         # Production server
npm run lint      # ESLint + Next.js linter
```

**Environment Setup**: Requires `POSTGRES_*`, `NEXT_PUBLIC_API_URL`, Google Cloud Storage credentials, `JWT_SECRET`, Nodemailer config.

## Code Style & Conventions
- **TypeScript**: Strict mode enabled; path alias `@/*` for `src/*`
- **Styling**: Tailwind classes only (no inline CSS), tailwindcss-animate for transitions
- **Naming**: camelCase for functions/variables, PascalCase for components
- **File structure**: Co-locate related files (e.g., hook + types in same directory)
- **Imports**: Use path aliases (`@/`), group by external → internal
- **ESLint Rules**: No unused imports, tailwindcss ordering, prettier formatting

## Common Tasks

### Adding a New API Endpoint
1. Create `src/app/api/[resource]/route.ts` (HTTP handler)
2. Validate JWT if needed; return `{ message: string }` or `{ data: T }` on success
3. Return `{ message: string }` (status 400/500) on error
4. Add query key to `src/constants/queryKeys.ts`
5. Create hook in `src/hooks/use[Resource].ts` using `useQuery`/`useMutation`

### Modifying Tab Content Storage
- Tab content stored in `tabs.contents` as text (likely HTML from Tiptap)
- When fetching: deserialize from storage → parse to Tiptap JSON
- When saving: serialize Tiptap JSON → store as HTML/JSON string

### Adding UI Component
- Use Radix UI if interaction needed; Tailwind for layout
- Place in appropriate `src/components/` subfolder
- Export from component file and use path alias in imports

### Localization
- Add key/value to `src/i18n/locales/en.json` and `ko.json`
- Import `useTranslations()`, call with correct section: `const t = useTranslations("page")` then `t("key")`
- **Always test both locales** - broken keys fallback to key name

## Important Notes
- **User IDs are case-insensitive** in URLs (normalize with `toLowerCase()` in comparisons)
- **GCS image URLs** returned from `/api/home` endpoint; validate CORS headers if images fail to load
- **Session management**: JWT token in HTTP-only cookie; `useAuth()` query auto-refreshes on mount
- **Database migrations**: No explicit migration tool; schema assumed to exist (contact DevOps for schema changes)
- **Testing environment**: Demo account `tutorial` / `easiestcv` at https://easiest-cv.com/
