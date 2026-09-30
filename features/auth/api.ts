import { apiClient } from "@/lib/api/client";
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
} from "./types";

export async function login(
  payload: LoginRequest,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    "/auth/login",
    payload,
  );

  return response.data;
}

export async function register(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    "/auth/register",
    payload,
  );

  return response.data;
}

export async function forgotPassword(
  payload: ForgotPasswordRequest,
): Promise<void> {
  await apiClient.post("/auth/forgot-password", payload);
}