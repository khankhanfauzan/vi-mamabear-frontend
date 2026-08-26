import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/features/auth/types/auth.types";
import { API_BASE_URL } from "@/lib/config";
import { ApiResponse } from "@/types/api.types";

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const response = await res.json();

  // If the HTTP status is not 2xx, OR if your custom success flag is false
  if (!res.ok || !response.success) {
    throw new Error(response.message || "Terjadi kesalahan saat login.");
  }

  return response;
}

/**
 * Registers a new user account.
 */
export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.fullname,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
    }),
  });

  const response: RegisterResponse = await res.json();

  if (!res.ok || !response.success) {
    throw new Error(response.message || "Gagal mendaftarkan akun.");
  }

  return response;
}

export async function verifyEmail(token: string): Promise<ApiResponse<null>> {
  const res = await fetch(`${API_BASE_URL}/auth/verify-email/${token}`, {
    method: "GET",
  });

  const response: ApiResponse<null> = await res.json();

  if (!res.ok || !response.success) {
    throw new Error(
      response.message || "Link verifikasi tidak valid atau kadaluarsa.",
    );
  }

  return response;
}

/**
 * Sends a password reset request to trigger a recovery email from the backend.
 */
export async function requestPasswordReset(
  email: string,
): Promise<ApiResponse<null>> {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const response = await res.json();

  if (!res.ok || !response.success) {
    throw new Error(response.message || "Gagal mengirim tautan reset.");
  }

  return response;
}

/**
 * Submits the new password using the verification token.
 * Hits backend endpoint: POST /auth/reset-password/:token
 */
export async function confirmPasswordReset(
  token: string,
  password: string,
): Promise<ApiResponse<null>> {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  const response = await res.json();

  if (!res.ok || !response.success) {
    throw new Error(
      response.message || "Gagal mengatur ulang password. Silakan coba lagi.",
    );
  }

  return response;
}
