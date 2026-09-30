export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user?: AuthUser;
}