import { describe, it, expect } from "vitest";

import { getMissingFields } from "./validateMissingFields";

describe("getMissingFields", () => {
  it("모든 필드가 유효하면 빈 배열을 반환해야 한다", () => {
    const fields = {
      name: "John",
      age: 30,
      isActive: true,
    };
    expect(getMissingFields(fields)).toEqual([]);
  });

  it("null, undefined, 또는 빈 문자열인 필드들의 키를 반환해야 한다", () => {
    const fields = {
      param1: null,
      param2: undefined,
      param3: "",
      validParam: "ok",
    };
    expect(getMissingFields(fields)).toEqual(["param1", "param2", "param3"]);
  });

  it("0이나 false는 누락된 값으로 간주하지 않아야 한다", () => {
    const fields = {
      count: 0,
      isValid: false,
    };
    expect(getMissingFields(fields)).toEqual([]);
  });

  it("유효한 필드와 누락된 필드가 섞여 있어도 올바르게 동작해야 한다", () => {
    const fields = {
      name: "Alice",
      nickname: "", // 누락됨
      score: 0, // 유효함
    };
    expect(getMissingFields(fields)).toEqual(["nickname"]);
  });
});
