import { ApiResponse } from "@/types/api.types";

/**
 * Interface representing a Customer item from the MamaBear admin panel.
 */
export interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: "USER" | "ADMIN";
  isBlocked: boolean;
  registeredAt: string;
  updatedAt: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string | null;
}

/**
 * Interface for the pagination metadata.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Filter and sorting criteria for querying the customers endpoint.
 */
export interface CustomerQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  isBlocked?: boolean;
  sortBy?: 'name' | 'email' | 'createdAt' | 'totalSpent' | 'totalOrders';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Represents the structured data block within the primary API response wrapper.
 */
export interface CustomersPayload {
  success: boolean;
  data: Customer[];
  pagination: PaginationMeta;
}

/**
 * Complete typed response for fetching customers.
 */
export type CustomersResponse = ApiResponse<CustomersPayload>;

/**
 * Interface representing a customer's registered shipping/billing address.
 */
export interface CustomerAddress {
  id: number;
  name: string;
  phone: string;
  provinceName: string;
  cityName: string;
  districtName: string;
  subdistrictName: string;
  postalCode: string;
  road: string;
  completeAddress: string;
  detail: string | null;
  usedFor: string;
}

/**
 * Interface representing a brief summary of a customer's order history.
 */
export interface CustomerOrderHistory {
  id: string;
  status: string;
  subtotalIdr: number;
  taxIdr: number;
  shippingCostIdr: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface representing the comprehensive detailed data for a single Customer.
 */
export interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN";
  isBlocked: boolean;
  registeredAt: string;
  updatedAt: string;
  addresses: CustomerAddress[];
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string | null;
  orderHistory: CustomerOrderHistory[];
}

/**
 * Complete typed response for fetching a single customer detail.
 */
export type CustomerDetailResponse = ApiResponse<CustomerDetail>;
