import { describe, it, expect } from "vitest";

import { validateUserId } from "@/utils/validateUserId";

describe("validateUserId", () => {
  // -- Given: 유효한 userId --
  describe("유효한 입력", () => {
    it("소문자 알파벳만 사용한 userId는 valid를 반환해야 한다", () => {
      expect(validateUserId("john")).toBe("valid");
    });

    it("소문자, 숫자, 하이픈, 언더스코어를 혼합한 userId는 valid를 반환해야 한다", () => {
      expect(validateUserId("user_name-01")).toBe("valid");
    });

    it("3자 길이의 userId는 valid를 반환해야 한다 (최소 길이)", () => {
      expect(validateUserId("abc")).toBe("valid");
    });

    it("20자 길이의 userId는 valid를 반환해야 한다 (최대 길이)", () => {
      expect(validateUserId("a".repeat(20))).toBe("valid");
    });
  });

  // -- Given: 길이가 규칙에 맞지 않는 userId --
  describe("길이 검증", () => {
    it("2자 이하의 userId는 lengthError를 반환해야 한다", () => {
      expect(validateUserId("ab")).toBe("lengthError");
    });

    it("빈 문자열은 lengthError를 반환해야 한다", () => {
      expect(validateUserId("")).toBe("lengthError");
    });

    it("21자 이상의 userId는 lengthError를 반환해야 한다", () => {
      expect(validateUserId("a".repeat(21))).toBe("lengthError");
    });
  });

  // -- Given: 허용되지 않는 문자가 포함된 userId --
  describe("문자 패턴 검증", () => {
    it("대문자가 포함된 userId는 invalidCharacters를 반환해야 한다", () => {
      expect(validateUserId("John")).toBe("invalidCharacters");
    });

    it("공백이 포함된 userId는 invalidCharacters를 반환해야 한다", () => {
      expect(validateUserId("john doe")).toBe("invalidCharacters");
    });

    it("특수문자(@)가 포함된 userId는 invalidCharacters를 반환해야 한다", () => {
      expect(validateUserId("john@doe")).toBe("invalidCharacters");
    });

    it("한글이 포함된 userId는 invalidCharacters를 반환해야 한다", () => {
      expect(validateUserId("사용자")).toBe("invalidCharacters");
    });
  });

  // -- Given: 예약어에 해당하는 userId --
  describe("예약어 검증", () => {
    it("'admin'은 reservedWords를 반환해야 한다", () => {
      expect(validateUserId("admin")).toBe("reservedWords");
    });

    it("'api'는 reservedWords를 반환해야 한다", () => {
      expect(validateUserId("api")).toBe("reservedWords");
    });

    it("'login'은 reservedWords를 반환해야 한다", () => {
      expect(validateUserId("login")).toBe("reservedWords");
    });

    it("'tester'는 reservedWords를 반환해야 한다", () => {
      expect(validateUserId("tester")).toBe("reservedWords");
    });
  });
});
