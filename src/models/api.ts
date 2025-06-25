export interface ApiErrorResponse {
  message: string;
  errorType?: string;
}

export interface DBError extends Error {
  code?: string;
  detail?: string;
  constraint?: string;
  table?: string;
  column?: string;
}
