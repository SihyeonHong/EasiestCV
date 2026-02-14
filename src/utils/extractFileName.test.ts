import { describe, it, expect } from "vitest";

import extractFileName from "./extractFileName";

describe("extractFileName", () => {
  it("타임스탬프 접미사가 있는 전체 GCS URL에서 파일명을 추출해야 한다", () => {
    const url =
      "https://storage.googleapis.com/easiest-cv/profile.jpg-1678234567890";
    expect(extractFileName(url)).toBe("profile.jpg");
  });

  it("URL 경로 없이 타임스탬프 접미사만 있는 문자열에서도 파일명을 추출해야 한다", () => {
    const url = "profile.jpg-1678234567890";
    expect(extractFileName(url)).toBe("profile.jpg");
  });

  it("파일명에 대시(-)가 포함되어 있어도 올바르게 처리해야 한다", () => {
    // 타임스탬프는 항상 '마지막' 대시 뒤에 위치한다고 가정합니다
    // "my-profile-pic.jpg-12345" -> "my-profile-pic.jpg"
    const url =
      "https://storage.googleapis.com/easiest-cv/my-profile-pic.jpg-1678234567890";
    expect(extractFileName(url)).toBe("my-profile-pic.jpg");
  });

  it("대시(-)가 없으면 빈 문자열을 반환해야 한다 (가정된 형식 불일치)", () => {
    // 이 함수는 "파일명-타임스탬프" 형식을 가정하고 설계되었습니다
    // "/"로 분리 -> "image.png"
    // lastIndexOf("-") -> -1
    // substring(0, -1) -> ""
    const url = "https://storage.googleapis.com/easiest-cv/image.png";
    expect(extractFileName(url)).toBe("");
  });
});
