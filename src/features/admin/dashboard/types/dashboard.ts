// ----------------------------------------------------------------------
// Interfaces for Dashboard API Responses
// ----------------------------------------------------------------------

/**
 * Global API Response Interface
 * Note: You might already have this in your global types (e.g., src/types/api.ts).
 * If so, you can remove this and import it directly.
 */
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string[];
  data: T;
  timestamp?: string;
  // pagination?: PaginationMeta; // From guidelines, if applicable
}

// ----------------------------------------------------------------------
// Specific Feature Types
// ----------------------------------------------------------------------

export interface DashboardRecentOrderItem {
  product: {
    name: string;
  };
  variant: {
    name: string;
  };
}

export interface DashboardRecentOrder {
  orderItems: DashboardRecentOrderItem[];
  user: {
    name: string;
    email: string;
  };
}

export interface DashboardLowStockProduct {
  name: string;
  stock: number;
  product: {
    name: string;
  };
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

/**
 * Main Data Structure for the Dashboard response
 */
export interface DashboardData {
  // Marked as unknown array since the provided JSON sample was empty: []
  // TODO: Update this type once the actual shape of getRevenueOrders is known
  getRevenueOrders: unknown[];

  totalRevenue: number;
  getOrderCount: number;
  getCustomerCount: number;
  getProductCount: number;
  getRecentOrder: DashboardRecentOrder[];
  getLowStockProducts: DashboardLowStockProduct[];
  getTopSellingProducts: DashboardTopSellingProduct[];
}

// ----------------------------------------------------------------------
// Sales Report Types
// ----------------------------------------------------------------------

export interface SalesTrend {
  period: string;
  revenue: number;
  orders: number;
}

export interface SalesTopProduct {
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
  topProducts: SalesTopProduct[];
}
