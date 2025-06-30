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

  // 예약어 금지
  const reservedWords = [
    "login",
    "signup",
    "admin",
    "api",
    "user",
    "static",
    "public",
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
