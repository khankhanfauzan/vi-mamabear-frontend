// Define the specific roles available in the system
export type UserRole = "ADMIN" | "SUPERADMIN" | "USER";

export interface AdminUserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole | "";
  isVerified?: boolean;
  sortBy?: "name" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for the pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// New interface for creating an admin
export interface CreateAdminPayload {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
}

// Interface for the inner data object containing the user array and pagination
export interface AdminUsersInnerData {
  success: boolean;
  data: AdminUser[];
  pagination: PaginationMeta;
}

// Interface for the outer base response matching the provided JSON structure
export interface AdminUsersBaseResponse {
  success: boolean;
  statusCode: number;
  message: string[];
  data: AdminUsersInnerData;
  timestamp: string;
}

// Interface for a single user response (used in Get by ID, Create, and Update)
export interface SingleAdminUserResponse {
  success: boolean;
  statusCode: number;
  message: string[];
  data: AdminUser;
  timestamp: string;
}
