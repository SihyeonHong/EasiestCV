// 허용할 이미지 MIME 타입 목록
export const allowedTypes = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
];

// /기호가 json에 안 들어간대;
export const DEFAULT_IMG = "/icon.png";

// 예약어 (알파벳 순)
export const reservedWords = [
  "admin",
  "api",
  "changelog",
  "changelogs",
  "community",
  "dev",
  "faq",
  "guide",
  "guide-en",
  "guide-ko",
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
  "tester",
  "user",
];

// 문자 패턴 검사: 소문자, 숫자, 하이픈, 언더스코어만
export const stringPattern = /^[a-z0-9_-]+$/;
