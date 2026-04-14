// 파일 데이터 타입
export type FileData = {
  pdf?: string;
};

// PDF 업로드 변수 타입
export type UploadPdfVariables = {
  userid: string;
  file: File;
};

// PDF 업로드 응답 타입
export type UploadPdfResponse = {
  pdfUrl?: string; // 성공 시 서버에서 pdfUrl을 내려줌
  error?: string;
};

// 허용할 이미지 MIME 타입 목록
export const allowedImgTypes = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
] as const;

// 에러 메시지용 이미지 타입 목록 (allowedImgTypes에서 자동 생성)
export const allowedImgTypesForMessage = (() => {
  const imageTypes = allowedImgTypes.map((type) => {
    // "image/jpeg" -> "JPEG", "image/png" -> "PNG" 등으로 변환
    return type.split("/")[1].toUpperCase();
  });
  // 중복 제거 및 정렬
  return Array.from(new Set(imageTypes)).sort();
})();

// 허용되는 이미지 콘텐츠 타입
export type AllowedImageContentType = (typeof allowedImgTypes)[number];

// 허용할 문서 MIME 타입 목록
export const allowedDocMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
  "text/plain",
  "text/html",
  "application/x-hwp",
  "application/haansofthwp", // hwpx
] as const;

// 접근성을 위한 문서 확장자 배열
export const allowedDocExtensions = [
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".txt",
  ".html",
  ".hwp",
  ".hwpx",
] as const;

// 에러 메시지용 문서 확장자 문자열 (예: "pdf, doc, docx...")
export const allowedDocTypesForMessage = allowedDocExtensions
  .map((ext) => ext.replace(".", "").toUpperCase())
  .join(", ");

// 허용되는 문서 콘텐츠 타입
export type AllowedDocumentContentType = (typeof allowedDocMimeTypes)[number];

// GCS 업로드 시 사용되는 유효한 콘텐츠 타입
export type AllowedContentType =
  | AllowedImageContentType
  | AllowedDocumentContentType;
