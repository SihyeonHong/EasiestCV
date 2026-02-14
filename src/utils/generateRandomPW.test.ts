import { describe, it, expect } from "vitest";

import { generateRandomPW } from "./generateRandomPW";

describe("generateRandomPW", () => {
  it("길이가 10인 문자열을 반환해야 한다", () => {
    const password = generateRandomPW();
    expect(password).toHaveLength(10);
  });

  it("영문자와 숫자로만 구성된 문자열을 반환해야 한다", () => {
    const password = generateRandomPW();
    // 영문자 및 숫자 정규식: ^[a-zA-Z0-9]+$
    expect(password).toMatch(/^[a-zA-Z0-9]+$/);
  });

  it("연속으로 호출했을 때 서로 다른 비밀번호를 생성해야 한다 (확률적)", () => {
    const pw1 = generateRandomPW();
    const pw2 = generateRandomPW();
    expect(pw1).not.toBe(pw2);
  });
});
