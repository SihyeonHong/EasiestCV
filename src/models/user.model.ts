import { Locale } from "@/i18n/routing";

export interface User {
  userid: string;
  username: string;
  email: string;
}

// Form Types

export interface LoginForm {
  userid: string;
  password: string;
}

// API Request & Response

export interface SignupRequest {
  userid: string;
  username: string;
  email: string;
  password: string;
}

export interface ChangePWRequest {
  userid: string;
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  userid: string;
  email: string;
  locale: Locale;
}
