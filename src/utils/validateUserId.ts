import { reservedWords, stringPattern } from "@/constants/constants";

export function validateUserId(userId: string): UserIdValidationResult {
  // 길이 검사
  if (userId.length < 3 || userId.length > 20) {
    return "lengthError";
  }

  if (!stringPattern.test(userId)) {
    return "invalidCharacters";
  }

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
