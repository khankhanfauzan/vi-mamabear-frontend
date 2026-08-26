import {ApiResponse} from "@/types/api.types";

export interface LoginPayload {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterPayload {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  terms: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
}

export type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  backToHref?: string;
  backToLabel?: string;
  showImage?: boolean;
};

/**
 * User Profile Shape
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  phone?: string;
}

/**
 * Authentication Data
 */
export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type LoginResponse = ApiResponse<AuthData>;
export type RegisterResponse = ApiResponse<{
  message: string;
  verificationToken: string;
}>;
