// Reusable API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string[];
  data: T;
  timestamp?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type OrderStatus = 
  | 'PAYMENT_PENDING' // for midtrans pending
  | 'PAYMENT_PAID' // for midtrans success
  | 'PAYMENT_FAILED' // for midtrans failed
  | 'CONFIRMED' // confirmed payment by mamabear 
  | 'PROCESSED' // mamabear process order: packing and assigning courier
  | 'SENDING' // courier transporting order
  | 'RECEIVED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'RETURNED';

export interface SalesTrend {
  period: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface SalesReportData {
  totalRevenue: number;
  orderCount: number;
  avgOrderValue: number;
  trends: SalesTrend[];
  topProducts: TopProduct[];
}

export interface SalesReportQuery {
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  productId?: number;
  status?: OrderStatus;
  period?: 'daily' | 'weekly' | 'monthly';
}

export interface ProductPerformanceData {
  Product: string;
  Variant: string;
  sku: string;
  category: string;
  salesCount: number;
  revenue: number;
}

// --- New Dashboard Types ---

export interface DashboardRecentOrderItem {
  product: { name: string };
  variant: { name: string };
}

export interface DashboardRecentOrder {
  orderItems: DashboardRecentOrderItem[];
  user: { name: string; email: string };
}

export interface DashboardLowStockProduct {
  name: string; // This maps to the variant name
  stock: number;
  product: { name: string };
}

export interface DashboardTopSellingVariant {
  name: string;
  priceIdr: string;
}

export interface DashboardTopSellingProduct {
  name: string;
  totalSold: number;
  variants: DashboardTopSellingVariant[];
}

export interface DashboardReportData {
  getRevenueOrders: unknown[]; // Empty in example, defined as unknown array for safety
  totalRevenue: number;
  getOrderCount: number;
  getCustomerCount: number;
  getProductCount: number;
  getRecentOrder: DashboardRecentOrder[];
  getLowStockProducts: DashboardLowStockProduct[];
  getTopSellingProducts: DashboardTopSellingProduct[];
}