export type DiscountType = 'PRODUCT_PERCENTAGE' | 'PRODUCT_FIXED' | 'FREE_SHIPPING';

export interface Promo {
  id: number;
  code: string;
  title: string | null;
  description: string | null;
  discountType: DiscountType;
  discountValue: string;
  minSpendIdr: number;
  maxDiscountIdr: number | null;
  maxShippingDiscountIdr: number | null;
  usageLimit: number;
  usageCount: number;
  maxUsagePerUser: number;
  isActive: boolean;
  startedAt: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromoDto {
  code: string;
  title?: string;
  description?: string;
  discountType: DiscountType;
  discountValue: string | number;
  minSpendIdr: string | number;
  maxDiscountIdr?: string | number;
  maxShippingDiscountIdr?: string | number;
  usageLimit: number;
  maxUsagePerUser: number;
  isActive: boolean;
  startedAt: string;
  expiresAt: string;
}

export type UpdatePromoDto = Partial<CreatePromoDto>;
