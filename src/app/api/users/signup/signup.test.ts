import { NextRequest } from "next/server";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";

import { DBError } from "@/types/error";
import { query } from "@/utils/database";

import { POST } from "./route";

// Mocks
vi.mock("@/utils/database", () => ({
  query: vi.fn(),
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password_123"),
  },
}));

vi.mock("fs", () => {
  const mockRead = vi.fn().mockReturnValue("<div>template</div>");
  return {
    readFileSync: mockRead,
    default: {
      readFileSync: mockRead,
    },
  };
});

vi.mock("path", () => {
  const mockJoin = vi.fn().mockReturnValue("dummy/path");
  return {
    join: mockJoin,
    default: {
      join: mockJoin,
    },
  };
});

const mockQuery = query as Mock;

describe("API 회원가입 핸들러 (POST /api/users/signup)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const validBody = {
    userid: "testuser",
    username: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  function createRequest(body: unknown) {
    return new NextRequest("http://localhost/api/users/signup", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  it("모든 필수 정보가 제공되면 회원가입에 성공하고 204 Created 응답을 반환해야 한다", async () => {
    // Given
    const req = createRequest(validBody);

    // Mock DB responses for successful flow
    mockQuery.mockResolvedValueOnce([]); // users
    mockQuery.mockResolvedValueOnce([]); // user_home
    mockQuery.mockResolvedValueOnce([]); // user_site_meta
    mockQuery.mockResolvedValueOnce([{ tid: 100 }]); // tabs
    mockQuery.mockResolvedValueOnce([]); // update slug

    // When
    const res = await POST(req);

    // Then
    expect(res.status).toBe(204); // ApiSuccess.created() without data returns 204
  });

  it("필수 필드(userid)가 누락되면 400 Bad Request를 반환해야 한다", async () => {
    // Given
    const body = { ...validBody, userid: "" };
    const req = createRequest(body);

    // When
    const res = await POST(req);
    const json = await res.json();

    // Then
    expect(res.status).toBe(400);
    expect(json.errorType).toBe("VALIDATION_ERROR");
  });

  it("이미 존재하는 사용자 ID로 가입 시도 시 409 Conflict를 반환해야 한다", async () => {
    // Given
    const req = createRequest(validBody);

    // Mock Duplicate Error from DB
    const dbError = new Error(
      "duplicate key value violates unique constraintUtils",
    ) as DBError;
    dbError.code = "23505";
    mockQuery.mockRejectedValueOnce(dbError);

    // When
    const res = await POST(req);
    const json = await res.json();

    // Then
    expect(res.status).toBe(409);
    expect(json.errorType).toBe("DUPLICATE_DATA");
  });

  it("DB 연결 실패 등 서버 에러 발생 시 503을 반환해야 한다", async () => {
    // Given
    const req = createRequest(validBody);

    // Mock DB Connection Error
    const dbError = new Error("Connection refused") as DBError;
    dbError.code = "ECONNREFUSED";
    mockQuery.mockRejectedValueOnce(dbError);

    // When
    const res = await POST(req);
    const json = await res.json();

    // Then
    expect(res.status).toBe(503);
    expect(json.errorType).toBe("DATABASE_CONNECTION_ERROR");
  });
});
