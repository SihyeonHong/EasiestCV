export interface User {
  userid: string;
  username?: string;
  email?: string;
  title?: string;
  description?: string;
}

export interface LoginForm {
  userid: string;
  password: string;
}

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
