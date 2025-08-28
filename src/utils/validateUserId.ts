export function validateUserId(userId: string): UserIdValidationResult {
  // 길이 검사
  if (userId.length < 3 || userId.length > 20) {
    return "lengthError";
  }

  // 문자 패턴 검사: 소문자, 숫자, 하이픈, 언더스코어만
  const pattern = /^[a-z0-9_-]+$/;

  if (!pattern.test(userId)) {
    return "invalidCharacters";
  }

  // 예약어 (알파벳 순)
  const reservedWords = [
    "admin",
    "api",
    "changelog",
    "changelogs",
    "community",
    "dev",
    "faq",
    "help",
    "info",
    "login",
    "log",
    "logs",
    "notice",
    "public",
    "qna",
    "service",
    "signup",
    "static",
    "support",
    "tab",
    "tabs",
    "user",
  ];

  if (reservedWords.includes(userId)) {
    return "reservedWords";
  }

  return "valid";
}

type UserIdValidationResult =
  | "valid"
  | "reservedWords"
  | "invalidCharacters"
  | "lengthError";
