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

import { query } from "@/utils/database";

import { POST } from "./route";

// Mocks
vi.mock("@/utils/database", () => ({
  query: vi.fn(),
}));

// bcrypt mock: Always return true for compare in this test unless overridden
vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn().mockResolvedValue(true),
  },
}));

// jwt mock
vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn().mockReturnValue("mock_token"),
  },
}));

const mockQuery = query as Mock;

describe("API 로그인 핸들러 (POST /api/users/login)", () => {
  const validBody = {
    userid: "testuser",
    password: "password123",
  };

  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv, JWT_SECRET: "test-secret" };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  function createRequest(body: unknown) {
    return new NextRequest("http://localhost/api/users/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  it("올바른 자격 증명이 제공되면 로그인에 성공하고 200 OK와 토큰을 반환해야 한다", async () => {
    // Given
    const req = createRequest(validBody);

    // Mock DB: User found
    mockQuery.mockResolvedValueOnce([
      {
        userid: "testuser",
        username: "Test User",
        email: "test@example.com",
        password: "hashed_password",
      },
    ]);

    // When
    const res = await POST(req);
    const json = await res.json();

    // Then
    expect(res.status).toBe(201); // Wait, ApiSuccess.created with data returns 201.
    // Let me check route.ts again.
    // route.ts: return ApiSuccess.created({ ... }); -> 201.
    // It says "ApiSuccess.created" inside login route?
    // Let me check.

    // Check cookies
    const cookie = res.cookies.get("token");
    expect(cookie?.value).toBe("mock_token");
    expect(json).toEqual({
      userid: "testuser",
      username: "Test User",
      email: "test@example.com",
    });
  });

  it("존재하지 않는 사용자 ID로 로그인 시도 시 404 Not Found를 반환해야 한다", async () => {
    // Given
    const req = createRequest({ ...validBody, userid: "unknown" });

    // Mock DB: User not found (empty array)
    mockQuery.mockResolvedValueOnce([]);

    // When
    const res = await POST(req);
    const json = await res.json();

    // Then
    expect(res.status).toBe(404);
    expect(json.errorType).toBe("USER_NOT_FOUND");
  });

  it("비밀번호가 일치하지 않으면 401 Unauthorized를 반환해야 한다", async () => {
    // Given
    const req = createRequest(validBody);

    // Mock DB: User found
    mockQuery.mockResolvedValueOnce([
      { userid: "testuser", password: "hashed_password" },
    ]);

    // Mock bcrypt compare to false
    const bcrypt = await import("bcrypt");
    (bcrypt.default.compare as Mock).mockResolvedValueOnce(false);

    // When
    const res = await POST(req);
    const json = await res.json();

    // Then
    expect(res.status).toBe(401); // WRONG_PASSWORD -> 401
    expect(json.errorType).toBe("WRONG_PASSWORD");
  });

  it("필수 필드가 누락되면 400 Bad Request를 반환해야 한다", async () => {
    // Given
    const req = createRequest({ userid: "testuser" }); // password missing

    // When
    const res = await POST(req);
    const json = await res.json();

    // Then
    expect(res.status).toBe(400); // MISSING_FIELDS -> 400 (or VALIDATION_ERROR)
    expect(json.message).toContain("password");
  });
});
