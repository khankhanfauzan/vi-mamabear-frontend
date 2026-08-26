/**
 * Global API Response Wrapper
 * Matches the backend contract: { success, statusCode, message, data, timestamp }
 */
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}
