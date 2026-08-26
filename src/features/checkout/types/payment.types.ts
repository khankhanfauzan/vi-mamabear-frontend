/**
 * Customer information required for transaction generation.
 */
export interface CustomerDetail {
  firstName: string;
  email: string;
  phone: string;
}

/**
 * Request payload structure for initiating a new Midtrans transaction.
 */
export interface CreatePaymentPayload {
  orderId: string;
  subtotal: number;
  customerDetails: CustomerDetail[];
}

/**
 * Transaction tokens and redirect URL returned from Midtrans backend.
 */
export interface PaymentTransaction {
  token: string;
  paymentRedirectUrl: string;
}