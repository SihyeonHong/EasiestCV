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
