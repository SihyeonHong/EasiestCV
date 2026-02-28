import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSendMail = vi.fn();
const mockCreateTransport = vi.fn(() => ({ sendMail: mockSendMail }));

vi.mock("nodemailer", () => ({
  default: { createTransport: mockCreateTransport },
}));

describe("mailer 모듈", () => {
  const MOCK_ENV = {
    email_host: "smtp.test.com",
    email_port: "465",
    email_user: "admin@easiest-cv.com",
    email_pass: "test-password",
  };

  beforeEach(() => {
    vi.resetModules();
    vi.mock("nodemailer", () => ({
      default: { createTransport: mockCreateTransport },
    }));
    mockCreateTransport.mockClear();
    mockCreateTransport.mockReturnValue({ sendMail: mockSendMail });
  });

  // -- Given: 환경변수가 누락된 상태 --
  describe("환경변수 가드", () => {
    it("필수 환경변수가 하나라도 누락되면 에러를 throw해야 한다", async () => {
      // Given: email_host가 누락된 환경
      vi.stubEnv("email_host", "");
      vi.stubEnv("email_port", MOCK_ENV.email_port);
      vi.stubEnv("email_user", MOCK_ENV.email_user);
      vi.stubEnv("email_pass", MOCK_ENV.email_pass);

      // When & Then
      await expect(() => import("@/utils/mailer")).rejects.toThrow(
        "Email Environment Variables not set",
      );
    });

    it("모든 환경변수가 비어있으면 에러를 throw해야 한다", async () => {
      // Given: 모든 이메일 환경변수가 빈 문자열
      vi.stubEnv("email_host", "");
      vi.stubEnv("email_port", "");
      vi.stubEnv("email_user", "");
      vi.stubEnv("email_pass", "");

      // When & Then
      await expect(() => import("@/utils/mailer")).rejects.toThrow(
        "Email Environment Variables not set",
      );
    });
  });

  // -- Given: 환경변수가 모두 설정된 상태 --
  describe("transporter 설정", () => {
    beforeEach(() => {
      vi.stubEnv("email_host", MOCK_ENV.email_host);
      vi.stubEnv("email_port", MOCK_ENV.email_port);
      vi.stubEnv("email_user", MOCK_ENV.email_user);
      vi.stubEnv("email_pass", MOCK_ENV.email_pass);
    });

    it("createTransport에 올바른 SMTP 설정이 전달되어야 한다", async () => {
      await import("@/utils/mailer");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const config = (mockCreateTransport as any).mock.calls[0][0];

      // resetPW/route.ts: host, port, secure, auth.user(=email_user), auth.pass
      // contact/route.ts: host, port, secure, auth.user(=email_user), auth.pass
      expect(config).toEqual({
        host: MOCK_ENV.email_host,
        port: MOCK_ENV.email_port,
        secure: true,
        auth: {
          user: MOCK_ENV.email_user,
          pass: MOCK_ENV.email_pass,
        },
      });
    });

    it("transporter에 sendMail 메서드가 존재해야 한다", async () => {
      const { transporter } = await import("@/utils/mailer");

      expect(typeof transporter.sendMail).toBe("function");
    });
  });

  // -- Given: 두 라우트가 SENDER_EMAIL을 각각 from, to로 사용 --
  describe("SENDER_EMAIL", () => {
    it("email_user 환경변수 값과 동일해야 한다", async () => {
      // resetPW/route.ts: from: SENDER_EMAIL (기존 email_user)
      // contact/route.ts: to: SENDER_EMAIL (기존 ADMIN_EMAIL)
      vi.stubEnv("email_host", MOCK_ENV.email_host);
      vi.stubEnv("email_port", MOCK_ENV.email_port);
      vi.stubEnv("email_user", MOCK_ENV.email_user);
      vi.stubEnv("email_pass", MOCK_ENV.email_pass);

      const { SENDER_EMAIL } = await import("@/utils/mailer");

      expect(SENDER_EMAIL).toBe(MOCK_ENV.email_user);
    });
  });
});
